# TypeScript and UI Guidelines

## Language and Style

- Stack: TypeScript + React 19 + Next.js 16 App Router.
- Use 2-space indentation and keep imports grouped/sorted.
- Components use PascalCase; hooks/utilities in `lib/` use camelCase.
- Biome is the source of truth for lint/format behavior.

## TypeScript Strictness

- Do not use `any`.
- Prefer precise inference and specific types.
- If a cast is required, target the narrowest valid type (for example `Route` from `next`).
- Avoid `@ts-ignore` and lint disables; use type guards and proper narrowing.
- Prefer structural typing over broad `unknown`/`any` in refinement paths.

## UI and Components

- Prefer shadcn/ui primitives and composition.
- For new/updated forms, prefer `Field*` primitives over deprecated `Form` helpers.
- For list rows, use `Item`, `ItemMedia`, `ItemContent`, `ItemTitle`, `ItemDescription`, `ItemActions`.
- Avoid manual icon sizing and margin hacks inside `ItemMedia`.

## Recharts

- Keep chart wrappers/components as Client Components.
- Keep data-loading logic in Server Components.
- Always set explicit chart height (for example `ChartContainer` + `ResponsiveContainer height="100%"`).
- Prefer numeric UTC timestamps for time axes.

## React Compiler Hygiene

- Avoid `try/catch/finally` inside render callbacks.
- For async event handlers, prefer promise `.catch/.finally` patterns.
- Avoid over-constrained manual memoization dependency lists.
