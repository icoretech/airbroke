import AppBreadcrumbs from "@/components/AppBreadcrumbs";
import { AppShell } from "@/components/AppShell";
import { buildBookmarksCrumbs } from "@/lib/breadcrumbs";

export default function BookmarksLayout({
  children,
}: LayoutProps<"/bookmarks">) {
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
