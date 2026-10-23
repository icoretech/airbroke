#!/usr/bin/env bash
set -euo pipefail
real_docker=$(command -v docker)
real_uname=$(command -v uname)
export REAL_DOCKER_BIN="$real_docker" REAL_UNAME_BIN="$real_uname"
helper=$(cd "$(dirname "$0")" && pwd)/ci-image.sh
sandbox=$(mktemp -d)
trap 'rm -rf "$sandbox"' EXIT
mkdir -p "$sandbox/repo" "$sandbox/bin" "$sandbox/temp"
cd "$sandbox/repo"
git init -q
git config user.name 'CI Test'
git config user.email 'ci@example.com'
printf 'FROM scratch\nCOPY source /source\n' > Dockerfile
printf 'committed\n' > source
printf '.env\nnode_modules/\n' > .gitignore
git add .
git commit -qm 'test fixture'
export GITHUB_ACTIONS=true RUNNER_OS=Linux RUNNER_ARCH=X64
export GITHUB_SHA GITHUB_REPOSITORY=icoretech/airbroke GITHUB_EVENT_NAME=push
GITHUB_SHA=$(git rev-parse HEAD)
export GITHUB_RUN_ID=42 GITHUB_RUN_ATTEMPT=1 GITHUB_ACTOR=example-user
export RUNNER_TEMP="$sandbox/temp" TEST_LOG="$sandbox/docker.log"
export PATH="$sandbox/bin:$PATH"
printf 'dirty\n' > source
printf 'private\n' > .env
mkdir node_modules
printf 'untracked\n' > node_modules/file
cat > "$sandbox/bin/uname" <<'UNAME'
#!/usr/bin/env bash
case "$1" in -s) printf '%s\n' "${TEST_OS:-Linux}" ;; -m) printf '%s\n' "${TEST_MACHINE:-x86_64}" ;; esac
UNAME
chmod +x "$sandbox/bin/uname"
cat > "$sandbox/bin/docker" <<'DOCKER'
#!/usr/bin/env bash
set -euo pipefail
printf '%q ' "$@" >> "$TEST_LOG"
printf '\n' >> "$TEST_LOG"
case "$1 $2" in
  'context inspect') printf '%s\n' "${TEST_ENDPOINT:-unix:///var/run/docker.sock}" ;;
  'info --format') printf '%s\n' "${TEST_DAEMON:-linux/x86_64}" ;;
  'buildx inspect') printf 'Driver: %s\n' "${TEST_DRIVER:-docker}" ;;
  'buildx build')
    context=${!#}
    [[ $(cat "$context/source") == committed ]]
    [[ ! -e $context/.env && ! -e $context/node_modules && ! -e $context/.git ]]
    if [[ $("$REAL_UNAME_BIN" -s) == Darwin ]]; then
      [[ $(stat -f '%Lp' "$context") == 700 ]]
    else
      [[ $(stat -c '%a' "$context") == 700 ]]
    fi
    if [[ ${TEST_FAIL:-} == signal ]]; then kill -TERM "$PPID"; fi
    [[ ${TEST_FAIL:-} != build ]]
    ;;
  'image inspect')
    jq -n --arg sha "$GITHUB_SHA" --arg arch "${TEST_ARCH:-amd64}" '[{Architecture:$arch,Os:"linux",Config:{Labels:{"org.opencontainers.image.revision":$sha,"org.opencontainers.image.source":"https://github.com/icoretech/airbroke"}}}]'
    ;;
  'image rm') [[ ${TEST_FAIL:-} != cleanup ]] ;;
  'login ghcr.io')
    IFS= read -r token || true
    [[ $token == fixture-token ]]
    printf '{"auths":{}}' > "$DOCKER_CONFIG/config.json"
    [[ ${TEST_FAIL:-} != login ]]
    ;;
  'push '*)
    [[ ${TEST_FAIL:-} != push ]]
    printf 'tag: digest: sha256:%064d size: 100\n' 0
    ;;
  'buildx imagetools')
    if [[ ${*: -1} == '{{.Manifest.Digest}}' ]]; then
      printf 'sha256:%064d\n' "${TEST_DIGEST_NUMBER:-0}"
    else
      jq -n --arg sha "${TEST_REMOTE_SHA:-$GITHUB_SHA}" '{architecture:"amd64",os:"linux",config:{Labels:{"org.opencontainers.image.revision":$sha,"org.opencontainers.image.source":"https://github.com/icoretech/airbroke"}}}'
    fi
    ;;
  *) exit 99 ;;
esac
DOCKER
chmod +x "$sandbox/bin/docker"
pass() { printf 'PASS %s\n' "$1"; }
run_case() {
  local expected=$1 name=$2 rc=0
  : > "$TEST_LOG"
  bash "$helper" run > "$sandbox/output" 2>&1 || rc=$?
  if [[ $expected == pass ]]; then [[ $rc == 0 ]] || { cat "$sandbox/output"; exit 1; }; else [[ $rc != 0 ]]; fi
  [[ ! -e $RUNNER_TEMP/airbroke-image-42-1 ]]
  pass "$name"
}
export GITHUB_REF=refs/heads/Feature/MiXeD_branch
run_case pass 'branch build archives committed source, excludes host files, removes owned state'
if grep -Eq 'login|push|DEBUG_TOOLS|cache-from|cache-to|no-cache|prune' "$TEST_LOG"; then exit 1; fi
grep -q 'mixed-branch-' "$TEST_LOG"
pass 'branch has no auth, push, debug tools or remote cache'
export GITHUB_REF=refs/heads/main GITHUB_TOKEN=fixture-token
run_case pass 'main validates local and remote metadata and removes credentials'
grep -q 'DEBUG_TOOLS=true' "$TEST_LOG"
grep -q 'main-' "$TEST_LOG"
grep -q 'imagetools inspect ghcr.io/icoretech/airbroke@sha256:' "$TEST_LOG"
for failure in build login push signal; do
  export TEST_FAIL=$failure
  run_case fail "$failure failure removes owned state and credentials"
done
export TEST_FAIL=cleanup
rc=0
bash "$helper" run > "$sandbox/output" 2>&1 || rc=$?
[[ $rc != 0 ]]
[[ -f $RUNNER_TEMP/airbroke-image-42-1/tag ]]
[[ ! -e $RUNNER_TEMP/airbroke-image-42-1/docker && ! -e $RUNNER_TEMP/airbroke-image-42-1/context ]]
unset TEST_FAIL
bash "$helper" cleanup
[[ ! -e $RUNNER_TEMP/airbroke-image-42-1 ]]
pass 'failed image removal still deletes credentials and retains only retryable state'
export TEST_ARCH=arm64
run_case fail 'wrong local architecture prevents publishing'
if grep -q 'login' "$TEST_LOG"; then exit 1; fi
unset TEST_ARCH
export TEST_REMOTE_SHA=bad
run_case fail 'wrong remote revision fails publication verification'
unset TEST_REMOTE_SHA
export TEST_DIGEST_NUMBER=1
run_case fail 'remote tag digest mismatch fails verification'
unset TEST_DIGEST_NUMBER
export TEST_DRIVER=docker-container
run_case fail 'nonlocal driver refused'
unset TEST_DRIVER
for guard in TEST_OS TEST_MACHINE TEST_ENDPOINT TEST_DAEMON RUNNER_OS RUNNER_ARCH GITHUB_ACTIONS DOCKER_HOST DOCKER_CONTEXT DOCKER_TLS DOCKER_TLS_VERIFY DOCKER_CERT_PATH; do
  previous=${!guard:-}
  export "$guard=invalid"
  run_case fail "$guard guard refuses unsupported runner or daemon"
  if [[ -n $previous ]]; then export "$guard=$previous"; else unset "$guard"; fi
done
export GITHUB_REPOSITORY=example-org/airbroke
run_case fail 'fork repository refused before docker use'
[[ ! -s $TEST_LOG ]]
export GITHUB_REPOSITORY=icoretech/airbroke GITHUB_EVENT_NAME=pull_request
run_case fail 'pull request event refused'
export GITHUB_EVENT_NAME=push GITHUB_REF=refs/tags/v1.2.3
run_case fail 'tag refused'
export GITHUB_REF=refs/heads/release-please--branches--main--components--airbroke
run_case fail 'release automation branch refused'
export GITHUB_REF=refs/heads/main
unset GITHUB_TOKEN
run_case fail 'main without token cannot publish'
GITHUB_REF="refs/heads/$(printf '%0200d' 1)"
run_case pass 'long branch produces a valid bounded tag'
export GITHUB_REF=refs/heads/main
bash "$helper" cleanup
bash "$helper" cleanup
pass 'repeated always cleanup is idempotent'
printf 'All publisher contract tests passed (Docker commands stubbed; git archive is real).\n'

if [[ ${REAL_DOCKER:-0} == 1 ]]; then
  # Only the runner/daemon qualification responses are simulated on non-Linux hosts.
  # All image build/inspect/removal operations below call the real Docker CLI.
  cat > "$sandbox/bin/docker" <<'REAL'
#!/usr/bin/env bash
set -euo pipefail
case "$1 $2" in
  'context inspect') printf 'unix:///var/run/docker.sock\n' ;;
  'info --format') printf 'linux/x86_64\n' ;;
  *) exec "$REAL_DOCKER_BIN" "$@" ;;
esac
REAL
  chmod +x "$sandbox/bin/docker"
  export GITHUB_REF=refs/heads/contract-real
  bash "$helper" run
  [[ ! -e $RUNNER_TEMP/airbroke-image-42-1 ]]
  bash "$helper" run
  [[ ! -e $RUNNER_TEMP/airbroke-image-42-1 ]]
  pass 'real Docker scratch fixture builds amd64 twice and removes owned tags/state (host guards simulated)'
fi
