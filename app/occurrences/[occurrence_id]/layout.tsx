import { cache, Suspense } from "react";
import Loading from "@/app/loading";
import AppBreadcrumbs from "@/components/layout/AppBreadcrumbs";
import { AppShell } from "@/components/layout/AppShell";
import { EditProjectButton } from "@/components/project/EditProjectButton";
import { db } from "@/lib/db";
import { buildOccurrenceCrumbsById } from "@/lib/routing/breadcrumbs";

export default function OccurrenceLayout(
  props: LayoutProps<"/occurrences/[occurrence_id]">,
) {
  return (
    <Suspense fallback={<Loading />}>
      <OccurrenceLayoutContent {...props} />
    </Suspense>
  );
}

async function OccurrenceLayoutContent({
  children,
  params,
}: LayoutProps<"/occurrences/[occurrence_id]">) {
  const { occurrence_id } = await params;
  const getProjectIdForOccurrence = cache(async (id: string) => {
    const o = await db.occurrence.findUnique({
      where: { id },
      select: { notice: { select: { project_id: true } } },
    });
    return o?.notice?.project_id ?? undefined;
  });
  const [selectedProjectId, crumbs] = await Promise.all([
    getProjectIdForOccurrence(occurrence_id),
    buildOccurrenceCrumbsById(occurrence_id),
  ]);
  return (
    <AppShell
      selectedProjectId={selectedProjectId}
      topbarBreadcrumbs={<AppBreadcrumbs items={crumbs} />}
      topbarSearchPlaceholder="Search occurrences…"
      topbarEndSlot={
        selectedProjectId ? (
          <EditProjectButton projectId={selectedProjectId} />
        ) : undefined
      }
    >
      {children}
    </AppShell>
  );
}
