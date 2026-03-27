# Testing, PRs, and Security

## Testing Workflow

- Run tests from the `test` service, not from `web`
- Use targeted runs first during iteration, then widen before closing the task
- Typical commands:

```sh
docker compose exec test yarn test --run
docker compose exec test yarn test --run __tests__/lib/projectActions.test.ts
docker compose exec web yarn typecheck
docker compose exec web yarn biome:lint
```

## Vitest Contracts

- Default environment is `jsdom`
- Files that need server-only behavior should declare
  `// @vitest-environment node`
- `next/navigation` is aliased to `__tests__/helpers/nextNavigation.ts`
  for redirect and refresh assertions
- Coverage includes `lib/**/*.ts`, `app/**/*.ts(x)`, `components/**/*.tsx`,
  and `proxy.ts`
- Coverage excludes tests, generated code, and `lib/db.ts`
- Test sequencing runs with concurrency `1`

## What to Test

- Add or update tests in `__tests__/` alongside the touched area
- Prefer contract coverage around collector parsing, auth restrictions,
  server actions, and cache or redirect behavior
- Do not rely only on mocks when a narrow runtime-facing test is practical

## Security-Sensitive Areas

- Treat `BETTER_AUTH_SECRET`, `AIRBROKE_MCP_API_KEY`,
  `repo_provider_api_key`, and `repo_provider_api_secret` as sensitive
- Use redacted fixtures and env values in tests and docs
- When touching auth, MCP, or collector endpoints, cover both accepted and
  rejected flows
- Keep CORS and origin rules explicit when changing `/api/v3/*`, `/api/sentry/*`,
  or `/api/mcp`

## PR and Doc Hygiene

- Keep `README.md`, `.env.dist`, deploy manifests, and `UPGRADE.md` in sync when
  changing env vars, runtime commands, auth requirements, or deployment steps
- Use release-please compatible commit semantics
