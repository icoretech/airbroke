import { cacheLife, cacheTag } from "next/cache";
import { getProjectActivityTag } from "@/lib/cache/projectActivity";
import { db } from "@/lib/db";
import { getHourlyOccurrenceWindow } from "@/lib/queries/hourlyOccurrenceWindow";
import { buildOccurrenceChartOccurrencesData } from "@/lib/queries/occurrenceChartOccurrences";

export async function cachedProjectChartOccurrencesData(projectId: string) {
  "use cache";
  cacheLife("hours");
  cacheTag(getProjectActivityTag(projectId));

  const { startDate, endDate } = getHourlyOccurrenceWindow();

  const occurrenceSummaries = await db.hourlyOccurrence.groupBy({
    by: ["interval_start"],
    where: {
      occurrence: {
        notice: { project_id: projectId },
      },
      interval_start: { gte: startDate, lt: endDate },
    },
    _sum: { count: true },
    orderBy: { interval_start: "asc" },
  });

  return buildOccurrenceChartOccurrencesData(
    occurrenceSummaries.map((summary) => ({
      interval_start: summary.interval_start,
      count: summary._sum.count ?? 0,
    })),
    startDate,
  );
}
