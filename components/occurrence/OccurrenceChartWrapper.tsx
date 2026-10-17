import OccurrenceChart from "@/components/common/OccurrenceChart";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { getOccurrenceChartOccurrencesData } from "@/lib/queries/occurrenceChartOccurrences";

export default async function OccurrenceChartWrapper({
  occurrenceId,
}: {
  occurrenceId: string;
}) {
  const chartData = await getOccurrenceChartOccurrencesData(occurrenceId);

  return (
    <div className="flex min-w-0 flex-col gap-4 overflow-hidden">
      <h2 className="min-w-0 text-sm font-semibold leading-6">
        Hourly Occurrences in the past 14 days
      </h2>
      {chartData.some((point) => point.count > 0) ? (
        <OccurrenceChart chartData={chartData} />
      ) : (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>No recent occurrences</EmptyTitle>
            <EmptyDescription>
              No occurrences were recorded in the past 14 days.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </div>
  );
}
