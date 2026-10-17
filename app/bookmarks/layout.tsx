import AppBreadcrumbs from "@/components/layout/AppBreadcrumbs";
import { AppShell } from "@/components/layout/AppShell";
import { buildBookmarksCrumbs } from "@/lib/routing/breadcrumbs";

export default function BookmarksLayout({
  children,
}: LayoutProps<"/bookmarks">) {
  const crumbs = buildBookmarksCrumbs();
  return (
    <Suspense fallback={<Loading />}>
      <AppShell
        activeSection="bookmarks"
        topbarBreadcrumbs={<AppBreadcrumbs items={crumbs} />}
        topbarSearchPlaceholder="Search bookmarks…"
      >
        {children}
      </AppShell>
    </Suspense>
  );
}

import { Suspense } from "react";
import Loading from "@/app/loading";
