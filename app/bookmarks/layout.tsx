import AppBreadcrumbs from "@/components/AppBreadcrumbs";
import { AppShell } from "@/components/AppShell";
import { buildBookmarksCrumbs } from "@/lib/breadcrumbs";
import type { ReactNode } from "react";

export default function BookmarksLayout({ children }: { children: ReactNode }) {
  const crumbs = buildBookmarksCrumbs();
  return (
    <AppShell
      activeSection="bookmarks"
      topbarBreadcrumbs={<AppBreadcrumbs items={crumbs} />}
      topbarSearchPlaceholder="Search bookmarks…"
    >
      {children}
    </AppShell>
  );
}
