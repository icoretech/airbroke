#!/bin/sh
set -e

# Run Yarn install to set up dependencies
echo "Running yarn install..."
yarn install

# Wait for the database to become available
echo "Waiting for database to be ready..."
until nc -z -v -w30 db 5432; do
  echo "Waiting for postgres database connection..."
  sleep 1
done

# Run database migrations
echo "Running database migrations..."
yarn run db:migrate

# Delegate to the original entrypoint script
echo "Delegating to the original entrypoint script..."
/usr/local/bin/docker-entrypoint.sh "$@"
