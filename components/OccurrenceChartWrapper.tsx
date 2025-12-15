// components/OccurrenceChartWrapper.tsx

import OccurrenceChart from "@/components/OccurrenceChart";
import { db } from "@/lib/db";

export default async function OccurrenceChartWrapper({
  occurrenceId,
}: {
  occurrenceId: string;
}) {
  // Calculate the start and end date for the past two weeks
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 14);

  // Query the database for the occurrence summaries for the past two weeks
  const occurrenceSummaries = await db.hourlyOccurrence.findMany({
    where: {
      occurrence_id: occurrenceId,
      interval_start: {
        gte: startDate.toISOString(),
      },
      interval_end: {
        lte: endDate.toISOString(),
      },
    },
    orderBy: {
      interval_start: "asc",
    },
  });

  // Create a map for fast lookup of occurrence count by date
  const occurrenceCountByHour: Record<number, number> = {};
  occurrenceSummaries.forEach((summary) => {
    const d = new Date(summary.interval_start);
    const hourUtc = Date.UTC(
      d.getUTCFullYear(),
      d.getUTCMonth(),
      d.getUTCDate(),
      d.getUTCHours(),
    );
    occurrenceCountByHour[hourUtc] = Number(summary.count);
  });

  // Generate a complete list of hourly intervals for the past 14 days
  const chartData = Array.from({ length: 14 * 24 }).map((_, i) => {
    const date = new Date(startDate.getTime() + i * 60 * 60 * 1000);
    const hourUtc = Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      date.getUTCHours(),
    );
    const count = occurrenceCountByHour[hourUtc] ?? 0;
    return { date: hourUtc, count };
  });

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <h2 className="mb-6 min-w-0 text-sm font-semibold leading-6 text-white">
        Hourly Occurrences in the past 14 days
      </h2>
      <OccurrenceChart chartData={chartData} />
    </div>
  );
}
