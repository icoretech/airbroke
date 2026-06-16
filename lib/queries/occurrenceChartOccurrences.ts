import { db } from "@/lib/db";

type HourlyOccurrenceSummary = {
  interval_start: Date | string;
  count: bigint | number;
};

export type OccurrenceChartDataPoint = {
  date: number;
  count: number;
};

const OCCURRENCE_CHART_HOURS = 14 * 24;
const HOUR_IN_MS = 60 * 60 * 1000;

function getOccurrenceChartWindow(now = new Date()) {
  const endDate = now;
  const startDate = new Date(endDate);
  startDate.setDate(endDate.getDate() - 14);

  return { startDate, endDate };
}

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

  return Array.from({ length: OCCURRENCE_CHART_HOURS }).map((_, index) => {
    const date = new Date(startDate.getTime() + index * HOUR_IN_MS);
    const hourUtc = toUtcHourStamp(date);

    return {
      date: hourUtc,
      count: occurrenceCountByHour[hourUtc] ?? 0,
    };
  });
}

export async function getOccurrenceChartOccurrencesData(occurrenceId: string) {
  const { startDate, endDate } = getOccurrenceChartWindow();

  const occurrenceSummaries = await db.hourlyOccurrence.findMany({
    where: {
      occurrence_id: occurrenceId,
      interval_start: {
        gte: startDate,
      },
      interval_end: {
        lte: endDate,
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
