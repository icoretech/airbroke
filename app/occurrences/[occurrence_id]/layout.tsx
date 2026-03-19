import { cache } from "react";
import AppBreadcrumbs from "@/components/AppBreadcrumbs";
import { AppShell } from "@/components/AppShell";
import { EditProjectButton } from "@/components/project/EditProjectButton";
import { buildOccurrenceCrumbsById } from "@/lib/breadcrumbs";
import { db } from "@/lib/db";

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
  const selectedProjectId = await getProjectIdForOccurrence(occurrence_id);
  const crumbs = await buildOccurrenceCrumbsById(occurrence_id);
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
