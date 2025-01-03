// components/OccurrenceChart.tsx

'use client';

import {
  BarElement,
  CategoryScale,
  ChartData,
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

/**
 * The shape of the data we pass to <Bar />.
 */
type ChartDataType = ChartData<'bar'>;

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
            backgroundColor: '#c7d2fe',
            borderColor: '#c7d2fe',
            borderWidth: 1,
            hoverBackgroundColor: '#a5b4fc',
            hoverBorderColor: '#a5b4fc',
          },
        ],
      });
    }
  }, [data]);

  const options: ChartOptions<'bar'> = {
    scales: {
      x: {
        type: 'category',
        ticks: {
          color: '#ffffff', // labels
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)', // grid
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: '#ffffff', // labels
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)', // grid
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: '#6366F1',
        titleColor: '#F3F4F6',
        bodyColor: '#F3F4F6',
      },
    },
  };

  return chartData && <Bar data={chartData} options={options} />;
}
