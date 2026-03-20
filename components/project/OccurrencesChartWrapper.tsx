// components/project/OccurrencesChartWrapper.tsx

import OccurrenceChart from "@/components/OccurrenceChart";
import { cachedProjectChartOccurrencesData } from "@/lib/actions/projectActions";

export default async function OccurrencesChartWrapper({
  projectId,
  compact = false,
}: {
  projectId: string;
  compact?: boolean;
}) {
  const chartData = await cachedProjectChartOccurrencesData(projectId);
  const gradientId = `project-chart-${projectId}${compact ? "-compact" : ""}`;

  return (
    <div className={compact ? "" : "px-4 sm:px-6 lg:px-8"}>
      {!compact && (
        <h2 className="mb-6 min-w-0 text-sm font-semibold leading-6 text-white">
          Hourly Occurrences in the past 14 days
        </h2>
      )}
      <OccurrenceChart
        chartData={chartData}
        compact={compact}
        gradientId={gradientId}
      />
    </div>
  );
}
