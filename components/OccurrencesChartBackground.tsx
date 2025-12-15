// components/OccurrencesChartBackground.tsx

"use client";

import {
  BarController,
  BarElement,
  Chart as ChartJS,
  LinearScale,
} from "chart.js";
import { useEffect, useMemo, useRef } from "react";
import type { ChartData, ChartDataset, ChartOptions } from "chart.js";

ChartJS.register(BarController, LinearScale, BarElement);

type XYPoint = { x: number; y: number };

type ChartDataItem = { date: string; count: number };

interface OccurrencesChartBackgroundProps {
  chartData: ChartDataItem[];
}

type ChartJSData = ChartData<"bar", XYPoint[]>;

export default function OccurrencesChartBackground({
  chartData,
}: OccurrencesChartBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<ChartJS<"bar", XYPoint[]> | null>(null);

  const datasetStyle = useMemo<
    Omit<ChartDataset<"bar", XYPoint[]>, "data">
  >(() => {
    return {
      label: "Occurrences",
      parsing: false,
      backgroundColor: "rgba(41,51,66,0.9)",
      borderColor: "rgba(41,51,66,1)",
      borderWidth: 1,
      hoverBackgroundColor: "rgba(41,51,66,1)",
      hoverBorderColor: "rgba(41,51,66,1)",
    };
  }, []);

  const initialData = useMemo<ChartJSData>(() => {
    return {
      datasets: [
        {
          ...datasetStyle,
          data: [],
        },
      ],
    };
  }, [datasetStyle]);

  const data = useMemo<ChartJSData>(() => {
    return {
      datasets: [
        {
          ...datasetStyle,
          data: chartData.map((item, i) => ({ x: i, y: item.count })),
        },
      ],
    };
  }, [chartData, datasetStyle]);

  const options = useMemo<ChartOptions<"bar">>(() => {
    return {
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
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;
    const chart = new ChartJS(canvasRef.current, {
      type: "bar",
      data: initialData,
      options,
    });

    chartRef.current = chart;

    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, [initialData, options]);

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;
    chart.data = data;
    chart.update("none");
  }, [data]);

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
