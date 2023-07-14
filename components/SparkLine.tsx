// Define the props for the Sparkline component
interface SparklineProps {
  width: number;
  height: number;
  data: number[];
}

export default function Sparkline({ width, height, data }: SparklineProps) {
  // Calculate the width and height of the viewBox based on the data
  const vbWidth = data.length - 1;
  const vbHeight = Math.max(...data);

  // Generate the path for the sparkline. This will create a line connecting all data points.
  const path = data
    .map((value, i) => {
      const x = i;
      const y = vbHeight - value; // Invert the y value because SVG coordinates start from the top
      return `${x} ${y}${i < vbWidth ? ' L ' : ''}`; // Add a line command for all points except the last one
    })
    .join(' ');

  // Generate the closed path for the filled area under the sparkline.
  // This extends the path to the bottom of the viewBox.
  const closedPath = `${path} L ${vbWidth} ${vbHeight} L 0 ${vbHeight} Z`;

  return (
    <svg
      height={height}
      width={width}
      viewBox={`0 0 ${vbWidth} ${vbHeight}`} // Set the viewBox to match the data
      preserveAspectRatio="none" // Ignore aspect ratio to stretch the sparkline to fill the SVG
      role="img"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Draw the filled area under the sparkline */}
      <path d={closedPath} stroke="transparent" fill="#dcfce7" />
      {/* Draw the sparkline */}
      <path d={path} strokeWidth={4} vectorEffect="non-scaling-stroke" stroke="#bbf7d0" fill="transparent" />
    </svg>
  );
}
