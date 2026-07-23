# PRISMA GUIDE

## OVERVIEW

`prisma/` owns the deployed database contract and generated client boundary.
Schema, migrations, seed data, init scripts, and generated output have distinct
ownership rules.

## WHERE TO LOOK

| Task | Location | Notes |
| --- | --- | --- |
| Data model | `schema.prisma` | Hand-authored source of truth |
| Deployment history | `migrations/*/migration.sql` | Forward-only SQL |
| Client output | `generated/` | Generated and gitignored |
| Development seed | `seed.ts` | Idempotent upserts |
| Local Postgres bootstrap | `pg-init-scripts/` | Not mounted by base Compose |
| CLI configuration | `../prisma.config.ts` | Prefers `DIRECT_URL` |

## CONVENTIONS

- Change models in `schema.prisma`, add a new timestamped migration for deployed
  schema changes, then regenerate the client.
- Treat existing migrations as immutable production history. Review data
  transforms, indexes, constraints, triggers/functions, ownership, and cascade
  behavior, not only the final schema shape.
- Use `DIRECT_URL` for migrations or introspection when `DATABASE_URL` points
  through a pooler or proxy. Generation intentionally works without either URL.
- Keep seed behavior development-only and idempotent. Do not turn seed data into
  a production migration substitute.
- Run Prisma commands inside the `web` container. `db:migrate` uses
  `prisma migrate deploy`; it does not create development migrations.

## ANTI-PATTERNS

- Never edit `generated/`; `postinstall` and `db:generate` overwrite it.
- Never edit `migrations/migration_lock.toml` manually.
- Never rewrite an applied migration to match a newer desired schema.
- Never run migrations against the test database by borrowing the `web`
  service's development URL, or against a pooled URL when a direct URL exists.
- Do not assume `pg-init-scripts/` runs in the base stack; its Compose mount is
  currently commented out.
