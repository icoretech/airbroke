# Upgrade Guide

This document tracks upgrade notes that need more context than the changelog.
Keep the newest entry first and focus on operator-facing changes: required env
renames, database migrations, auth changes, removed behavior, and any manual
validation needed after deploy.

## Better Auth 1.7.2

This dependency refresh upgrades Better Auth from 1.6.x to 1.7.2. It changes
generic OAuth from plugin-specific client endpoints to Better Auth's standard
social sign-in flow and changes the database identity used for accounts.

### Breaking changes

- Generic OAuth clients must initiate sign-in through the standard
  `signIn.social` flow using the configured provider ID. Do not continue to
  call a generic-OAuth-plugin-specific sign-in endpoint.
- Register the standard callback route with every generic OAuth provider:
  `https://<your-airbroke-url>/api/auth/callback/<provider-id>`. Replace any
  previously registered plugin-specific callback URL before enabling the new
  deployment.

### Database changes

This upgrade ships the Prisma migration
`prisma/migrations/20260904140000_better_auth_v17_account_identity/migration.sql`.

The migration adds the `accounts.issuer` identity namespace and creates the
unique `accounts_issuer_account_id_key` index required by Better Auth 1.7. It
backfills credential accounts to use their local `user_id` as `account_id`,
uses `local:credential` for credential issuers, and namespaces other provider
IDs as stable `local:oauth:` issuer values.

The migration deliberately fails rather than guess or merge data when it finds:

- an empty or missing `provider_id`
- a credential account without a non-empty `user_id`
- an empty or missing `account_id` after credential identities are derived
- multiple accounts that resolve to the same issuer and account ID

Resolve the reported account data before retrying a failed migration; do not
delete or merge accounts solely to make the migration succeed.

### Upgrade steps

1. Before the production cutover, take a restorable database backup and
   rehearse this migration and recovery procedure against a copy of production
   data. Plan a maintenance window: all Better Auth 1.6 application instances,
   workers, and other auth writers must be stopped before the migration starts
   and remain stopped until the 1.7.2 deployment is ready to serve traffic.
2. Update every generic OAuth provider registration to use
   `https://<your-airbroke-url>/api/auth/callback/<provider-id>`, and update
   any client that initiates generic OAuth to use standard `signIn.social`.
3. Deploy the code and dependencies for this refresh without resuming auth
   traffic, then run the database migration with the project command:
   `corepack yarn db:migrate`.
4. If the command reports malformed account identity data or an
   issuer/account-ID collision, keep the cutover paused, restore or correct the
   affected data using the rehearsed procedure, and rerun the migration. Do
   not restart any 1.6 auth writers after this migration has begun.
5. Start only the Better Auth 1.7.2 deployment after the migration succeeds.

### Post-upgrade checks

- complete a returning credential sign-in and confirm the expected account can
  access an authenticated route
- complete a returning OAuth sign-in for each enabled social or generic
  provider; confirm the provider redirects through
  `/api/auth/callback/<provider-id>` and returns to the application
- confirm the MCP endpoint at `/api/mcp` accepts a request using its configured
  access credential

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
