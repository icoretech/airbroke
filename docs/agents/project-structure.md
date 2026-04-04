# Project Structure

## Overview

Airbroke uses the Next.js App Router. Most feature code lives under `app`,
`components`, `lib`, `prisma`, and `__tests__`.

## Layout

- `app/`: route segments, pages, layouts, and route handlers under `app/api`
- `components/`: shared presentation and feature UI
- `components/ui/`: shadcn-style primitives consumed by the rest of the app
- `lib/`: server helpers, auth, database access, cache helpers, queries, and
  server actions
- `prisma/`: schema, migrations, seed script, and generated client output
- `__tests__/`: mirrors app, components, and lib with factories and helpers

## Rules

- Keep route-local UI in the route segment when it is only used there.
  Move reusable pieces into `components/` or `lib/`.
- Keep server actions in `lib/actions/*` with `"use server"` at the top and
  keep their revalidation logic near the mutation.
- Reuse the shared Prisma entrypoint in `lib/db.ts`.
  Do not construct ad hoc Prisma clients in route handlers or components.
- Use the `@/` path alias instead of long relative imports.
- Treat `lib/queries/*` as the default read-path for database-backed UI.
  Keep mutations in server actions or dedicated server helpers.
- `components/ui/**` is excluded from the TypeScript project and both
  `components/ui/**` and `components/ai-elements/**` are skipped by Biome.
  If you edit either area, keep the change narrow and manually verify the
  consuming screens.

## Example Paths

- `app/projects/[project_id]`: project-centric pages and filters
- `app/api/mcp`: MCP JSON-RPC entrypoint
- `lib/auth.ts`: Better Auth configuration and provider restrictions
- `lib/actions/projectActions.ts`: server actions with revalidation and
  redirect flow
- `__tests__/lib/projectActions.test.ts`: server-action contract coverage
