import crypto from "node:crypto";
import { db } from "@/lib/db";
import { Prisma } from "@/prisma/generated/client";
import type { NoticeError } from "@/lib/intake/normalizeNoticeData";
import type { Project } from "@/prisma/generated/client";

async function retryKnownUniqueConflict<T>(
  operation: () => Promise<T>,
  label: string,
  attemptsLeft = 3,
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002" &&
      attemptsLeft > 1
    ) {
      console.debug(
        `${label} failed due to P2002. Retrying... attempts left: ${
          attemptsLeft - 1
        }`,
      );
      return retryKnownUniqueConflict(operation, label, attemptsLeft - 1);
    }

    throw error;
  }
}

export interface UpsertNoticeOccurrenceInput {
  readonly project: Project;
  readonly error: NoticeError;
  readonly context: Record<string, unknown>;
  readonly environment: Record<string, unknown>;
  readonly session: Record<string, unknown>;
  readonly requestParams: Record<string, unknown>;
}

function toPrismaJson(
  value: unknown,
): Prisma.InputJsonValue | null | undefined {
  if (value === null) {
    return null;
  }
  if (typeof value === "string" || typeof value === "boolean") {
    return value;
  }
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }
  if (Array.isArray(value)) {
    return value.map((item) => toPrismaJson(item) ?? null);
  }
  if (value instanceof Date) {
    return value.toJSON();
  }
  if (typeof value === "object") {
    const result: Record<string, Prisma.InputJsonValue | null> = {};
    for (const [key, item] of Object.entries(value)) {
      const jsonValue = toPrismaJson(item);
      if (jsonValue !== undefined) {
        result[key] = jsonValue;
      }
    }
    return result;
  }
  return undefined;
}

export async function upsertNoticeOccurrence({
  project,
  error,
  context,
  environment,
  session,
  requestParams,
}: UpsertNoticeOccurrenceInput): Promise<void> {
  const type = error.type;
  const message = error.message;
  const backtrace = error.backtrace;
  const env =
    typeof context.environment === "string" ? context.environment : "unknown";

  const currentNotice = await retryKnownUniqueConflict(
    () =>
      db.notice.upsert({
        where: {
          project_id_env_kind: {
            project_id: project.id,
            env: env,
            kind: type,
          },
        },
        create: {
          env: env,
          kind: type,
          project: {
            connect: { id: project.id },
          },
        },
        update: {
          seen_count: { increment: 1 },
        },
        select: { id: true },
      }),
    "Notice upsert",
  );

  const messageHash = crypto
    .createHash("sha256")
    .update(message, "utf8")
    .digest("hex");

  await retryKnownUniqueConflict(async () => {
    await db.occurrence.upsert({
      where: {
        notice_id_message_hash: {
          notice_id: currentNotice.id,
          message_hash: messageHash,
        },
      },
      create: {
        message: message,
        message_hash: messageHash,
        backtrace: toPrismaJson(backtrace) ?? [],
        context: toPrismaJson(context) ?? {},
        environment: toPrismaJson(environment) ?? {},
        session: toPrismaJson(session) ?? {},
        params: toPrismaJson(requestParams) ?? {},
        notice: {
          connect: { id: currentNotice.id },
        },
      },
      update: {
        resolved_at: null,
        seen_count: { increment: 1 },
      },
    });
  }, "Occurrence upsert");
}
