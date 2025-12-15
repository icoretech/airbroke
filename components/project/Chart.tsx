"use client";

import { createContext, useContext } from "react";
import { Tooltip } from "recharts";
import { cn } from "@/lib/utils";
import type { ComponentProps, ReactNode } from "react";
import type {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import type { TooltipContentProps } from "recharts/types/component/Tooltip";

export type ChartConfig = Record<string, { label?: ReactNode; color?: string }>;

type ChartContextValue = { config: ChartConfig };
const ChartContext = createContext<ChartContextValue | null>(null);

export function useChartConfig(): ChartContextValue {
  const ctx = useContext(ChartContext);
  if (!ctx)
    throw new Error("useChartConfig must be used within ChartContainer");
  return ctx;
}

export function ChartContainer({
  config,
  className,
  children,
  ...props
}: ComponentProps<"div"> & {
  config: ChartConfig;
  children: ReactNode;
}) {
  return (
    <ChartContext.Provider value={{ config }}>
      <div data-slot="chart" className={cn("w-full", className)} {...props}>
        {children}
      </div>
    </ChartContext.Provider>
  );
}

export const ChartTooltip = Tooltip;

export function ChartTooltipContent({
  active,
  payload,
  className,
  label,
  hideLabel,
}: TooltipContentProps<ValueType, NameType> & {
  hideLabel?: boolean;
  className?: string;
}) {
  const { config } = useChartConfig();

  // Type guard for payload array
  const items: ReadonlyArray<unknown> = Array.isArray(payload) ? payload : [];

  if (!active || items.length === 0) return null;

  return (
    <div
      className={cn(
        "bg-background text-foreground border-border/50 rounded-md border px-2.5 py-1.5 text-xs shadow-xl",
        className,
      )}
    >
      {!hideLabel && label ? (
        <div className="mb-1 font-medium">{label as ReactNode}</div>
      ) : null}
      <div className="grid gap-1.5">
        {items.map((raw, idx) => {
          if (typeof raw !== "object" || raw === null) return null;
          const item = raw as {
            value?: number | string;
            name?: string;
            color?: string;
            dataKey?: string;
          };
          const key = item.dataKey || item.name || `value-${idx}`;
          const conf = key && config[key] ? config[key] : undefined;
          return (
            <div
              key={`${key}-${idx}`}
              className="flex items-center justify-between gap-4"
            >
              <span className="text-muted-foreground">
                {conf?.label ?? item.name}
              </span>
              <span className="font-mono tabular-nums">
                {String(item.value ?? "")}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
