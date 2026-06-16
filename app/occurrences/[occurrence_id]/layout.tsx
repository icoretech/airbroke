import { cache } from "react";
import AppBreadcrumbs from "@/components/layout/AppBreadcrumbs";
import { AppShell } from "@/components/layout/AppShell";
import { EditProjectButton } from "@/components/project/EditProjectButton";
import { db } from "@/lib/db";
import { buildOccurrenceCrumbsById } from "@/lib/routing/breadcrumbs";

export default async function OccurrenceLayout({
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
