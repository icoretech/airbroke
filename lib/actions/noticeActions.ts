// lib/actions/noticeActions.ts

"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/actions/requireAuth";
import { revalidateProjectShellPaths } from "@/lib/actions/revalidateProjectShellPaths";
import { db } from "@/lib/db";

function revalidateNoticeMutationPaths(projectId: string, noticeIds: string[]) {
  revalidateProjectShellPaths(projectId);
  for (const noticeId of noticeIds) {
    revalidatePath(`/notices/${noticeId}`);
  }
}

/**
 * Resolves all unresolved occurrences under a notice.
 * The PostgreSQL trigger will auto-resolve the notice.
 */
export async function resolveAllOccurrences(
  noticeId: string,
  projectId: string,
) {
  await requireAuth();

  await db.occurrence.updateMany({
    where: {
      notice_id: noticeId,
      resolved_at: null,
    },
    data: {
      resolved_at: new Date(),
    },
  });

  revalidateNoticeMutationPaths(projectId, [noticeId]);
}

/**
 * Reinstates all resolved occurrences under a notice.
 * The PostgreSQL trigger will auto-reinstate the notice.
 */
export async function reinstateAllOccurrences(
  noticeId: string,
  projectId: string,
) {
  await requireAuth();

  await db.occurrence.updateMany({
    where: {
      notice_id: noticeId,
      resolved_at: { not: null },
    },
    data: {
      resolved_at: null,
    },
  });

  revalidateNoticeMutationPaths(projectId, [noticeId]);
}

/**
 * Resolves all occurrences under multiple notices at once.
 */
export async function resolveSelectedNotices(
  noticeIds: string[],
  projectId: string,
) {
  await requireAuth();

  await db.occurrence.updateMany({
    where: {
      notice_id: { in: noticeIds },
      resolved_at: null,
    },
    data: {
      resolved_at: new Date(),
    },
  });

  revalidateNoticeMutationPaths(projectId, noticeIds);
}

/**
 * Resolves all occurrences under all notices for a project,
 * optionally scoped to an environment.
 */
export async function resolveAllByProjectEnv(projectId: string, env?: string) {
  await requireAuth();

  const notices = await db.notice.findMany({
    where: {
      project_id: projectId,
      ...(env ? { env } : {}),
    },
    select: { id: true },
  });

  if (notices.length === 0) return;

  const noticeIds = notices.map((n) => n.id);

  await db.occurrence.updateMany({
    where: {
      notice_id: { in: noticeIds },
      resolved_at: null,
    },
    data: {
      resolved_at: new Date(),
    },
  });

  revalidateNoticeMutationPaths(projectId, noticeIds);
}
