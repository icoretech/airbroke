import OccurrenceChart from "@/components/common/OccurrenceChart";
import { getOccurrenceChartOccurrencesData } from "@/lib/queries/occurrenceChartOccurrences";

export default async function OccurrenceChartWrapper({
  occurrenceId,
}: {
  occurrenceId: string;
}) {
  const gradientId = `occurrence-chart-${occurrenceId}`;
  const chartData = await getOccurrenceChartOccurrencesData(occurrenceId);

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <h2 className="mb-6 min-w-0 text-sm font-semibold leading-6 text-white">
        Hourly Occurrences in the past 14 days
      </h2>
      <OccurrenceChart chartData={chartData} gradientId={gradientId} />
    </div>
  );
}
