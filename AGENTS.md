# Airbroke Agent Guide

Airbroke is a Next.js 16 + Prisma project that is developed and tested via Docker Compose.

## Universal Rules

- This is a Docker Compose project. Start required services before running commands:
  `docker compose up -d web test db testdb`.
- Run Node/Next/Yarn/Prisma/Vitest commands only inside running containers.
- Use `docker compose exec` for repository commands (not host execution, not `docker exec`).
- Do not run `yarn`, `node`, `npx`, `next`, `prisma`, or `vitest` directly on the host.
- Do not revert or downgrade dependency upgrades made by the user in `package.json`/lockfiles unless explicitly requested.

## Quick Command Map

- App commands: `docker compose exec web yarn <script>`
- Test commands: `docker compose exec test yarn <script>`
- Common scripts: `dev`, `build`, `start`, `typecheck`, `biome:lint`, `biome:check`,
  `biome:ci`, `format`, `db:migrate`, `db:seed`, `db:pull`, `db:generate`, `test`

## Detailed Guidelines

- [Project Structure](docs/agents/project-structure.md)
- [Development Workflow](docs/agents/development-workflow.md)
- [TypeScript and UI](docs/agents/typescript-and-ui.md)
- [Next.js 16](docs/agents/nextjs-16.md)
- [Testing, PRs, and Security](docs/agents/testing-pr-security.md)
