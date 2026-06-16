import { cacheLife, cacheTag } from "next/cache";
import { getProjectActivityTag } from "@/lib/cache/projectActivity";
import { db } from "@/lib/db";

export async function cachedProjectChartOccurrencesData(projectId: string) {
  "use cache";
  cacheLife("hours");
  cacheTag(getProjectActivityTag(projectId));

  const endDate = new Date();
  const startDate = new Date(endDate.getTime() - 14 * 24 * 60 * 60 * 1000);

  const occurrenceSummaries = await db.hourlyOccurrence.groupBy({
    by: ["interval_start"],
    where: {
      occurrence: {
        notice: { project_id: projectId },
      },
      interval_start: { gte: startDate },
      interval_end: { lte: endDate },
    },
    _sum: { count: true },
    orderBy: { interval_start: "asc" },
  });

  const occurrenceCountByDate: Record<number, number> = {};
  occurrenceSummaries.forEach((summary) => {
    const d = summary.interval_start;
    const hourStamp = Date.UTC(
      d.getUTCFullYear(),
      d.getUTCMonth(),
      d.getUTCDate(),
      d.getUTCHours(),
    );
    occurrenceCountByDate[hourStamp] = Number(summary._sum.count);
  });

  const data: Array<{ date: number; count: number }> = [];
  const cursorDate = new Date(startDate);
  while (cursorDate <= endDate) {
    const stamp = Date.UTC(
      cursorDate.getUTCFullYear(),
      cursorDate.getUTCMonth(),
      cursorDate.getUTCDate(),
      cursorDate.getUTCHours(),
    );
    const count = occurrenceCountByDate[stamp] || 0;
    data.push({ date: stamp, count });
    cursorDate.setHours(cursorDate.getHours() + 1);
  }

  return data;
}
