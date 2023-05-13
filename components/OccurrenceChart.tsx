'use client';

import { BarChart } from '@tremor/react';

export default function OccurrenceChart({ chartData }: { chartData: any }) {
  return (
    <BarChart className="mt-6" data={chartData} index="date" categories={['count']} colors={['blue']} yAxisWidth={48} />
  );
}
