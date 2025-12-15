import OccurrencesChartWrapper from "@/components/project/OccurrencesChartWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ActivityCard({ projectId }: { projectId: string }) {
  return (
    <Card className="lg:col-span-7">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-white">Activity</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="mb-2 flex items-center justify-between text-xs text-white/60">
          <span>Last 14 days</span>
        </div>
        <OccurrencesChartWrapper projectId={projectId} compact />
      </CardContent>
    </Card>
  );
}
