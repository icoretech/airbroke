// prisma.config.ts
import type { PrismaConfig } from "prisma/config";

// Prisma CLI configuration migrated from package.json#prisma (deprecated in Prisma 7)
// See: https://www.prisma.io/docs/orm/reference/prisma-config-reference#configuration-interface

const databaseUrl = process.env.DIRECT_URL;

if (typeof databaseUrl !== "string") {
  throw new Error("DIRECT_URL env var is required for Prisma CLI operations.");
}

const config: PrismaConfig = {
  // Explicitly set schema path (defaults to prisma/schema.prisma)
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    // Mirrors previously used seed command from package.json#prisma
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: databaseUrl,
  },
};

export default config;
