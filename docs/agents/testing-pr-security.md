# Testing, PR, and Security Guidelines

## Testing

- Framework: Vitest + Testing Library (`jsdom` for DOM tests).
- Naming: `*.test.ts` / `*.test.tsx`, under `__tests__/` or co-located.
- Keep tests small and deterministic; avoid real network calls.
- Run tests in container: `docker compose exec test yarn test`.

## Commits and PRs

- Commits: imperative mood, concise scope.
- Example: `feat(projects): highlight active project`.
- PRs should include:
  - clear behavioral summary
  - screenshots for UI changes
  - linked issues
  - explicit note for schema/env changes (`DATABASE_URL`, `DIRECT_URL`, Prisma migrations)

## Security and Asset Delivery

- Never commit secrets; use `.env` locally and managed secrets in deployed environments.
- Prefer static imports for PNG/JPG.
- Store SVG assets in `public/` with explicit dimensions.
- Container images must include `public/` and `.next/static`.
