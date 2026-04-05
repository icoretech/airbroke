// lib/queries/remarks.ts

import { db } from "@/lib/db";

const userSelect = {
  select: { id: true, name: true, image: true } as const,
};

export async function getRemarksByNoticeId(noticeId: string) {
  return db.remark.findMany({
    where: {
      notice_id: noticeId,
      occurrence_id: null,
    },
    orderBy: { created_at: "asc" },
    include: { user: userSelect },
  });
}

export async function getRemarksByOccurrenceId(
  occurrenceId: string,
  noticeId: string,
) {
  return db.remark.findMany({
    where: {
      notice_id: noticeId,
      OR: [{ occurrence_id: null }, { occurrence_id: occurrenceId }],
    },
    orderBy: { created_at: "asc" },
    include: { user: userSelect },
  });
}

export async function getRemarkCountByNoticeId(
  noticeId: string,
): Promise<number> {
  return db.remark.count({
    where: { notice_id: noticeId, occurrence_id: null },
  });
}

export async function getRemarkCountForOccurrencePage(
  occurrenceId: string,
  noticeId: string,
): Promise<number> {
  return db.remark.count({
    where: {
      notice_id: noticeId,
      OR: [{ occurrence_id: null }, { occurrence_id: occurrenceId }],
    },
  });
}
