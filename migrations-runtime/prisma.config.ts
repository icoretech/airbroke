import type { PrismaConfig } from "prisma/config";

const databaseUrl = process.env.DIRECT_URL ?? process.env.DATABASE_URL;

const config: PrismaConfig = {
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
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
