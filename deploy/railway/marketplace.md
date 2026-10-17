# Deploy and Host Airbroke on Railway

Self-hosted error collection and triage for your team. Receive errors from
Airbrake and Sentry clients, inspect stack traces and request details, track
occurrences, and manage issues in a web dashboard.

## About Hosting Airbroke

This template deploys an Airbroke service and a PostgreSQL 18 service connected
over private networking. PostgreSQL is the only service that needs a persistent
volume. This setup requires Airbroke 1.4.3 or newer.

## Why Deploy Airbroke on Railway?

- The published Airbroke stable image, `ghcr.io/icoretech/airbroke:latest`.
- PostgreSQL 18 with persistent storage and private application connectivity.
- Database migrations before deployment and a database-backed healthcheck.
- GitHub sign-in restricted to the organizations you choose.

## Common Use Cases

- Collect application errors from Airbrake and Sentry clients in one dashboard.
- Inspect stack traces and request details to investigate reported failures.
- Track error occurrences and manage issues with your team.

## Dependencies for Airbroke

### Deployment Dependencies

Airbroke requires PostgreSQL, which is included in the template. No Redis or
separate worker is required.

Choose at least one allowed GitHub organization before deployment.
Once the public domain is assigned, create a GitHub OAuth application to enable
sign-in for its members.

## Set up GitHub sign-in

1. Set `AIRBROKE_GITHUB_ORGS` to a nonempty comma-separated list of GitHub
   organization login names. Leave the OAuth client ID and secret empty for the
   initial deployment.
2. Deploy the template, then create a GitHub OAuth application. Set its homepage
   to your generated Airbroke HTTPS origin and its authorization callback to
   that origin followed by `/api/auth/callback/github`.
3. Set `AIRBROKE_GITHUB_ID` and `AIRBROKE_GITHUB_SECRET` in the Airbroke service's
   variables to the OAuth application's real client ID and secret. Confirm
   `BETTER_AUTH_URL` matches the public origin, then deploy the variable changes.
4. Open `/signin` and choose GitHub. Your organization may need to approve the
   OAuth app before members can sign in.

GitHub sign-in is unavailable until both OAuth credentials are configured.
There is no default password or bootstrap account. All authenticated users can
access every project in this installation, so keep the organization allowlist
configured. Once signed in, create a project and follow its client setup guide.

## Keep your data

The template generates application secrets for each installation; preserve them
across redeploys. Back up PostgreSQL before upgrades. Updating the application
image does not roll back database migrations. Existing installations can fetch
the current stable image by redeploying from source or enabling Railway image
auto updates; template edits do not update an existing project.

AI assistance and the read-only MCP endpoint are optional and require separate
configuration. See the [Railway deployment guide](https://github.com/icoretech/airbroke/blob/main/deploy/railway/README.md)
for variables, verification, backups, and update instructions, and the
[Airbroke repository](https://github.com/icoretech/airbroke) for features and
client integrations.
