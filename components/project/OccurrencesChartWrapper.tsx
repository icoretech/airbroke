// components/project/OccurrencesChartWrapper.tsx

import OccurrenceChart from "@/components/common/OccurrenceChart";
import { cachedProjectChartOccurrencesData } from "@/lib/queries/projectChartOccurrences";

export default async function OccurrencesChartWrapper({
  projectId,
  compact = false,
}: {
  projectId: string;
  compact?: boolean;
}) {
  const chartData = await cachedProjectChartOccurrencesData(projectId);
  const gradientId = `project-chart-${projectId}${compact ? "-compact" : ""}`;
  const hasActivity = chartData.some(({ count }) => count > 0);

  return (
    <div className={compact ? "" : "px-4 sm:px-6 lg:px-8"}>
      {!compact && (
        <h2 className="mb-6 min-w-0 text-sm font-semibold leading-6 text-white">
          Hourly Occurrences in the past 14 days
        </h2>
      )}
      {hasActivity ? (
        <OccurrenceChart
          chartData={chartData}
          compact={compact}
          gradientId={gradientId}
        />
      ) : (
        <div className="flex min-h-32 items-center justify-center rounded-md border border-dashed border-white/10 px-4 text-center text-sm text-white/60">
          No activity in the last 14 days
        </div>
      )}
    </div>
  );
}
