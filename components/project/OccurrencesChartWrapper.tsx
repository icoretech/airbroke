// components/project/OccurrencesChartWrapper.tsx
import OccurrenceChart from '@/components/OccurrenceChart';
import prisma from '@/lib/db';

export default async function OccurrencesChartWrapper({ projectId }: { projectId: string }) {
  // Calculate the start and end date for the past two weeks
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 14);

  // Query the database for the occurrence summaries for the past two weeks
  const occurrenceSummaries = await prisma.hourlyOccurrence.groupBy({
    by: ['interval_start'],
    where: {
      occurrence: {
        notice: {
          project_id: projectId,
        },
      },
      interval_start: {
        gte: startDate,
      },
      interval_end: {
        lte: endDate,
      },
    },
    _sum: {
      count: true,
    },
    orderBy: {
      interval_start: 'asc',
    },
  });

  // Create a map for fast lookup of occurrence count by date
  const occurrenceCountByDate: Record<string, number> = {};
  occurrenceSummaries.forEach((summary) => {
    occurrenceCountByDate[summary.interval_start.toISOString().slice(0, 13)] = Number(summary._sum.count);
  });

  // Generate a complete list of hourly intervals for the past 14 days
  const chartData = Array.from({ length: 14 * 24 }).map((_, i) => {
    const date = new Date(startDate.getTime() + i * 60 * 60 * 1000); // Add i hours to startDate
    const dateStr = date.toISOString().slice(0, 13); // Get date and hour only
    const count = occurrenceCountByDate[dateStr] || 0; // Get occurrence count or 0 if not found
    return { date: dateStr, count };
  });

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <h2 className="mb-6 min-w-0 text-sm font-semibold leading-6 text-white">
        Hourly Occurrences in the past 14 days
      </h2>

      <OccurrenceChart data={chartData} />
    </div>
  );
}
