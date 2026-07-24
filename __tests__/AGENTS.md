# TEST GUIDE

## OVERVIEW

All Vitest tests live here and mirror runtime boundaries. Tests run serially in
the dedicated `test` service against `testdb`, never the development database.

## STRUCTURE

```text
api/         # Collector, completion, and MCP route contracts
components/  # Maintained React component behavior
lib/         # Auth, actions, queries, intake, routing, and SDK contracts
pages/       # Page-level rendering and authentication behavior
factories/   # Prisma-backed unique fixture builders
helpers/     # Next navigation and HTTP capture boundaries
proxy.test.ts
```

## WHERE TO LOOK

| Task | Location | Notes |
| --- | --- | --- |
| Configuration | `../vitest.config.mjs` | jsdom, serial execution |
| Navigation | `helpers/nextNavigation.ts` | `next/navigation` alias |
| DB fixtures | `factories/prismaFactories.ts` | Unique attributes |
| Collectors | `api/` and `lib/` | Accepted/rejected flows |

## CONVENTIONS

- Use `// @vitest-environment node` for server-only route, auth, or SDK tests;
  the default environment is `jsdom`.
- Run deterministic checks with
  `docker compose -f docker-compose.yml --profile test run --rm test yarn test --run`;
  the test service is one-shot and starts its dedicated database through the
  profile.
- Keep tests under this tree rather than beside Next application source.
- Match the touched runtime boundary: route handlers under `api/`, domain logic
  under `lib/`, components under `components/`, and pages under `pages/`.
- Prefer real `NextRequest`, parser, generated client, or narrow collaborator
  calls at drift-prone boundaries. Mock database or external services only
  where the test's subject is the surrounding contract.
- Factories must preserve uniqueness across the whole serial suite; continue
  using UUID-backed values for unique columns.

## ANTI-PATTERNS

- Do not execute tests through `web`; its `DATABASE_URL` targets development.
- Do not rely on file concurrency or test order; shared database state has no
  global transaction/truncation harness.
- Do not test only accepted input when changing auth, origin/CORS, collector,
  MCP, payload-limit, or credential behavior.
- Do not assert redirect behavior by replacing the repository navigation helper
  with a one-off incompatible mock.
- Do not treat coverage inclusion as proof of behavioral coverage; there is no
  configured coverage threshold.
