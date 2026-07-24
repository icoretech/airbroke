# COMPONENT GUIDE

## OVERVIEW

`components/` contains maintained feature UI; `components/ui/` is a separate
registry-managed primitive surface with its own guide.

## STRUCTURE

```text
layout/      # Authenticated shell, navigation, and shared page chrome
project/     # Project forms, charts, settings, and destructive controls
notice/      # Notice tables, filters, and resolution controls
occurrence/  # Detail panels, charts, actions, replay, and diagnostics
remark/      # Remark forms and threads
common/      # Cross-domain rendering and chart boundaries
ui/          # shadcn Base UI primitives; read ui/AGENTS.md
```

## WHERE TO LOOK

| Task | Location | Notes |
| --- | --- | --- |
| Server shell | `layout/AppShell.tsx` | Server auth and reads |
| Project mutations | `project/` | Forms call server actions |
| Occurrence tools | `occurrence/toolbox/` | AI, cURL, and replay boundaries |
| Chart boundary | `common/RechartsWrapper.tsx` | SSR disabled |
| Component tests | `../__tests__/components/` | Centralized, never colocated |

## CONVENTIONS

- Default to server components. Add `"use client"` only for browser APIs,
  event handlers, hooks, or local interactive state.
- Keep data access and secret-bearing work in server parents; pass the minimum
  serializable data into client children.
- Client mutations use server actions and the shared mutation/error patterns;
  canonical server-rendered state must refresh or revalidate after success.
- Prefer existing primitives from `components/ui/` and domain components before
  introducing another wrapper or visual vocabulary.
- Keep domain components with their entity family. Nested `cards/` and
  `toolbox/` folders remain owned by their feature parent.

## ANTI-PATTERNS

- Do not import `lib/db.ts`, server auth internals, or other server-only modules
  into client components.
- Do not mirror server props into local state with an effect. Derive values or
  use event-owned optimistic state that clears when canonical props catch up.
- Do not move auth and project queries from `AppShell` into client navigation.
- Do not normalize `components/ui/` with project formatting; its generated
  style and verification contract differ.
- Do not add tests beside production components; Next packaging can include
  colocated test files.
