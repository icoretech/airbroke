import prisma from '@/lib/db';
import { NoticeError } from '@/lib/parseNotice';
import { Prisma, Project } from '@prisma/client';

export async function processError(
  project: Project,
  error: NoticeError,
  context: Record<string, any>,
  environment: Record<string, any>,
  session: Record<string, any>,
  requestParams: Record<string, any>
) {
  const type = error.type;
  const message = error.message;
  const backtrace = error.backtrace;

  const env = context.environment || 'unknown';
  let attempts = 3;  // Number of retry attempts
  let success = false;
  let current_notice_id = null;

  while (attempts > 0 && !success) {
    try {
      const current_notice = await prisma.notice.upsert({
        where: {
          // unfortunately this means we cannot use db upserts so we have to retry
          project_id_env_kind: {
            project_id: project.id,
            env: env,
            kind: type,
          },
        },
        create: {
          // also sets created_at / updated_at
          env: env,
          kind: type,
          project: {
            connect: {
              id: project.id,
            },
          },
        },
        update: {
          // we've seen updated_at work here
          seen_count: {
            increment: 1,
          },
        },
        select: {
          id: true,
        },
      });
      current_notice_id = current_notice.id;
      success = true;  // If upsert succeeded, break the loop
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        // If the error is a P2002, retry the operation
        attempts--;
        console.log(`Upsert failed due to P2002 error. Retrying... Attempts left: ${attempts}`);
      } else {
        throw error; // If the error is not a P2002, throw the error
      }
    }
  }

  if (current_notice_id) {
    await prisma.occurrence.upsert({
      where: {
        notice_id_message: {
          notice_id: current_notice_id,
          message: message,
        },
      },
      create: {
        // also sets created_at / updated_at
        message: message,
        backtrace: JSON.parse(JSON.stringify(backtrace)),
        context: JSON.parse(JSON.stringify(context)),
        environment: JSON.parse(JSON.stringify(environment)),
        session: JSON.parse(JSON.stringify(session)),
        params: JSON.parse(JSON.stringify(requestParams)),
        notice: {
          connect: {
            id: current_notice_id,
          },
        },
      },
      update: {
        resolved_at: null, // auto reinstate
        // we've seen updated_at work here
        seen_count: {
          increment: 1,
        },
      },
    });
  }
}
