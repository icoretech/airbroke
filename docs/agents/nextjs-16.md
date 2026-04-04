# Next.js 16

## Repo Contracts

- App Router project with route handlers under `app/api/**`
- `typedRoutes: true`
- `reactCompiler: true`
- `cacheComponents: true`
- `output: "standalone"`
- `serverExternalPackages`: `@airbrake/node`, `@sentry/node`

## Routing and API Compatibility

- Preserve the compatibility rewrites and redirects in `next.config.ts`
  when moving or renaming collectors and notice or occurrence pages
- When using `redirect()` in server code, remember it throws intentionally
- If a `try/catch` must coexist with redirects, rethrow redirect errors or keep
  the redirect outside the `try`

## Server Actions and Revalidation

- Follow the existing pattern in `lib/actions/*`:
  validate input, mutate through Prisma, revalidate tags or paths, then
  `refresh()` or `redirect()` as needed
- Use `unstable_rethrow` when catching errors around redirecting server actions
  so Next control flow is preserved
- If a mutation changes server-rendered UI, refresh or revalidate the canonical
  server path instead of relying only on optimistic local state

## Auth and Build-Time Safety

- `lib/auth.ts` uses lazy Better Auth initialization on purpose
  so `next build` does not require auth runtime env just to import the module
- Preserve that lazy pattern when changing auth wiring or provider logic
- Keep server-only auth, Prisma, and collector code out of client bundles

## Build Rules

- Run builds inside the `web` container
- Always set `NODE_ENV=production` explicitly for production build verification
- Standalone output is the deployable artifact, so check `.next/standalone`
  implications before changing Docker copy steps or runtime file access
