"use client";

import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
} from "@/components/RechartsWrapper";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import type { TooltipContentProps } from "recharts/types/component/Tooltip";
import type { ChartConfig } from "@/components/ui/chart";

type DataPoint = { date: number; count: number };

export default function OccurrenceChart({
  chartData,
}: {
  chartData: DataPoint[];
}) {
  const gradId = React.useId();
  const chartConfig: ChartConfig = {
    count: { label: "Occurrences", color: "hsl(var(--chart-1))" },
  };

  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-55 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          accessibilityLayer
          data={chartData}
          margin={{ left: 12, right: 12 }}
        >
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor="hsl(var(--sidebar-accent-grad-start))"
              />
              <stop
                offset="100%"
                stopColor="hsl(var(--sidebar-accent-grad-end))"
              />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.1)" />
          <XAxis
            type="number"
            scale="time"
            dataKey="date"
            domain={["dataMin", "dataMax"]}
            tickCount={8}
            tick={{ fill: "rgba(255,255,255,0.9)", fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={24}
            tickFormatter={(value: number | string) => {
              const d = new Date(
                typeof value === "number" ? value : Number(value),
              );
              return d.toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              });
            }}
          />
          <ChartTooltip
            content={(props: TooltipContentProps<ValueType, NameType>) => {
              const raw = props.label as number | string | undefined;
              const ts = typeof raw === "number" ? raw : Number(raw ?? 0);
              const label = Number.isNaN(ts)
                ? ""
                : new Date(ts).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                  });
              return (
                <ChartTooltipContent
                  {...props}
                  label={label}
                  className="w-45"
                />
              );
            }}
          />
          <Bar dataKey="count" fill={`url(#${gradId})`} radius={4} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
