import OccurrenceChart from '@/components/OccurrenceChart';
import { prisma } from '@/lib/db';

interface OccurrencesChartWrapperProps {
  occurrenceIds: string[];
}

export default async function OccurrencesChartWrapper({ occurrenceIds }: OccurrencesChartWrapperProps) {
  // Calculate the start and end date for the past two weeks
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 14);

  // Query the database for the occurrence summaries for the past two weeks
  const occurrenceSummaries = await prisma.hourlyOccurrence.groupBy({
    by: ['interval_start'],
    where: {
      occurrence_id: {
        in: occurrenceIds,
      },
      interval_start: {
        gte: startDate.toISOString(),
      },
      interval_end: {
        lte: endDate.toISOString(),
      },
    },
    _sum: {
      count: true,
    },
    orderBy: {
      interval_start: 'asc',
    },
  });

  // Map the occurrence summaries to the format expected by the chart component
  const chartData = occurrenceSummaries.map((summary) => {
    return {
      date: summary.interval_start.toISOString().slice(0, 13), // Get date and hour only
      count: Number(summary._sum.count),
    };
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
