# Project Structure

## Core Paths

- `app/`: Next.js App Router routes, layouts, and API handlers (`app/api/**`).
- `components/`: Reusable UI and feature components (shadcn/ui + Tailwind v4).
- `lib/`: Shared server/client utilities, actions, caching, and helpers.
- `prisma/`: Prisma schema, migrations, and seed scripts.
- `public/`: Static assets (logos, images, fonts, SVG files).
- `__tests__/`: Vitest tests (for example `__tests__/lib/*.test.ts`).

## Conventions

- Prefer existing shadcn/ui primitives and composition patterns over bespoke CSS.
- Keep patches focused and consistent with existing component structure.
