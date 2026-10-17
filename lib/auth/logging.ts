import { createHash } from "node:crypto";
import { basename } from "node:path";
import type { BetterAuthOptions } from "better-auth";
import type { Prisma } from "@/prisma/generated/client";

// Only library-owned, static event labels may be logged verbatim. Other messages
// can contain provider responses or complete Prisma queries, even without args.
const authEvents = new Set([
  "Unable to create OAuth user",
  "Unable to link account",
  "Unable to link account - untrusted provider",
  "Unable to get user info",
  "Unable to derive provider account identity",
  "Better auth was unable to query your database.\nError: ",
  "Failed to create verification",
  "Failed to parse state",
  "Failed to send OAuth verification email",
  "Failed to run background task:",
  "INVALID_CALLBACK_REQUEST",
  "INTERNAL_SERVER_ERROR",
  "State not found",
  "Code not found",
  "OAuth provider not found",
  "OAuth issuer mismatch",
  "No callback URL found",
  "onAPIError.onError threw",
  "Rate limiting could not determine a client IP and is falling back to a single shared per-path bucket. Ensure your runtime forwards a trusted client IP header, then set `advanced.ipAddress.ipAddressHeaders` or `advanced.ipAddress.trustedProxies` so the address can be resolved.",
  "[better-auth] Warning: your BETTER_AUTH_SECRET should be at least 32 characters long for adequate security. Generate one with `npx auth secret` or `openssl rand -base64 32`.",
  "[better-auth] Warning: your BETTER_AUTH_SECRET appears low-entropy. Use a randomly generated secret for production.",
  "[better-auth] Base URL is not set. Set the baseURL option or BETTER_AUTH_URL env, or use a dynamic baseURL with allowedHosts for multi-host setups. Without it the origin is derived from the incoming request, and callbacks and redirects may not work correctly.",
  "OAuth account references a missing user. Repair the account before retrying authentication.",
]);

const errorNames = new Set([
  "Error",
  "TypeError",
  "RangeError",
  "SyntaxError",
  "APIError",
  "PrismaClientValidationError",
  "PrismaClientKnownRequestError",
  "PrismaClientUnknownRequestError",
  "PrismaClientInitializationError",
  "PrismaClientRustPanicError",
]);

function fingerprint(message: string): string {
  return createHash("sha256").update(message).digest("hex");
}

function summarizeError(error: Error) {
  // Error.stack starts with Error.message, which may span a whole query. Keep
  // source locations only; never copy messages, causes, metadata, or arguments.
  const prefix = `${error.name}: ${error.message}`;
  const frames = error.stack?.startsWith(prefix)
    ? error.stack.slice(prefix.length)
    : "";
  const stack = frames
    .split("\n")
    .filter((line) => /^\s+at /.test(line))
    .flatMap((line) => {
      const match = line.match(/(?:\(|\s)([^\s()]+):(\d+):(\d+)\)?$/);
      if (!match) return [];
      const file = basename(match[1]);
      if (!/^[a-zA-Z0-9_.-]{1,100}\.[cm]?[jt]sx?$/.test(file)) return [];
      return [{ file, line: Number(match[2]), column: Number(match[3]) }];
    })
    .slice(0, 12);
  return {
    name: errorNames.has(error.name) ? error.name : "Error",
    code:
      "code" in error &&
      typeof error.code === "string" &&
      /^P\d{4}$/.test(error.code)
        ? error.code
        : undefined,
    stack,
  };
}

export const authLogger = {
  level: "warn",
  log(level, message, ...args: unknown[]) {
    const summary = {
      source: "better-auth",
      event: authEvents.has(message)
        ? message.trim()
        : "Authentication log event",
      fingerprint: fingerprint(message),
      errors: args
        .filter((arg) => arg instanceof Error)
        .slice(0, 4)
        .map(summarizeError),
      argumentCount: args.length,
    };
    if (level === "error") console.error(summary);
    else if (level === "warn") console.warn(summary);
    else console.info(summary);
  },
} satisfies NonNullable<BetterAuthOptions["logger"]>;

export function logPrismaEvent(
  level: "warn" | "error",
  event: Prisma.LogEvent,
) {
  const summary = {
    source: "prisma",
    event: level === "error" ? "Database request failed" : "Database warning",
    target: /^[a-zA-Z][a-zA-Z0-9_.:]{0,100}$/.test(event.target)
      ? event.target
      : "unknown",
    timestamp: event.timestamp.toISOString(),
    fingerprint: fingerprint(event.message),
  };
  if (level === "error") console.error(summary);
  else console.warn(summary);
}
