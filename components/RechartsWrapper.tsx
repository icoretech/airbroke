"use client";

import dynamic from "next/dynamic";

// Dynamically import recharts components with SSR disabled to avoid the createContext issue
export const Bar = dynamic(() => import("recharts").then((mod) => mod.Bar), {
  ssr: false,
});

export const BarChart = dynamic(
  () => import("recharts").then((mod) => mod.BarChart),
  { ssr: false },
);

export const Line = dynamic(() => import("recharts").then((mod) => mod.Line), {
  ssr: false,
});

export const LineChart = dynamic(
  () => import("recharts").then((mod) => mod.LineChart),
  { ssr: false },
);

export const Pie = dynamic(() => import("recharts").then((mod) => mod.Pie), {
  ssr: false,
});

export const PieChart = dynamic(
  () => import("recharts").then((mod) => mod.PieChart),
  { ssr: false },
);

export const Area = dynamic(() => import("recharts").then((mod) => mod.Area), {
  ssr: false,
});

export const AreaChart = dynamic(
  () => import("recharts").then((mod) => mod.AreaChart),
  { ssr: false },
);

export const XAxis = dynamic(
  () => import("recharts").then((mod) => mod.XAxis),
  { ssr: false },
);

export const YAxis = dynamic(
  () => import("recharts").then((mod) => mod.YAxis),
  { ssr: false },
);

export const CartesianGrid = dynamic(
  () => import("recharts").then((mod) => mod.CartesianGrid),
  { ssr: false },
);

export const Tooltip = dynamic(
  () => import("recharts").then((mod) => mod.Tooltip),
  { ssr: false },
);

// Legend export omitted for now (not used), avoids type complaints with dynamic props

export const ResponsiveContainer = dynamic(
  () => import("recharts").then((mod) => mod.ResponsiveContainer),
  { ssr: false },
);

// Export the original recharts library for any components that need other exports
export * from "recharts";
