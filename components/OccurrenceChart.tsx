'use client';
import dynamic from 'next/dynamic';

// Define the interface for the 'data' prop.
interface DataItem {
  date: string;
  count: number;
}

interface OccurrenceChartProps {
  data: DataItem[];
}
const ResponsiveBar: any = dynamic(() => import('@nivo/bar').then((m) => m.ResponsiveBar), { ssr: false });

export default function OccurrenceChart({ data }: OccurrenceChartProps) {
  return (
    <div style={{ height: '50vh' }}>
      <ResponsiveBar
        data={data}
        keys={['count']}
        indexBy="date"
        margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
        padding={0.3}
        valueScale={{ type: 'linear' }}
        indexScale={{ type: 'band', round: true }}
        colors={{ scheme: 'nivo' }}
        borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          tickValues: [], // hides all tick values
          legendPosition: 'middle',
          legendOffset: 32,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legendPosition: 'middle',
          legendOffset: -40,
        }}
        theme={{
          axis: {
            ticks: {
              text: { fill: '#FFFFFF' }, // white color for the Y axis labels
            },
            domain: {
              line: {
                stroke: '#192231',
              },
            },
          },
          grid: {
            line: {
              stroke: '#192231',
            },
          },
        }}
        enableLabel={false}
        animate={true}
        motionConfig="gentle"
        legends={[]}
      />
    </div>
  );
}
