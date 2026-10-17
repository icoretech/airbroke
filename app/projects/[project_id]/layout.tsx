import AppBreadcrumbs from "@/components/layout/AppBreadcrumbs";
import { AppShell } from "@/components/layout/AppShell";
import { ProjectTopbarEndSlot } from "@/components/project/ProjectTopbarEndSlot";
import { buildProjectCrumbsById } from "@/lib/routing/breadcrumbs";

export default function ProjectLayout(
  props: LayoutProps<"/projects/[project_id]">,
) {
  return (
    <Suspense fallback={<Loading />}>
      <ProjectLayoutContent {...props} />
    </Suspense>
  );
}

async function ProjectLayoutContent({
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

import { Suspense } from "react";
import Loading from "@/app/loading";
