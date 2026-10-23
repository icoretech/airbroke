#!/usr/bin/env bash
set -euo pipefail
umask 077

fail() { printf '%s\n' "$*" >&2; exit 1; }
mode=${1:-}
[[ "$mode" == run || "$mode" == cleanup ]] || fail 'usage: ci-image.sh run|cleanup'
[[ ${GITHUB_REPOSITORY:-} == icoretech/airbroke ]] || fail 'unexpected repository'
[[ ${GITHUB_EVENT_NAME:-} == push && ${GITHUB_REF:-} == refs/heads/* ]] || fail 'only branch push events are allowed'
[[ $GITHUB_REF != refs/heads/release-please--branches--main--components--airbroke ]] || fail 'release automation branch is excluded'
[[ ${GITHUB_RUN_ID:-} =~ ^[0-9]+$ && ${GITHUB_RUN_ATTEMPT:-} =~ ^[0-9]+$ ]] || fail 'invalid run identity'
[[ ${GITHUB_SHA:-} =~ ^[0-9a-f]{40}$ ]] || fail 'invalid source revision'
[[ -n ${RUNNER_TEMP:-} && -d $RUNNER_TEMP ]] || fail 'missing runner temporary directory'
[[ ${GITHUB_ACTIONS:-} == true && ${RUNNER_OS:-} == Linux && ${RUNNER_ARCH:-} == X64 ]] || fail 'native Linux x64 GitHub runner required'
[[ $(uname -s) == Linux && $(uname -m) == x86_64 ]] || fail 'native Linux x86_64 host required'
for override in DOCKER_HOST DOCKER_CONTEXT DOCKER_TLS DOCKER_TLS_VERIFY DOCKER_CERT_PATH; do
  [[ -z ${!override:-} ]] || fail "Docker override is forbidden: $override"
done
export DOCKER_CONTEXT=default
[[ $(docker context inspect default --format '{{.Endpoints.docker.Host}}') == unix:///var/run/docker.sock ]] || fail 'local default Docker socket required'
[[ $(docker info --format '{{.OSType}}/{{.Architecture}}') == linux/x86_64 ]] || fail 'local Linux amd64 daemon required'
state="$RUNNER_TEMP/airbroke-image-$GITHUB_RUN_ID-$GITHUB_RUN_ATTEMPT"
image=ghcr.io/icoretech/airbroke

cleanup() {
  [[ -d $state && ! -L $state ]] || return 0
  local tag rc=0
  if [[ -f $state/tag ]]; then
    tag=$(cat "$state/tag")
    [[ $tag =~ ^[a-z0-9][a-z0-9.-]*-${GITHUB_SHA:0:8}-[0-9]+$ && ${#tag} -le 128 ]] || return 1
    if docker image inspect "$image:$tag" >/dev/null 2>&1; then
      docker image rm "$image:$tag" || rc=$?
    fi
  fi
  # Credentials are removed even if image removal fails; retain the tag for retry.
  rm -rf "$state/docker" "$state/context"
  if [[ $rc == 0 ]]; then rm -rf "$state"; fi
  return "$rc"
}
if [[ $mode == cleanup ]]; then cleanup; exit; fi
[[ $(git rev-parse HEAD) == "$GITHUB_SHA" ]] || fail 'checkout does not match event revision'
[[ $(docker buildx inspect default | awk '$1 == "Driver:" {print $2}') == docker ]] || fail 'default Docker driver required for local cache'
mkdir "$state" || fail 'run already has image state; clean it before retrying'
trap 'rc=$?; trap - EXIT; cleanup || rc=1; exit "$rc"' EXIT
trap 'exit 130' INT
trap 'exit 143' TERM
mkdir "$state/context" "$state/docker"
# Docker Desktop installs CLI plugins below the user's config directory.
# Reuse executable discovery only; never copy host authentication or contexts.
plugin_dir="${DOCKER_CONFIG:-$HOME/.docker}/cli-plugins"
if [[ -d $plugin_dir ]]; then ln -s "$plugin_dir" "$state/docker/cli-plugins"; fi
export DOCKER_CONFIG="$state/docker"
# Archive committed files only; ignored runner files never enter the build context.
git archive --output="$state/source.tar" "$GITHUB_SHA"
tar -xf "$state/source.tar" -C "$state/context"
rm "$state/source.tar"
branch=${GITHUB_REF#refs/heads/}
branch=${branch##*/}
branch=$(printf '%s' "$branch" | LC_ALL=C tr '[:upper:]_' '[:lower:]-' | LC_ALL=C sed 's/[^a-z0-9.-]/-/g; s/^[.-]*//')
branch=${branch:-branch}
timestamp=$(date +%s)
suffix="-${GITHUB_SHA:0:8}-$timestamp"
branch=${branch:0:$((128 - ${#suffix}))}
tag="$branch$suffix"
printf '%s\n' "$tag" > "$state/tag"
args=(--builder default --platform linux/amd64 --load --provenance=false --pull
  --label "org.opencontainers.image.revision=$GITHUB_SHA"
  --label "org.opencontainers.image.source=https://github.com/$GITHUB_REPOSITORY"
  --tag "$image:$tag")
if [[ $GITHUB_REF == refs/heads/main ]]; then args+=(--build-arg DEBUG_TOOLS=true); fi
docker buildx build "${args[@]}" "$state/context"
docker image inspect "$image:$tag" > "$state/local.json"
jq -e --arg sha "$GITHUB_SHA" --arg source "https://github.com/$GITHUB_REPOSITORY" '
  length == 1 and .[0].Architecture == "amd64" and .[0].Os == "linux" and
  .[0].Config.Labels["org.opencontainers.image.revision"] == $sha and
  .[0].Config.Labels["org.opencontainers.image.source"] == $source
' "$state/local.json" >/dev/null
if [[ $GITHUB_REF == refs/heads/main ]]; then
  [[ -n ${GITHUB_TOKEN:-} && -n ${GITHUB_ACTOR:-} ]] || fail 'main publication requires the workflow token and actor'
  printf '%s' "$GITHUB_TOKEN" | docker login ghcr.io --username "$GITHUB_ACTOR" --password-stdin
  unset GITHUB_TOKEN
  docker push "$image:$tag" | tee "$state/push.log"
  digest=$(sed -n 's/.*digest: \(sha256:[0-9a-f]*\).*/\1/p' "$state/push.log" | tail -1)
  [[ $digest =~ ^sha256:[0-9a-f]{64}$ ]] || fail 'push returned no valid digest'
  [[ $(docker buildx imagetools inspect "$image:$tag" --format '{{.Manifest.Digest}}') == "$digest" ]] || fail 'published tag digest mismatch'
  docker buildx imagetools inspect "$image@$digest" --format '{{json .Image}}' > "$state/remote.json"
  jq -e --arg sha "$GITHUB_SHA" --arg source "https://github.com/$GITHUB_REPOSITORY" '
    .architecture == "amd64" and .os == "linux" and
    .config.Labels["org.opencontainers.image.revision"] == $sha and
    .config.Labels["org.opencontainers.image.source"] == $source
  ' "$state/remote.json" >/dev/null
  printf 'published %s:%s@%s revision=%s platform=linux/amd64\n' "$image" "$tag" "$digest" "$GITHUB_SHA"
else
  printf 'built %s:%s revision=%s platform=linux/amd64 (not published)\n' "$image" "$tag" "$GITHUB_SHA"
fi
