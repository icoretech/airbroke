# APP ROUTER GUIDE

## OVERVIEW

`app/` owns route composition and HTTP transport; reusable behavior belongs in
`components/` or `lib/`.

## STRUCTURE

```text
api/                         # Auth, MCP, completion, health, and collectors
projects/[project_id]/       # Project shell, notice index, filters, and edit
notices/[notice_id]/         # Notice detail and occurrence list
occurrences/[occurrence_id]/ # Occurrence analysis and actions
bookmarks/                   # User bookmark list
signin/                      # Server provider setup plus client OAuth UI
```

## WHERE TO LOOK

| Task | Location | Notes |
| --- | --- | --- |
| Root document | `layout.tsx` | Fonts, metadata, dark theme, global CSS |
| Project shell | `projects/[project_id]/layout.tsx` | Breadcrumbs, `AppShell` |
| Airbrake | `api/v3/notices/route.ts` | JSON and text/plain |
| Sentry | `api/sentry/[project_id]/envelope/route.ts` | Body limits |
| Better Auth | `api/auth/[...all]/route.ts` | Lazy construction |
| MCP adapter | `api/mcp/route.ts` | Delegates to `lib/mcp/` |

## CONVENTIONS

- Await typed `params` and `searchParams`; use `notFound()` for absent domain
  records rather than rendering partial detail pages.
- Keep pages and layouts server-side by default. Route-local interactive files
  use explicit `"use client"` and delegate mutations to `lib/actions/`.
- Keep URL-driven filters and sort state in search parameters; shared parsing
  and URL updates live under `lib/routing/`.
- API handlers retain transport concerns: credentials, CORS, content encoding,
  status codes, body limits, and response compatibility. Parsing and shared
  persistence belong under `lib/intake/`.
- Collector routes are public data-plane endpoints authenticated by project
  keys. They do not inherit page authentication from `proxy.ts`.

## ANTI-PATTERNS

- Do not move collector normalization or occurrence grouping back into route
  handlers; both protocols converge on the shared intake service.
- Do not weaken accepted Airbrake content types or Sentry compressed and
  decompressed payload limits without protocol tests.
- Do not add `AppShell` to pass-through project layouts; nested shells cause
  duplicate navigation.
- Do not put reusable feature UI in route folders once another route consumes
  it; move it to the matching `components/` domain.
- Do not add stateful, node-local API session storage. The app must remain safe
  across multiple replicas.
