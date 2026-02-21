# Next.js 16 Guidelines

## Rendering and Dynamic APIs

- Keep layouts static.
- Avoid Dynamic APIs in layouts (`cookies()`, `headers()`, `draftMode()`, etc.).
- Isolate dynamic behavior in pages/components.

## Caching and Revalidation

- Cache intentionally.
- Revalidate after mutations with `revalidatePath` or `revalidateTag`.

## Server Actions and Redirects

- `redirect()` throws `NEXT_REDIRECT` by design.
- Do not catch `redirect()` errors.
- Catch database and business-logic errors separately before redirect flow.
