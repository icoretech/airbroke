// lib/actions/remarkActions.ts

"use server";

import { revalidatePath } from "next/cache";
import { requireUserId } from "@/lib/actions/requireAuth";
import { db } from "@/lib/db";

export async function createRemark(
  noticeId: string,
  body: string,
  occurrenceId?: string,
) {
  const userId = await requireUserId();

  await db.remark.create({
    data: {
      notice_id: noticeId,
      ...(occurrenceId ? { occurrence_id: occurrenceId } : {}),
      user_id: userId,
      body,
    },
  });

  revalidatePath(`/notices/${noticeId}`);
  if (occurrenceId) {
    revalidatePath(`/occurrences/${occurrenceId}`);
  }
}

export async function updateRemark(remarkId: string, body: string) {
  const userId = await requireUserId();

  const remark = await db.remark.findUnique({
    where: { id: remarkId },
    select: { user_id: true, notice_id: true, occurrence_id: true },
  });
  if (!remark) throw new Error("Not found");
  if (remark.user_id !== userId) throw new Error("Forbidden");

  await db.remark.update({
    where: { id: remarkId },
    data: { body },
  });

  revalidatePath(`/notices/${remark.notice_id}`);
  if (remark.occurrence_id) {
    revalidatePath(`/occurrences/${remark.occurrence_id}`);
  }
}

export async function deleteRemark(remarkId: string) {
  const userId = await requireUserId();

  const remark = await db.remark.findUnique({
    where: { id: remarkId },
    select: { user_id: true, notice_id: true, occurrence_id: true },
  });
  if (!remark) throw new Error("Not found");
  if (remark.user_id !== userId) throw new Error("Forbidden");

  await db.remark.delete({ where: { id: remarkId } });

  revalidatePath(`/notices/${remark.notice_id}`);
  if (remark.occurrence_id) {
    revalidatePath(`/occurrences/${remark.occurrence_id}`);
  }
}
