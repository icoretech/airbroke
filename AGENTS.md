# Repository Guidelines

## Project Structure & Module Organization

- `app/` — Next.js App Router routes, layouts, and API handlers (`app/api/**`).
- `components/` — Reusable UI/feature components (shadcn/ui, Tailwind v4).
- `lib/` — Server/client utilities, actions, caching, and helpers.
- `prisma/` — Prisma schema, migrations, and seeds.
- `public/` — Static assets (logos, images, fonts).
- `__tests__/` — Vitest tests (e.g., `__tests__/lib/*.test.ts`).

## Build, Test, and Development Commands

- `yarn dev` — Start the Next.js dev server.
- `yarn build` — Production build (Next 16, `output=standalone`).
- `yarn start` — Serve the production build.
- `yarn test` — Run Vitest tests.
- `yarn typecheck` — TypeScript project check.
- `yarn biome:lint` / `yarn format` — Biome linting/formatting.
- `yarn biome:check` / `yarn biome:ci` — Biome checks (no writes / CI mode).
- DB: `yarn db:migrate`, `yarn db:seed`, `yarn db:pull`, `yarn db:generate` (Prisma).

### Docker (local dev)

- running Yarn commands requires a running docker container:
  - Web: `docker exec airbroke-web-1 yarn …`
  - Tests: `docker exec airbroke-test-1 yarn …`

## Coding Style & Naming Conventions

- Language: TypeScript, React 19, Next.js 16 (App Router).
- Styling: Tailwind v4 with canonical gradient classes (e.g., `bg-linear-to-b`).
- Conventions: 2‑space indent; keep imports sorted/grouped. Components use PascalCase; hooks and utilities in `lib/` use camelCase.
- Lint/Format: Biome is the source of truth (`yarn biome:ci` in CI).
- UI: Prefer shadcn/ui primitives and composition patterns; avoid bespoke CSS where a component exists.

### TypeScript Strictness (Important)

- Do not use `any`. Prefer precise types and inference. If a cast is unavoidable, target the most specific type (e.g., `Route` from `next`) rather than broad types.
- Limit `unknown`. Prefer structural types over `unknown` or `any` when refining values (e.g., `const nav = navigator as Navigator & { userAgentData?: { platform?: string } }`).
- Avoid `@ts-ignore`/eslint/biome disables. Model the types correctly or narrow with type guards.
- Next typed routes: cast internal hrefs to `Route` from `next` instead of using `any`.

## Next.js 16 Guidelines

- Keep layouts static: avoid Dynamic APIs (`cookies()`, `headers()`, `draftMode()`, etc.) in layouts; isolate dynamic work in pages/components.
- Cache intentionally and revalidate after mutations (`revalidatePath` / `revalidateTag`).
- Redirects in server actions: `redirect()` throws a special NEXT_REDIRECT error; don’t catch it (or navigation won’t happen). Catch DB work only, not the redirect.

## UI / shadcn

- Prefer shadcn/ui primitives and composition.
- Forms: shadcn `Form` helpers are being deprecated in favor of `Field` (see shadcn “Field” docs); prefer `Field*` primitives for new/updated forms.
- Lists/rows: use `Item`, `ItemMedia`, `ItemContent`, `ItemTitle`, `ItemDescription`, `ItemActions` (and avoid manual icon sizing/margins inside `ItemMedia`).

### Charts (Recharts)

- Keep charts as Client Components and data loaders as Server Components.
- Always set an explicit chart height (e.g., `ChartContainer` + `ResponsiveContainer height="100%"`) to avoid 0px collapse.
- Prefer numeric UTC timestamps for time axes.

## React Compiler Hygiene

- Avoid `try/catch/finally` blocks (especially `finally`) inside render callbacks; prefer promise `.catch/.finally` patterns for async event handlers.
- Avoid manual memoization with overly-narrow dependency arrays when the component depends on broader objects (let the compiler/runtime handle it).

## Testing Guidelines

- Framework: Vitest + Testing Library (jsdom for DOM tests).
- Naming: `*.test.ts` / `*.test.tsx` under `__tests__/` or co‑located.
- Scope: Favor small, deterministic unit tests for helpers/components; avoid network calls.
- Run: `yarn test` (consider `vitest --watch` during development).

## Commit & Pull Request Guidelines

- Commits: Imperative mood, concise scope. Example: `feat(projects): highlight active project`.
- PRs: Provide a clear description, screenshots for UI changes, and links to issues.
- Note any schema/env changes (Prisma migrations, new env vars like `DATABASE_URL`/`DIRECT_URL`).

## Security & Configuration Tips

- Never commit secrets. Use `.env` locally; production uses managed secrets.
- Prefer static imports for PNG/JPG; store SVGs in `public/` with explicit dimensions.
- Container images must include `public/` and `.next/static` for correct asset serving.

## Agent‑Specific Notes

- Keep patches minimal and focused; respect existing shadcn/ui and Tailwind v4 patterns.
- When unsure about Next 16 behavior (cache, forms, server actions), consult Next MCP tools.
