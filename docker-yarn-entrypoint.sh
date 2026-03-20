#!/bin/sh
set -e

# Run Yarn install to set up dependencies unless a compose bootstrap service
# already populated the shared bind mount.
if [ "${SKIP_YARN_INSTALL:-}" != "1" ]; then
  echo "Running yarn install..."
  yarn install || (echo "yarn install failed, printing build log(s):" && find /tmp -type f -name "build.log" -exec cat {} \; && exit 1)
else
  echo "Skipping yarn install..."
fi

# Run database migrations
echo "Running database migrations..."
yarn run db:migrate

# Avoid stale production/SSR artifacts polluting the Next dev runtime.
if [ "$1" = "yarn" ] && [ "${2:-}" = "dev" ]; then
  echo "Resetting .next before starting Next.js dev server..."
  if [ -d /app/.next ]; then
    stale_next_dir="/app/.next-stale-$$"
    rm -rf "$stale_next_dir" 2>/dev/null || true
    mv /app/.next "$stale_next_dir" 2>/dev/null || true
    mkdir -p /app/.next
    rm -rf "$stale_next_dir" >/dev/null 2>&1 &
  fi
fi

# Delegate to the original entrypoint script
echo "Delegating to the original entrypoint script..."
/usr/local/bin/docker-entrypoint.sh "$@"
