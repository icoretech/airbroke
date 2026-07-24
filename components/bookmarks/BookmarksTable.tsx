// components/BookmarksTable.tsx

import { headers } from "next/headers";
import Link from "next/link";
import { TbBookmarks } from "react-icons/tb";
import CounterLabel from "@/components/common/CounterLabel";
import CustomTimeAgo from "@/components/common/CustomTimeAgo";
import EnvironmentLabel from "@/components/common/EnvironmentLabel";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { getAuth } from "@/lib/auth";
import { getOccurrenceBookmarks } from "@/lib/queries/occurrenceBookmarks";

type BookmarksTableProps = {
  searchQuery?: string | undefined;
};

export default async function BookmarksTable({
  searchQuery,
}: BookmarksTableProps) {
  const session = await getAuth().api.getSession({ headers: await headers() });

  const occurrenceBookmarks = await getOccurrenceBookmarks(
    session?.user?.id,
    searchQuery,
  );

  type BookmarkRow = Awaited<ReturnType<typeof getOccurrenceBookmarks>>[number];

  if (occurrenceBookmarks.length === 0) {
    return (
      <Empty>
        <EmptyMedia variant="icon">
          <TbBookmarks className="size-8" />
        </EmptyMedia>
        <EmptyTitle>No bookmarks</EmptyTitle>
        <EmptyDescription>
          Bookmark an occurrence to keep it handy for later.
        </EmptyDescription>
        <EmptyContent>
          <Link
            href="/projects"
            className={buttonVariants({
              variant: "outline",
              className: "w-40",
            })}
          >
            Browse projects
          </Link>
        </EmptyContent>
      </Empty>
    );
  }

  const groups = new Map<
    string,
    {
      label: string;
      bookmarks: BookmarkRow[];
    }
  >();

  for (const bookmark of occurrenceBookmarks) {
    const project = bookmark.occurrence.notice.project;
    const groupKey = project.id;
    const label = project.organization
      ? `${project.organization} / ${project.name}`
      : project.name;

    const existing = groups.get(groupKey);
    if (existing) {
      existing.bookmarks.push(bookmark);
    } else {
      groups.set(groupKey, { label, bookmarks: [bookmark] });
    }
  }

  const groupedBookmarksArray = Array.from(groups.entries())
    .map(([projectId, value]) => ({ projectId, ...value }))
    .sort((a, b) => a.label.localeCompare(b.label));

  return (
    <div className="space-y-6">
      {groupedBookmarksArray.map(({ projectId, label, bookmarks }) => (
        <section
          key={projectId}
          className="overflow-hidden rounded-xl border border-border bg-card shadow-sm"
        >
          <div className="flex w-full flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
            <h2 className="text-sm font-semibold text-foreground">{label}</h2>
            <p className="text-xs text-muted-foreground">
              {bookmarks.length} bookmarked
            </p>
          </div>

          <ul className="divide-y divide-border">
            {bookmarks.map((bookmark) => (
              <li
                key={bookmark.occurrence.id}
                className="relative flex flex-col gap-3 px-4 py-4 transition-colors duration-200 hover:bg-muted/50 sm:gap-4 lg:flex-row lg:items-center"
              >
                <div className="min-w-0 flex-auto">
                  <div className="flex items-center gap-x-3">
                    <EnvironmentLabel env={bookmark.occurrence.notice.env} />
                    <h3 className="min-w-0 text-sm font-semibold leading-6 text-foreground">
                      <Link
                        href={`/occurrences/${bookmark.occurrence_id}`}
                        className="flex min-w-0 gap-x-2"
                      >
                        <span className="min-w-0 line-clamp-2 wrap-anywhere">
                          {bookmark.occurrence.message}
                        </span>
                        <span className="absolute inset-0" />
                      </Link>
                    </h3>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs leading-5 text-muted-foreground">
                    <Badge variant="secondary" className="flex-none">
                      {bookmark.occurrence.notice.kind}
                    </Badge>
                    <p className="min-w-0">
                      First seen:{" "}
                      <CustomTimeAgo
                        date={new Date(bookmark.occurrence.created_at)}
                      />
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 lg:ml-auto lg:justify-end">
                  <p className="text-xs text-foreground lg:min-w-50 lg:text-right">
                    <CustomTimeAgo
                      date={new Date(bookmark.occurrence.updated_at)}
                    />
                  </p>
                  <CounterLabel counter={bookmark.occurrence.seen_count} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
