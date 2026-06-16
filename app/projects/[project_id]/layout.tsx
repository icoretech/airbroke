import AppBreadcrumbs from "@/components/layout/AppBreadcrumbs";
import { AppShell } from "@/components/layout/AppShell";
import { ProjectTopbarEndSlot } from "@/components/project/ProjectTopbarEndSlot";
import { buildProjectCrumbsById } from "@/lib/routing/breadcrumbs";

export default async function ProjectLayout({
  children,
  params,
}: LayoutProps<"/projects/[project_id]">) {
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
