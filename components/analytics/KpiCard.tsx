import { Badge } from "@/components/ui/badge";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import type { ReactNode } from "react";

type Trend = "up" | "down" | undefined;

export default function KpiCard({
  label,
  value,
  unit,
  icon,
  delta,
}: {
  label: string;
  value: string | number;
  unit?: string;
  icon?: ReactNode;
  delta?: { value: string; trend?: Trend };
}) {
  const badgeVariant: "destructive" | "secondary" =
    delta?.trend === "down" ? "destructive" : "secondary";

  return (
    <Item
      variant="outline"
      size="sm"
      className="items-start justify-between p-3"
    >
      <ItemContent>
        <ItemTitle className="text-[10px] font-medium uppercase tracking-wide text-white/70">
          {icon}
          {label}
        </ItemTitle>
        <ItemDescription className="mt-1">
          <span className="text-2xl font-semibold text-white">{value}</span>
          {unit ? (
            <span className="ml-1 text-xs text-white/60">{unit}</span>
          ) : null}
        </ItemDescription>
      </ItemContent>
      {delta?.value ? (
        <ItemActions>
          <Badge variant={badgeVariant}>{delta.value}</Badge>
        </ItemActions>
      ) : null}
    </Item>
  );
}
