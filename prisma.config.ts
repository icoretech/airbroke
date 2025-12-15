// prisma.config.ts
import type { PrismaConfig } from "prisma/config";

// Prisma CLI configuration migrated from package.json#prisma (deprecated in Prisma 7)
// See: https://www.prisma.io/docs/orm/reference/prisma-config-reference#configuration-interface

// NOTE: `datasource` is optional for most commands (e.g. `prisma generate`).
// It is required for migration / introspection commands.
// We avoid hard-failing when the URL isn't present so Docker builds (and local installs)
// can run `prisma generate` without needing DB env vars at build time.
const databaseUrl = process.env.DIRECT_URL ?? process.env.DATABASE_URL;

const config: PrismaConfig = {
  // Explicitly set schema path (defaults to prisma/schema.prisma)
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    // Mirrors previously used seed command from package.json#prisma
    seed: "tsx prisma/seed.ts",
  },
  ...(databaseUrl
    ? {
        datasource: {
          url: databaseUrl,
        },
      }
    : {}),
};

export default config;
