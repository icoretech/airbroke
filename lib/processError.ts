// lib/processError.ts

import { prisma } from '@/lib/db';
import { NoticeError } from '@/lib/parseNotice';
import { Prisma, Project } from '@prisma/client';
import crypto from 'node:crypto';

/**
 * Processes and records a NoticeError instance into the database (notices/occurrences).
 *
 * - Retries the Notice upsert on P2002 errors (unique constraint).
 * - Retries the Occurrence upsert on P2002 errors, too.
 */
export async function processError(
  project: Project,
  error: NoticeError,
  context: Record<string, unknown>,
  environment: Record<string, unknown>,
  session: Record<string, unknown>,
  requestParams: Record<string, unknown>
): Promise<void> {
  const type = error.type;
  const message = error.message;
  const backtrace = error.backtrace;
  // If the context has .environment, use that, else default to "unknown".
  const env = (context.environment as string) || 'unknown';

  let attemptsNotice = 3;
  let successNotice = false;
  let current_notice_id: string | null = null;

  // 1) Upsert the Notice with retry on unique constraint issues
  while (attemptsNotice > 0 && !successNotice) {
    try {
      const current_notice = await prisma.notice.upsert({
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
      });

      current_notice_id = current_notice.id;
      successNotice = true;
    } catch (upsertError) {
      if (upsertError instanceof Prisma.PrismaClientKnownRequestError && upsertError.code === 'P2002') {
        attemptsNotice--;
        console.debug(`Notice upsert failed due to P2002. Retrying... attempts left: ${attemptsNotice}`);
      } else {
        throw upsertError;
      }
    }
  }

  // If we couldn't create or find a Notice, bail out
  if (!current_notice_id) {
    return;
  }

  // 2) Upsert the Occurrence with retry on unique constraint issues
  let attemptsOccurrence = 3;
  let successOccurrence = false;

  const messageHash = crypto.createHash('md5').update(error.message, 'utf8').digest('hex');

  while (attemptsOccurrence > 0 && !successOccurrence) {
    try {
      await prisma.occurrence.upsert({
        where: {
          notice_id_message_hash: {
            notice_id: current_notice_id,
            message_hash: messageHash,
          },
        },
        create: {
          message: message,
          message_hash: messageHash,
          backtrace: JSON.parse(JSON.stringify(backtrace)),
          context: JSON.parse(JSON.stringify(context)),
          environment: JSON.parse(JSON.stringify(environment)),
          session: JSON.parse(JSON.stringify(session)),
          params: JSON.parse(JSON.stringify(requestParams)),
          notice: {
            connect: { id: current_notice_id },
          },
        },
        update: {
          resolved_at: null,
          seen_count: { increment: 1 },
        },
      });

      successOccurrence = true;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        attemptsOccurrence--;
        console.debug(`Occurrence upsert failed due to P2002. Retrying... attempts left: ${attemptsOccurrence}`);
      } else {
        throw err;
      }
    }
  }
}
