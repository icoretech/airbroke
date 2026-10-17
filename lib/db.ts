// lib/db.ts

import { PrismaPg } from "@prisma/adapter-pg";
import { logPrismaEvent } from "@/lib/auth/logging";
import { PrismaClient } from "@/prisma/generated/client";

let prisma: PrismaClient | undefined;

function createPrisma(): PrismaClient {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL is not set. Ensure it is provided at runtime (container env).",
    );
  }

  const adapter = new PrismaPg({ connectionString: databaseUrl });

  const client = new PrismaClient({
    adapter,
    log: process.env.TESTING
      ? []
      : process.env.NODE_ENV === "development"
        ? [
            "query",
            "info",
            { level: "warn", emit: "event" },
            { level: "error", emit: "event" },
          ]
        : [
            { level: "warn", emit: "event" },
            { level: "error", emit: "event" },
          ],
    errorFormat: "pretty",
  });
  client.$on("warn", (event) => logPrismaEvent("warn", event));
  client.$on("error", (event) => logPrismaEvent("error", event));
  return client;
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
