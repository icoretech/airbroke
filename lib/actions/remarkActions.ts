// lib/actions/remarkActions.ts

"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { getAuth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function createRemark(
  noticeId: string,
  body: string,
  occurrenceId?: string,
) {
  const session = await getAuth().api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Unauthorized");

  await db.remark.create({
    data: {
      notice_id: noticeId,
      ...(occurrenceId ? { occurrence_id: occurrenceId } : {}),
      user_id: session.user.id,
      body,
    },
  });

  revalidatePath(`/notices/${noticeId}`);
  if (occurrenceId) {
    revalidatePath(`/occurrences/${occurrenceId}`);
  }
}

export async function updateRemark(remarkId: string, body: string) {
  const session = await getAuth().api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Unauthorized");

  const remark = await db.remark.findUnique({
    where: { id: remarkId },
    select: { user_id: true, notice_id: true, occurrence_id: true },
  });
  if (!remark) throw new Error("Not found");
  if (remark.user_id !== session.user.id) throw new Error("Forbidden");

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
  const session = await getAuth().api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Unauthorized");

  const remark = await db.remark.findUnique({
    where: { id: remarkId },
    select: { user_id: true, notice_id: true, occurrence_id: true },
  });
  if (!remark) throw new Error("Not found");
  if (remark.user_id !== session.user.id) throw new Error("Forbidden");

  await db.remark.delete({ where: { id: remarkId } });

  revalidatePath(`/notices/${remark.notice_id}`);
  if (remark.occurrence_id) {
    revalidatePath(`/occurrences/${remark.occurrence_id}`);
  }
}
