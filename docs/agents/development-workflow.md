# Development Workflow

## Container First

This repo is developed through Docker Compose. Start the main services before
running repository commands:

```sh
docker compose up -d web test db testdb
```

Use `docker compose exec` against running services for normal work:

- `web`: app runtime, Prisma commands, linting, typechecking, production build
- `test`: Vitest execution against the dedicated `testdb` service

Use host commands only for Docker diagnostics such as `docker compose ps`,
`docker compose logs`, or image and volume troubleshooting.

## Common Commands

```sh
docker compose exec web yarn typecheck
docker compose exec web yarn biome:lint
docker compose exec web env NODE_ENV=production yarn build
docker compose exec web yarn db:generate
docker compose exec web yarn db:migrate
docker compose exec web yarn db:seed
docker compose exec test yarn test --run
```

## Database Workflow

- `DATABASE_URL` is required at runtime.
- `DIRECT_URL` is required for migrations when the main URL points through a
  pooler or proxy.
- The compose stack already wires `web` to `db` and `test` to `testdb`.
  Keep app commands on `web` and test commands on `test` so development data
  and test data stay separate.
- Postgres 18+ is mounted at `/var/lib/postgresql`, not
  `/var/lib/postgresql/data`.

## Build and Dependency Changes

- Rebuild or restart the compose services after changing `package.json`,
  `yarn.lock`, Dockerfiles, or dependency-related env.
- The production image uses `output: "standalone"`.
  The runtime server is assembled from `.next/standalone`, `.next/static`,
  `public/`, and `prisma/`.
- Keep `.env` aligned with `.env.dist` and real local values before debugging
  runtime issues.

## Make Targets

The `Makefile` is only a thin Docker wrapper:

- `make build`: `docker compose build --pull`
- `make run`: `docker compose up ... --remove-orphans`
- `make stop`: `docker compose down --remove-orphans`
- `make resetdb`: isolated `prisma migrate reset --force`
