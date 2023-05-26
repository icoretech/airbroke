import { prisma } from '@/lib/db';
import OccurrenceChart from './OccurrenceChart';

export default async function OccurrenceChartWrapper({ occurrenceId }: { occurrenceId: string }) {
  // Calculate the start and end date for the past two weeks
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 14);

  // Query the database for the occurrence summaries for the past two weeks
  const occurrenceSummaries = await prisma.hourlyOccurrence.findMany({
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
      interval_start: 'asc',
    },
  });

  // Map the occurrence summaries to the format expected by the chart component
  const chartData = occurrenceSummaries.map((summary) => {
    return {
      date: summary.interval_start.toISOString().slice(0, 13), // Get date and hour only
      count: Number(summary.count),
    };
  });

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <h2 className="min-w-0 text-sm font-semibold leading-6 text-white">Hourly Occurrences in the past 14 days</h2>

      <OccurrenceChart data={chartData} />
    </div>
  );
}
