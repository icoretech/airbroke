import { db } from "@/lib/db";
import {
  getHourlyOccurrenceWindow,
  HOUR_IN_MS,
  HOURLY_OCCURRENCE_BUCKETS,
} from "@/lib/queries/hourlyOccurrenceWindow";

type HourlyOccurrenceSummary = {
  interval_start: Date | string;
  count: bigint | number;
};

export type OccurrenceChartDataPoint = {
  date: number;
  count: number;
};

function toUtcHourStamp(date: Date): number {
  return Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
  );
}

export function buildOccurrenceChartOccurrencesData(
  occurrenceSummaries: HourlyOccurrenceSummary[],
  startDate: Date,
): OccurrenceChartDataPoint[] {
  const occurrenceCountByHour: Record<number, number> = {};
  occurrenceSummaries.forEach((summary) => {
    occurrenceCountByHour[toUtcHourStamp(new Date(summary.interval_start))] =
      Number(summary.count);
  });

  return Array.from({ length: HOURLY_OCCURRENCE_BUCKETS }).map((_, index) => {
    const date = new Date(startDate.getTime() + index * HOUR_IN_MS);
    const hourUtc = toUtcHourStamp(date);

    return {
      date: hourUtc,
      count: occurrenceCountByHour[hourUtc] ?? 0,
    };
  });
}

export async function getOccurrenceChartOccurrencesData(occurrenceId: string) {
  const { startDate, endDate } = getHourlyOccurrenceWindow();

  const occurrenceSummaries = await db.hourlyOccurrence.findMany({
    where: {
      occurrence_id: occurrenceId,
      interval_start: {
        gte: startDate,
        lt: endDate,
      },
    },
    orderBy: {
      interval_start: "asc",
    },
    select: {
      interval_start: true,
      count: true,
    },
  });

  return buildOccurrenceChartOccurrencesData(occurrenceSummaries, startDate);
}
