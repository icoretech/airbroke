// components/OccurrencesChartBackground.tsx

"use client";

import { BarElement, Chart as ChartJS, LinearScale } from "chart.js";
import { Bar } from "react-chartjs-2";
import type { ChartData, ChartOptions } from "chart.js";

ChartJS.register(LinearScale, BarElement);

type XYPoint = { x: number; y: number };

type ChartDataItem = { date: string; count: number };

interface OccurrencesChartBackgroundProps {
  chartData: ChartDataItem[];
}

type ChartJSData = ChartData<"bar", XYPoint[]>;

export default function OccurrencesChartBackground({
  chartData,
}: OccurrencesChartBackgroundProps) {
  const data: ChartJSData = {
    datasets: [
      {
        label: "Occurrences",
        parsing: false,
        data: chartData.map((item, i) => ({ x: i, y: item.count })),
        backgroundColor: "rgba(41,51,66,0.9)",
        borderColor: "rgba(41,51,66,1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(41,51,66,1)",
        hoverBorderColor: "rgba(41,51,66,1)",
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
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
  };

  return <Bar data={data} options={options} />;
}
