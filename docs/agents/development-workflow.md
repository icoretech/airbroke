# Development Workflow

## Docker Compose First

- Use running containers for all repository scripts.
- Use `docker compose exec` against running services.
- Default service mapping:
  - app/runtime scripts: `docker compose exec web yarn <script>`
  - test scripts: `docker compose exec test yarn <script>`
- Bring services up before commands: `docker compose up -d web test db testdb`.
- Verify services are running when needed: `docker compose ps`.

## Script Reference

Run these through the mapped container command:

- `dev`: start Next.js dev server
- `build`: production build (`output=standalone`)
- `start`: run production server
- `typecheck`: TypeScript project check
- `biome:lint`, `biome:check`, `biome:ci`, `format`: linting/formatting
- `db:migrate`, `db:seed`, `db:pull`, `db:generate`: Prisma tasks
- `test`: run Vitest suite

## Common Full Commands

- `docker compose exec web yarn dev`
- `docker compose exec web yarn typecheck`
- `docker compose exec web yarn db:migrate`
- `docker compose exec test yarn test`

## Agent Notes

- Keep edits minimal and scoped to the task.
- When unsure about Next.js behavior, use Next MCP tools before changing patterns.
