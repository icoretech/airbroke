# TypeScript and UI

## TypeScript Baseline

- TypeScript runs in `strict` mode
- Use the `@/` alias for project imports
- Keep type-only imports separate when possible
  because Biome warns on mixed import style
- `components/ui/**` is excluded from the TypeScript project, so changes there
  need extra manual attention

## Component Boundaries

- Default to server components and server helpers unless the code needs browser
  APIs, client-side interactivity, or React hooks
- Mark interactive files with `"use client"` explicitly
- Keep mutations in server actions and feed the result back through refresh,
  revalidation, or redirect flows instead of duplicating server state locally
- Do not import server-only helpers such as `lib/db.ts` or auth internals into
  client components

## UI Stack

- Shared primitives live under `components/ui/`
- The project is configured for shadcn-style components with the `new-york`
  preset, CSS variables, Lucide icons, and `app/globals.css`
- `components/ai-elements/**` is also skipped by Biome, so treat it like a
  vendor-style surface: edit sparingly and verify the consumer manually

## Practical Rules

- Prefer existing primitives and wrappers before adding a new UI abstraction
- Keep route-specific charts, filters, and dialogs close to the feature they
  serve, then extract only when they become shared
- When a UI file must stay client-side, keep data fetching and secret-bearing
  work on the server and pass only the minimum data down
