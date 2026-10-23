#!/usr/bin/env bash
# Host-side shell and Compose contract checks; application commands remain in Compose.
set -euo pipefail
root=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT
fail() { printf 'FAIL %s\n' "$*" >&2; exit 1; }
pass() { printf 'PASS %s\n' "$*"; }
bash -n "$root/bin/ci-quality.sh"
shellcheck "$root/bin/ci-quality.sh" "$root/bin/ci-quality.test.sh"
pass 'bash syntax and ShellCheck'
export GITHUB_ACTIONS=true GITHUB_REPOSITORY=example-org/sample-app GITHUB_REPOSITORY_ID=123
export GITHUB_RUN_ID=456 GITHUB_RUN_ATTEMPT=1 GITHUB_SHA=0000000000000000000000000000000000000000
export GITHUB_EVENT_NAME=push GITHUB_REF=refs/heads/main
export CI_PROJECT=airbroke-ci-456-1 CI_TOOLS_IMAGE=airbroke-ci-tools:contract
export CI_WORKSPACE_VOLUME=airbroke-ci-456-1-workspace RUNNER_TEMP="$tmp"
export CI_QUALITY_CACHE="$RUNNER_TEMP/airbroke-quality-cache"
unset DOCKER_HOST DOCKER_CONTEXT DOCKER_TLS_VERIFY DOCKER_CERT_PATH

docker compose --env-file /dev/null -f "$root/docker-compose.ci.yml" config --format json > "$tmp/compose.json"
python3 - "$tmp/compose.json" <<'PY'
import json
import sys
with open(sys.argv[1]) as handle:
    config = json.load(handle)
services = config['services']
assert set(services) == {'seed', 'pg', 'quality'}
for service in services.values():
    assert not service.get('ports')
    assert not service.get('privileged')
    assert not any(key in service for key in ('cpus', 'cpu_quota', 'cpu_period', 'cpuset'))
    assert service['labels']['io.airbroke.ci.run'] == '456'
    assert service['memswap_limit'] == service['mem_limit']
assert services['quality']['mem_limit'] == '12884901888'
assert int(services['quality']['pids_limit']) == 1024
assert services['pg']['mem_limit'] == '4294967296'
assert services['pg']['tmpfs'] == ['/var/lib/postgresql:size=2147483648,mode=0700']
assert not services['pg'].get('command')
assert services['pg']['entrypoint'][-1] == 'chown postgres:postgres /var/lib/postgresql; exec /usr/local/bin/docker-entrypoint.sh postgres'
assert services['seed']['network_mode'] == 'none'
assert services['quality']['environment']['YARN_CACHE_FOLDER'] == '/yarn-cache'
mounts = {volume['target']: volume for volume in services['quality']['volumes']}
assert mounts['/workspace']['type'] == 'volume'
assert mounts['/yarn-cache']['type'] == 'bind'
assert mounts['/workspace/.next/cache']['type'] == 'bind'
assert mounts['/yarn-cache']['source'].endswith('/airbroke-quality-cache/yarn')
assert mounts['/workspace/.next/cache']['source'].endswith('/airbroke-quality-cache/next')
assert services['quality']['environment']['DATABASE_URL'].split('@')[1].startswith('pg/')
assert all(volume['external'] for volume in config['volumes'].values())
print('PASS real Compose parser: resource bounds, isolation, PG18 mount, external caches')
PY
mkdir "$tmp/bin"
cat > "$tmp/bin/uname" <<'SH'
#!/usr/bin/env bash
case "$1" in -s) echo "${HOST_OS:-Linux}" ;; -m) echo "${HOST_ARCH:-x86_64}" ;; *) exit 1 ;; esac
SH
chmod +x "$tmp/bin/uname"
cat > "$tmp/bin/docker" <<'SH'
#!/usr/bin/env bash
set -euo pipefail
printf '%s\n' "$*" >> "$CALLS"
case "$*" in
  'context show') echo "${CONTEXT_NAME:-default}" ;;
  'context inspect default --format {{.Endpoints.docker.Host}}') echo "${CONTEXT_ENDPOINT:-unix:///var/run/docker.sock}" ;;
  'info --format {{.OSType}}/{{.Architecture}}') echo "${DAEMON_PLATFORM:-linux/x86_64}" ;;
  'container ls -aq --filter label=com.docker.compose.project=airbroke-ci-456-1')
    [[ ${RESOURCE_STATE:-absent} == absent ]] || echo fixture-container ;;
  'container inspect --format '*) echo "${OWNER:-123:456:1}" ;;
  'network inspect airbroke-ci-456-1_default'|'volume inspect airbroke-ci-456-1-workspace')
    [[ ${RESOURCE_STATE:-absent} != absent ]] ;;
  'network inspect --format '*|'volume inspect --format '*) echo "${OWNER:-123:456:1}" ;;
  'container rm -f fixture-container'|'network rm airbroke-ci-456-1_default'|'volume rm airbroke-ci-456-1-workspace') : ;;
  *) printf 'unexpected Docker command: %s\n' "$*" >&2; exit 97 ;;
esac
SH
chmod +x "$tmp/bin/docker"
export PATH="$tmp/bin:$PATH" CALLS="$tmp/calls"
refuses() {
  local label=$1 expected=$2
  shift 2
  : > "$CALLS"
  if "$@" > "$tmp/output" 2>&1; then fail "$label accepted"; fi
  grep -Fq "$expected" "$tmp/output" || { cat "$tmp/output"; fail "$label reason"; }
  if grep -Eq '( rm |volume create|build |compose )' "$CALLS"; then fail "$label mutated Docker"; fi
  pass "$label rejected before mutation"
}
refuses 'missing Actions context' 'GitHub Actions environment required' env GITHUB_ACTIONS=false bash "$root/bin/ci-quality.sh" cleanup
refuses 'invalid run identifier' 'GITHUB_RUN_ID must be' env GITHUB_RUN_ID=../456 bash "$root/bin/ci-quality.sh" cleanup
refuses 'pull request source' 'only branch push' env GITHUB_EVENT_NAME=pull_request bash "$root/bin/ci-quality.sh" cleanup
refuses 'tag source' 'only branch push' env GITHUB_REF=refs/tags/v1 bash "$root/bin/ci-quality.sh" cleanup
refuses 'invalid SHA' 'invalid source SHA' env GITHUB_SHA=HEAD bash "$root/bin/ci-quality.sh" cleanup
refuses 'non-native host' 'native Linux amd64 host' env HOST_OS=Darwin bash "$root/bin/ci-quality.sh" cleanup
refuses 'non-default context' 'default local Docker context' env CONTEXT_NAME=remote bash "$root/bin/ci-quality.sh" cleanup
refuses 'remote default context' 'local system Docker socket' env CONTEXT_ENDPOINT=tcp://example.com:2376 bash "$root/bin/ci-quality.sh" cleanup
refuses 'remote endpoint' 'Docker endpoint overrides' env DOCKER_HOST=tcp://example.com:2376 bash "$root/bin/ci-quality.sh" cleanup
refuses 'emulated architecture' 'native Linux amd64' env DAEMON_PLATFORM=linux/aarch64 bash "$root/bin/ci-quality.sh" cleanup
refuses 'source mismatch' 'checkout HEAD differs' bash "$root/bin/ci-quality.sh" run
refuses 'unexpected cache directory' 'expected runner temporary quality cache path' env CI_QUALITY_CACHE=/tmp/foreign-cache bash "$root/bin/ci-quality.sh" cleanup
refuses 'foreign container' 'refusing foreign container' env RESOURCE_STATE=present OWNER=999:456:1 bash "$root/bin/ci-quality.sh" cleanup
: > "$CALLS"
RESOURCE_STATE=present bash "$root/bin/ci-quality.sh" cleanup
for command in 'container rm -f fixture-container' 'network rm airbroke-ci-456-1_default' 'volume rm airbroke-ci-456-1-workspace'; do
  grep -Fxq "$command" "$CALLS" || fail "owned cleanup missing: $command"
done
if grep -Eq 'prune|down|airbroke-ci-123-main-node.*(rm|remove)|(rm|remove).*airbroke-ci-123-main-node' "$CALLS"; then fail 'cleanup touched cache or broad resources'; fi
pass 'owned cleanup removes exact per-run containers, network and workspace only (Docker CLI fixture)'
: > "$CALLS"
bash "$root/bin/ci-quality.sh" cleanup
bash "$root/bin/ci-quality.sh" cleanup
if grep -q ' rm ' "$CALLS"; then fail 'absent cleanup mutated resources'; fi
pass 'absent cleanup is idempotent (Docker CLI fixture)'
