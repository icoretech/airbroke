import KpiCard from "@/components/analytics/KpiCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type HealthStat = {
  name: string;
  value: number | string;
  unit?: string;
};

export default function HealthCard({
  stats,
  paused,
  lastNoticeDate,
}: {
  stats: HealthStat[];
  paused: boolean;
  lastNoticeDate: Date | null;
}) {
  return (
    <Card className="lg:col-span-5">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-white">Health</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {stats.map((s) => (
            <KpiCard
              key={s.name}
              label={s.name}
              value={s.value}
              unit={s.unit}
            />
          ))}
        </div>
        <Separator className="my-3" />
        <div className="flex items-stretch gap-3">
          <div className="basis-1/3">
            <div className="text-xs font-medium text-white/70">Status</div>
            <div className="text-sm text-white/90">
              {paused ? "Paused" : "Accepting data"}
            </div>
          </div>
          <Separator
            orientation="vertical"
            className="w-px self-stretch bg-white/10"
          />
          <div className="basis-2/3">
            <div className="text-xs font-medium text-white/70">Last Notice</div>
            <div className="text-sm text-white/90">
              {lastNoticeDate ? lastNoticeDate.toUTCString() : "—"}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
