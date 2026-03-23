# Upgrade Guide

This document tracks upgrade notes that need more context than the changelog.
Keep the newest entry first and focus on operator-facing changes: required env
renames, database migrations, auth changes, removed behavior, and any manual
validation needed after deploy.

## 1.2.0

Upgrade from: 1.1.103

Why this needs a minor bump instead of 1.1.104:

- Authentication moved from NextAuth to Better Auth
- Required auth environment variables changed
- The auth-related Prisma schema changed and needs a database migration

### Breaking changes

- `AUTH_SECRET` is replaced by `BETTER_AUTH_SECRET`
- `AUTH_URL` is replaced by `BETTER_AUTH_URL`
- `NEXTAUTH_SECRET` is replaced by `BETTER_AUTH_SECRET`
- `NEXTAUTH_URL` is replaced by `BETTER_AUTH_URL`
- `AUTH_DEBUG` is no longer used
- `AUTH_TRUST_HOST` is no longer used
- The auth database schema now uses the Better Auth-compatible layout

### Database changes

Airbroke ships the Prisma migration
`prisma/migrations/20260322190000_better_auth/migration.sql` for this upgrade.

The migration performs these schema changes:

- `accounts` moves from NextAuth-style `provider` / `provider_account_id` fields
  to Better Auth-style `provider_id` / `account_id`
- `sessions` moves from `session_token` to `token`
- `users.email_verified` moves from timestamp-based semantics to boolean
- `verification_tokens` is replaced by `verifications`

Operational hurdle to account for before rollout:

- Prisma migrations must run as the owning role of the existing auth tables
- if legacy tables such as `accounts`, `sessions`, `users`, or
  `verification_tokens` are owned by `postgres` or another superuser while the
  app connects as `airbroke`, the migration can fail with
  `ERROR: must be owner of table accounts`
- on existing installations, verify table ownership before rollout and fix it
  before retrying a failed migration

### Upgrade steps

1. Deploy the 1.2.0 code and install dependencies
2. Update environment variables:
   - set `BETTER_AUTH_SECRET`
   - set `BETTER_AUTH_URL`
   - remove legacy `AUTH_SECRET`, `AUTH_URL`, `NEXTAUTH_SECRET`,
     `NEXTAUTH_URL`, `AUTH_DEBUG`, and `AUTH_TRUST_HOST`
   - if you deploy through Helm or another manifest layer, update renamed env
     keys there too, not only in the secret payload
3. Run the database migration:
   - `corepack yarn db:migrate`
   - ensure the database user running migrations owns the auth tables in
     `public`
   - if Prisma already recorded a failed `20260322190000_better_auth`
     migration, resolve that failed row before retrying deploy
4. Verify sign-in and sign-out flows against the providers you have enabled
5. Expect existing sessions to require re-authentication after the auth-system
   switch

### Post-upgrade checks

- confirm `/api/auth/[...all]` is reachable in the deployed app
- confirm `/signin` shows the configured providers instead of an empty list
- confirm at least one real provider login succeeds
- confirm protected routes still redirect anonymous users correctly
- confirm new sessions are persisted in the updated `sessions` table layout

## Entry template

Use this shape for future entries:

```md
## x.y.z

Upgrade from: previous supported version range

Why this needs a version bump:

- short reason

### Breaking changes

- item

### Database changes

- item

### Upgrade steps

1. step

### Post-upgrade checks

- item
```
