import { prisma } from '@/lib/db';

// TODO: charting
export default async function OccurrenceChartWrapper({ occurrenceId }: { occurrenceId: bigint }) {
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
      date: summary.interval_start.toDateString(),
      count: Number(summary.count),
    };
  });

  return <></>;
}
