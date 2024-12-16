#!/bin/sh
set -e

# Run Yarn install to set up dependencies
echo "Running yarn install..."
yarn install

# Run database migrations
echo "Running database migrations..."
yarn run db:migrate

# Delegate to the original entrypoint script
echo "Delegating to the original entrypoint script..."
/usr/local/bin/docker-entrypoint.sh "$@"
