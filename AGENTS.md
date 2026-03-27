# Airbroke Agent Guide

Airbroke is a Next.js 16 + Prisma app that is developed and verified via
Docker Compose.

## Quick Reference

- Package manager: `yarn@4.13.0`
- Start services: `docker compose up -d web test db testdb`
- App commands: `docker compose exec web yarn <script>`
- Test commands: `docker compose exec test yarn <script>`

## Universal Rules

- Run repository commands and verification through Docker Compose containers by
  default; use host commands only for Docker and host diagnostics
- Run Node, Next, Yarn, Prisma, and Vitest commands only inside running
  containers
- Use `docker compose exec` for repository commands, not host execution and
  not `docker exec`
- Prefer `docker compose exec` against running services for normal work; use
  `docker compose run --rm` only when you intentionally need an isolated
  one-off container
- Do not run `yarn`, `node`, `npx`, `next`, `prisma`, or `vitest` directly
  on the host
- Run production builds with `NODE_ENV=production` explicitly set
- Do not revert or downgrade dependency upgrades made by the user in
  `package.json` or lockfiles unless explicitly requested

## Common Scripts

- `web`: `dev`, `build`, `start`, `typecheck`, `biome:lint`, `biome:check`,
  `biome:ci`, `format`, `db:migrate`, `db:seed`, `db:pull`, `db:generate`
- `test`: `test`

## Detailed Guidelines

- [Project Structure](docs/agents/project-structure.md)
- [Development Workflow](docs/agents/development-workflow.md)
- [TypeScript and UI](docs/agents/typescript-and-ui.md)
- [Next.js 16](docs/agents/nextjs-16.md)
- [Testing, PRs, and Security](docs/agents/testing-pr-security.md)
