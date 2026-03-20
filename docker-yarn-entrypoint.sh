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

# Delegate to the original entrypoint script
echo "Delegating to the original entrypoint script..."
/usr/local/bin/docker-entrypoint.sh "$@"
