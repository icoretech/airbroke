import { cache } from "react";
import AppBreadcrumbs from "@/components/AppBreadcrumbs";
import { AppShell } from "@/components/AppShell";
import { EditProjectButton } from "@/components/project/EditProjectButton";
import { buildNoticeCrumbsById } from "@/lib/breadcrumbs";
import { db } from "@/lib/db";
import type { ReactNode } from "react";

export default async function NoticeLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ notice_id: string }>;
}) {
  const { notice_id } = await params;
  const getProjectIdForNotice = cache(async (id: string) => {
    const n = await db.notice.findUnique({
      where: { id },
      select: { project_id: true },
    });
    return n?.project_id ?? undefined;
  });
  const projectId = await getProjectIdForNotice(notice_id);
  const crumbs = await buildNoticeCrumbsById(notice_id);
  return (
    <AppShell
      selectedProjectId={projectId}
      topbarBreadcrumbs={<AppBreadcrumbs items={crumbs} />}
      topbarSearchPlaceholder="Search occurrences…"
      topbarEndSlot={
        projectId ? <EditProjectButton projectId={projectId} /> : undefined
      }
    >
      {children}
    </AppShell>
  );
}
