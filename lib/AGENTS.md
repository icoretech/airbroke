# APPLICATION LIBRARY GUIDE

## OVERVIEW

`lib/` is the application and server layer, not a generic utility bucket. It
owns reads, mutations, auth policy, intake semantics, MCP behavior, and routing.

## STRUCTURE

```text
actions/       # Authenticated server mutations and invalidation
auth/          # Better Auth providers, restrictions, and session helpers
intake/        # Airbrake/Sentry normalization and shared persistence
mcp/           # MCP transport, schemas, tools, and read models
queries/       # UI-facing Prisma read paths
integrations/  # SDK metadata and generated setup snippets
routing/       # Breadcrumb and search-parameter contracts
cache/         # Shared cache tags
db.ts          # Lazy shared Prisma client boundary
```

## WHERE TO LOOK

| Task | Location | Notes |
| --- | --- | --- |
| Database client | `db.ts` | Callable lazy proxy; one shared entrypoint |
| Mutation guard | `actions/requireAuth.ts` | Run before protected writes |
| UI invalidation | `actions/revalidateProjectShellPaths.ts` | Project paths |
| Auth configuration | `auth/index.ts` | Lazy initialization is build-critical |
| Intake identity | `intake/upsertNoticeOccurrence.ts` | Grouping and retries |
| MCP registry | `mcp/tools.ts` | Public tool list and result contract |
| MCP security | `mcp/server.ts` | Key, origin, CORS, per-request handler |

## CONVENTIONS

- Import `db` from `lib/db.ts`; never construct an ad hoc Prisma client.
- Server actions begin with `"use server"`, authenticate before protected
  mutations, and pair writes with the paths or tags their consumers render.
- Preserve Next control flow with `unstable_rethrow` or redirects outside broad
  catch blocks.
- `lib/queries/` is the default UI read layer. MCP keeps protocol-specific
  resolution and response shaping under `lib/mcp/readModels/`.
- Intake groups notices by project, environment, and kind; occurrences by
  notice and SHA-256 message hash. Existing occurrences are reinstated and
  unique races receive bounded `P2002` retries.
- Better Auth is initialized lazily so imports and production builds do not
  require provider runtime configuration.
- MCP tools validate Zod inputs, stay read-only, normalize tool results, and
  make ambiguous project references explicit rather than guessing.
- Recreate the MCP transport handler per request; its collaborator retains
  request/session state internally.

## ANTI-PATTERNS

- Do not turn `utils.ts` into a home for domain behavior; use the matching
  action, query, intake, auth, MCP, integration, or routing module.
- Do not duplicate grouping or persistence rules between Airbrake and Sentry.
- Do not weaken MCP timing-safe key comparison, origin checks, read-only hints,
  strict schemas, pagination limits, or structured ambiguity errors.
- Do not expose additional project credentials through MCP setup-guide output
  without explicit security review and accepted/rejected tests.
- Do not change trigger-dependent resolution behavior without reviewing the
  corresponding Prisma migration SQL and action tests.
