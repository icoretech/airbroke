import AppBreadcrumbs from "@/components/AppBreadcrumbs";
import { AppShell } from "@/components/AppShell";
import { ProjectTopbarEndSlot } from "@/components/project/ProjectTopbarEndSlot";
import { buildProjectCrumbsById } from "@/lib/breadcrumbs";
import type { ReactNode } from "react";

export default async function ProjectLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ project_id: string }>;
}) {
  const { project_id } = await params;
  const crumbs = await buildProjectCrumbsById(project_id);
  return (
    <AppShell
      selectedProjectId={project_id}
      topbarEndSlot={<ProjectTopbarEndSlot projectId={project_id} />}
      topbarSearchPlaceholder="Search notices…"
      topbarBreadcrumbs={<AppBreadcrumbs items={crumbs} />}
    >
      {children}
    </AppShell>
  );
}
