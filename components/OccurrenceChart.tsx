'use client';

import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface DataItem {
  date: string;
  count: number;
}

interface ChartDataType {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
  }[];
}

export default function OccurrenceChart({ data }: { data: { date: string; count: number }[] }) {
  const [chartData, setChartData] = useState<ChartDataType | null>(null);

  useEffect(() => {
    if (data) {
      setChartData({
        labels: data.map((item) => item.date),
        datasets: [
          {
            label: 'Occurrences',
            data: data.map((item) => item.count),
            backgroundColor: 'rgba(86, 116, 185, 0.8)',
            borderColor: 'rgba(86, 116, 185, 1)',
            borderWidth: 1,
          },
        ],
      });
    }
  }, [data]);

  const options: ChartOptions<'bar'> = {
    responsive: true,
    scales: {
      x: {
        type: 'category',
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return chartData && <Bar data={chartData} options={options} />;
}
