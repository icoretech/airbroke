// lib/db.ts

import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "@/prisma/generated/client";

let prisma: PrismaClient | undefined;

function createPrisma(): PrismaClient {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL is not set. Ensure it is provided at runtime (container env).",
    );
  }

  const pool = new Pool({ connectionString: databaseUrl });
  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log: process.env.TESTING
      ? []
      : process.env.NODE_ENV === "development"
        ? ["query", "info", "warn", "error"]
        : ["warn", "error"],
    errorFormat: "pretty",
  });
}

function getClient(): PrismaClient {
  if (!prisma) prisma = createPrisma();
  return prisma;
}

// Export a callable proxy so both `db().model...` and `db.model...` work.
type DB = PrismaClient & (() => PrismaClient);
const dbFn = (() => getClient()) as DB;
export const db: DB = new Proxy(dbFn as unknown as object, {
  // Called as a function → return the client
  apply() {
    return getClient();
  },
  // Property access → forward to client lazily
  get(_target, prop, receiver) {
    return Reflect.get(getClient(), prop, receiver);
  },
}) as unknown as DB;
