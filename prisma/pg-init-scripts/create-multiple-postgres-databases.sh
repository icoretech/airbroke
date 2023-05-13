#!/bin/bash

set -e
set -u

# This function creates a user and a database with the specified name.
# It then grants all privileges on the new database to the new user.
create_user_and_database() {
  local database=$1
  echo "  Creating user and database '$database'"

  psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    CREATE USER "$database";
    CREATE DATABASE "$database";
    GRANT ALL PRIVILEGES ON DATABASE "$database" TO "$database";
EOSQL
}

# If POSTGRES_MULTIPLE_DATABASES is set, create multiple databases
# and associated users as specified in the environment variable.
if [ -n "${POSTGRES_MULTIPLE_DATABASES:-}" ]; then
  echo "Multiple database creation requested: $POSTGRES_MULTIPLE_DATABASES"

  # Convert comma-separated list of databases into an array
  IFS=',' read -ra databases <<<"${POSTGRES_MULTIPLE_DATABASES//\"/}"

  # Iterate over the databases array and create each user and database
  for db in "${databases[@]}"; do
    create_user_and_database "$db"
  done

  echo "Multiple databases created"
fi
