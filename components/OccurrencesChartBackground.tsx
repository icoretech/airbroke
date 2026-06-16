// components/OccurrencesChartBackground.tsx

"use client";

import { useEffect, useRef } from "react";
import type { ChartData, ChartDataset, ChartOptions } from "chart.js";

type XYPoint = { x: number; y: number };

type ChartDataItem = { date: number; count: number };

interface OccurrencesChartBackgroundProps {
  chartData: ChartDataItem[];
}

type ChartJSData = ChartData<"bar", XYPoint[]>;
type ChartInstance = import("chart.js").Chart<"bar", XYPoint[]>;
const chartJsPromise = import("chart.js");

const BAR_DATASET_STYLE = {
  label: "Occurrences",
  parsing: false,
  backgroundColor: "rgba(41,51,66,0.9)",
  borderColor: "rgba(41,51,66,1)",
  borderWidth: 1,
  hoverBackgroundColor: "rgba(41,51,66,1)",
  hoverBorderColor: "rgba(41,51,66,1)",
} satisfies Omit<ChartDataset<"bar", XYPoint[]>, "data">;

const BAR_CHART_OPTIONS = {
  animation: false,
  responsive: true,
  maintainAspectRatio: false,
  normalized: true,
  scales: {
    x: {
      type: "linear",
      display: false,
    },
    y: {
      display: false,
    },
  },
  plugins: {
    legend: { display: false },
    tooltip: { enabled: false },
  },
} satisfies ChartOptions<"bar">;

function buildChartData(chartData: ChartDataItem[]): ChartJSData {
  return {
    datasets: [
      {
        ...BAR_DATASET_STYLE,
        data: chartData.map((item, i) => ({ x: i, y: item.count })),
      },
    ],
  };
}

export default function OccurrencesChartBackground({
  chartData,
}: OccurrencesChartBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let disposed = false;
    let chart: ChartInstance | null = null;

    void chartJsPromise.then(
      ({ BarController, BarElement, Chart, LinearScale }) => {
        if (disposed || !canvasRef.current) return;

        Chart.register(BarController, LinearScale, BarElement);
        chart = new Chart<"bar", XYPoint[]>(canvasRef.current, {
          type: "bar",
          data: buildChartData(chartData),
          options: BAR_CHART_OPTIONS,
        });
      },
    );

    return () => {
      disposed = true;
      chart?.destroy();
      chart = null;
    };
  }, [chartData]);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      width={300}
      height={150}
      className="h-full w-full"
    />
  );
}
