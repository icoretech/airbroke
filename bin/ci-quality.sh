#!/usr/bin/env bash
set -euo pipefail

fail() { printf 'ci-quality: %s\n' "$*" >&2; exit 1; }
phase() {
  local label=$1 start=$SECONDS rc=0
  shift
  printf 'phase=%s started\n' "$label"
  "$@" || rc=$?
  printf 'phase=%s seconds=%s exit=%s\n' "$label" "$((SECONDS - start))" "$rc"
  return "$rc"
}

# This branch executes only inside the fresh Compose workspace.
if [[ ${1:-} == phases ]]; then
  [[ $PWD == /workspace && ${CI:-} == true && ${TESTING:-} == true ]] || fail 'phases requires the isolated CI workspace'
  # A kernel lock prevents eviction while another run uses this trust-scoped store.
  exec 9>/yarn-cache/.ci-lock
  flock 9
  trim_cache() {
    find /yarn-cache -maxdepth 1 -name '*.zip' -type f -mtime +30 -delete
    local archive
    while (( $(du -sk /yarn-cache | cut -f1) > 8388608 )); do
      archive=$(find /yarn-cache -maxdepth 1 -name '*.zip' -type f -printf '%T@ %p\n' | sort -n | sed -n '1s/^[^ ]* //p')
      [[ -n $archive ]] || break
      rm -- "$archive"
    done
  }
  trim_cache
  git init --quiet
  git config user.name 'CI Validation'
  git config user.email 'ci@example.com'
  git add .
  git -c core.hooksPath=/dev/null commit --quiet -m 'CI source snapshot'
  printf 'yarn-cache-before=%s\n' "$(find /yarn-cache -type f | wc -l)"
  phase install yarn install --immutable
  trim_cache
  printf 'yarn-cache-after=%s\n' "$(find /yarn-cache -type f | wc -l)"
  phase biome yarn biome:ci
  phase react-doctor yarn react-doctor:ci
  phase typecheck yarn typecheck
  phase migrations yarn prisma migrate deploy
  phase tests yarn test --run --no-file-parallelism --maxWorkers=1
  phase build env NODE_ENV=production yarn build
  exit
fi

mode=${1:-run}
[[ $mode == run || $mode == cleanup ]] || fail 'usage: ci-quality.sh run|cleanup'
[[ ${GITHUB_ACTIONS:-} == true ]] || fail 'GitHub Actions environment required'
for key in GITHUB_REPOSITORY_ID GITHUB_RUN_ID GITHUB_RUN_ATTEMPT; do
  [[ ${!key:-} =~ ^[1-9][0-9]*$ ]] || fail "$key must be a positive integer"
done
[[ ${GITHUB_REPOSITORY:-} =~ ^[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+$ ]] || fail 'invalid repository'
[[ ${GITHUB_SHA:-} =~ ^[0-9a-f]{40}$ ]] || fail 'invalid source SHA'
[[ ${GITHUB_REF:-} == refs/heads/* && ${GITHUB_EVENT_NAME:-} == push ]] || fail 'only branch push runs are supported'
[[ $(uname -s)/$(uname -m) == Linux/x86_64 ]] || fail 'native Linux amd64 host required'
[[ -z ${DOCKER_HOST:-} && -z ${DOCKER_CONTEXT:-} && -z ${DOCKER_TLS_VERIFY:-} && -z ${DOCKER_CERT_PATH:-} ]] || fail 'Docker endpoint overrides are forbidden'
[[ $(docker context inspect default --format '{{.Endpoints.docker.Host}}') == unix:///var/run/docker.sock ]] || fail 'local system Docker socket required'
[[ $(docker context show) == default ]] || fail 'default local Docker context required'
[[ $(docker info --format '{{.OSType}}/{{.Architecture}}') =~ ^linux/(x86_64|amd64)$ ]] || fail 'native Linux amd64 Docker daemon required'
trust=validation
[[ $GITHUB_REF != refs/heads/main ]] || trust=main
repo=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)
cd "$repo"
node_version=$(sed -n 's/^FROM node:\([0-9][0-9.]*\)-alpine$/\1/p' Dockerfile.ci)
yarn_version=$(sed -n 's/.*"packageManager": "yarn@\([0-9][0-9.]*\)".*/\1/p' package.json)
[[ $node_version =~ ^[0-9]+\.[0-9]+\.[0-9]+$ && $yarn_version =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]] || fail 'cannot determine pinned Node/Yarn versions'
[[ -f .yarn/releases/yarn-$yarn_version.cjs ]] || fail 'pinned Yarn release missing'
export CI_PROJECT="airbroke-ci-$GITHUB_RUN_ID-$GITHUB_RUN_ATTEMPT"
export CI_WORKSPACE_VOLUME="$CI_PROJECT-workspace"
export CI_DEPENDENCY_CACHE="airbroke-ci-$GITHUB_REPOSITORY_ID-$trust-node$node_version-yarn$yarn_version"
export CI_TOOLS_IMAGE="airbroke-ci-tools:$GITHUB_REPOSITORY_ID-$trust-node$node_version-yarn$yarn_version"
compose=(docker compose --env-file /dev/null -f "$repo/docker-compose.ci.yml" --project-name "$CI_PROJECT")
owned() {
  local kind=$1 id=$2 actual
  actual=$(docker "$kind" inspect --format '{{ index .Labels "io.airbroke.ci.repository" }}:{{ index .Labels "io.airbroke.ci.run" }}:{{ index .Labels "io.airbroke.ci.attempt" }}' "$id") || return 1
  [[ $actual == "$GITHUB_REPOSITORY_ID:$GITHUB_RUN_ID:$GITHUB_RUN_ATTEMPT" ]]
}
cleanup() {
  local id actual containers rc=0
  containers=$(docker container ls -aq --filter "label=com.docker.compose.project=$CI_PROJECT") || return 1
  while IFS= read -r id; do
    [[ -n $id ]] || continue
    actual=$(docker container inspect --format '{{ index .Config.Labels "io.airbroke.ci.repository" }}:{{ index .Config.Labels "io.airbroke.ci.run" }}:{{ index .Config.Labels "io.airbroke.ci.attempt" }}' "$id") || return 1
    [[ $actual == "$GITHUB_REPOSITORY_ID:$GITHUB_RUN_ID:$GITHUB_RUN_ATTEMPT" ]] || { printf 'refusing foreign container %s\n' "$id" >&2; return 1; }
    docker container rm -f "$id" || rc=1
  done <<< "$containers"
  id="${CI_PROJECT}_default"
    if docker network inspect "$id" >/dev/null 2>&1; then
      owned network "$id" || { printf 'refusing foreign network %s\n' "$id" >&2; return 1; }
      docker network rm "$id" || rc=1
    fi
  if docker volume inspect "$CI_WORKSPACE_VOLUME" >/dev/null 2>&1; then
    owned volume "$CI_WORKSPACE_VOLUME" || { printf 'refusing foreign workspace %s\n' "$CI_WORKSPACE_VOLUME" >&2; return 1; }
    docker volume rm "$CI_WORKSPACE_VOLUME" || rc=1
  fi
  return "$rc"
}
if [[ $mode == cleanup ]]; then cleanup; exit; fi
[[ $(git rev-parse HEAD) == "$GITHUB_SHA" ]] || fail 'checkout HEAD differs from source SHA'
[[ -z $(git status --porcelain --untracked-files=all) ]] || fail 'checkout must be clean'
[[ $(git remote get-url origin) == "https://github.com/$GITHUB_REPOSITORY" || $(git remote get-url origin) == "https://github.com/$GITHUB_REPOSITORY.git" ]] || fail 'checkout repository differs from GitHub repository'
# Existing per-run state is never reused, even after an interrupted execution.
[[ -z $(docker container ls -aq --filter "label=com.docker.compose.project=$CI_PROJECT") ]] || fail 'attempt containers already exist; clean this attempt first'
if docker network inspect "${CI_PROJECT}_default" >/dev/null 2>&1; then fail 'attempt network already exists; clean this attempt first'; fi
if docker volume inspect "$CI_WORKSPACE_VOLUME" >/dev/null 2>&1; then fail 'workspace already exists; clean this attempt first'; fi
cache_owner=$(docker volume inspect --format '{{ index .Labels "io.airbroke.ci.cache" }}' "$CI_DEPENDENCY_CACHE" 2>/dev/null || true)
[[ -z $cache_owner || $cache_owner == "$GITHUB_REPOSITORY_ID:$trust:node$node_version:yarn$yarn_version" ]] || fail 'foreign dependency cache'
if docker volume inspect "$CI_DEPENDENCY_CACHE" >/dev/null 2>&1; then
  [[ $cache_owner == "$GITHUB_REPOSITORY_ID:$trust:node$node_version:yarn$yarn_version" ]] || fail 'unlabelled dependency cache'
else
  docker volume create --label "io.airbroke.ci.cache=$GITHUB_REPOSITORY_ID:$trust:node$node_version:yarn$yarn_version" "$CI_DEPENDENCY_CACHE" >/dev/null
fi
docker volume create --label "io.airbroke.ci.repository=$GITHUB_REPOSITORY_ID" --label "io.airbroke.ci.run=$GITHUB_RUN_ID" --label "io.airbroke.ci.attempt=$GITHUB_RUN_ATTEMPT" "$CI_WORKSPACE_VOLUME" >/dev/null
trap 'rc=$?; trap - EXIT; cleanup || rc=1; exit "$rc"' EXIT
trap 'exit 130' INT
trap 'exit 143' TERM
phase tools docker build --builder default --tag "$CI_TOOLS_IMAGE" - < Dockerfile.ci
# Git archive excludes ignored/untracked files and the checkout Git configuration.
git archive --format=tar "$GITHUB_SHA" | "${compose[@]}" run --rm --no-deps -T seed
phase quality "${compose[@]}" run --rm -T quality
