# PROJECT KNOWLEDGE BASE

**Generated:** 2026-07-24
**Commit:** 8a95b54b
**Branch:** main

## OVERVIEW

Airbroke is a self-hosted error collector and triage UI built with Next.js 16,
React 19, Prisma 7, and PostgreSQL 18. Development and verification are
Docker Compose-first; the repository pins Yarn 4.17.1.

## STRUCTURE

```text
app/          # App Router pages and external HTTP protocol handlers
components/   # Maintained feature UI plus registry-managed primitives
lib/          # Auth, actions, queries, intake, MCP, and shared server logic
prisma/       # Schema, forward migrations, seed, and generated client output
__tests__/    # Central Vitest suite mirroring runtime boundaries
docs/agents/  # Detailed cross-cutting guidance linked below
```

## WHERE TO LOOK

| Task | Location | Notes |
| --- | --- | --- |
| Routes and layouts | `app/` | Read `app/AGENTS.md` |
| Intake | `app/api/`, `lib/intake/` | Synchronous writes |
| Auth | `proxy.ts`, `lib/auth/` | Server checks are authoritative |
| UI | `components/` | Read `components/AGENTS.md` |
| Mutations | `lib/actions/` | Auth plus explicit invalidation |
| UI reads | `lib/queries/` | MCP has separate read models |
| MCP API | `app/api/mcp/`, `lib/mcp/` | Read-only tools and static-key auth |
| Data model | `prisma/` | Read `prisma/AGENTS.md` |
| Tests | `__tests__/` | Read `__tests__/AGENTS.md` |

## CODE MAP

Reference counts are unmeasured; relationships below come from direct source
imports and route delegation.

| Symbol | Type | Location | Refs | Role |
| --- | --- | --- | --- | --- |
| `db` | Prisma proxy | `lib/db.ts` | unmeasured | Lazy shared database client |
| `getAuth` | Factory | `lib/auth/index.ts` | unmeasured | Lazy auth setup |
| `requireAuth` | Guard | `lib/actions/requireAuth.ts` | n/a | Action auth |
| `upsertNoticeOccurrence` | Service | `lib/intake/` | n/a | Intake writes |
| `MCP_TOOLS` | Registry | `lib/mcp/tools.ts` | unmeasured | MCP contract |
| `handleMcpPost` | Handler | `lib/mcp/server.ts` | unmeasured | MCP transport |
| `revalidateProjectShellPaths` | Helper | `lib/actions/` | n/a | Invalidation |

## CONVENTIONS

- Use the `@/` alias for project imports. Biome owns formatting and import
  ordering; `biome:lint` writes changes while `biome:ci` is read-only.
- Keep route composition in `app`, reusable UI in `components`, UI read models
  in `lib/queries`, and mutations in `lib/actions`.
- Preserve `typedRoutes`, React Compiler, Cache Components, and standalone
  output contracts in `next.config.ts`.
- Keep local `.env` values current with `.env.dist` before runtime debugging.

## ANTI-PATTERNS (THIS PROJECT)

- Never run Yarn, Node, Next, Prisma, or Vitest directly on the host or through
  `docker exec`; use `docker compose exec` against a running service or
  `docker compose run --rm` for the profiled one-shot test service.
- Never point tests at the development `DATABASE_URL`; `test` owns `testdb`.
- Never hand-edit `prisma/generated/`, migration lock metadata, or registry
  primitives as if they were ordinary maintained source.
- Never restore deprecated `package.json#prisma` configuration or legacy
  NextAuth environment names.
- Do not replace `proxy.ts` with `middleware.ts` or swallow Next redirect
  control-flow errors in broad catch blocks.
- Do not revert or downgrade user dependency changes unless explicitly asked.

## COMMANDS

```sh
docker compose -f docker-compose.yml up -d web db
docker compose -f docker-compose.yml exec web yarn biome:ci
docker compose -f docker-compose.yml exec web yarn react-doctor:ci
docker compose -f docker-compose.yml exec web yarn typecheck
docker compose -f docker-compose.yml --profile test run --rm test yarn test --run
docker compose -f docker-compose.yml exec web env NODE_ENV=production yarn build
```

Use the explicit base file for tooling when the ignored local override adds
Caddy or conflicts on ports 80/443.

## DETAILED GUIDES

- [Project Structure](docs/agents/project-structure.md)
- [Development Workflow](docs/agents/development-workflow.md)
- [TypeScript and UI](docs/agents/typescript-and-ui.md)
- [Next.js 16](docs/agents/nextjs-16.md)
- [Testing, PRs, and Security](docs/agents/testing-pr-security.md)
