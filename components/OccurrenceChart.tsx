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
        colors={['#9cbbf2']} // Custom color for the bars, adjust as needed
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
          tickTextColor: '#FFFFFF', // white color for tick text
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legendPosition: 'middle',
          legendOffset: -40,
          legendTextColor: '#FFFFFF', // white color for legend text
          tickTextColor: '#FFFFFF', // white color for tick text
        }}
        theme={{
          axis: {
            ticks: {
              line: {
                stroke: '#192231', // Custom color for axis lines
              },
              text: {
                fill: '#FFFFFF', // white color for the axis labels
              },
            },
            domain: {
              line: {
                stroke: '#192231', // Custom color for domain line
              },
            },
          },
          grid: {
            line: {
              stroke: '#192231', // Custom color for grid lines
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
