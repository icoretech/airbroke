// components/BookmarksTable.tsx

import Link from "next/link";
import { TbBookmarks } from "react-icons/tb";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { auth } from "@/lib/auth";
import { getOccurrenceBookmarks } from "@/lib/queries/occurrenceBookmarks";
import CounterLabel from "./CounterLabel";
import CustomTimeAgo from "./CustomTimeAgo";
import EnvironmentLabel from "./EnvironmentLabel";

type BookmarksTableProps = {
  searchQuery?: string | undefined;
};

export default async function BookmarksTable({
  searchQuery,
}: BookmarksTableProps) {
  const session = await auth();

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
          <Button asChild variant="outline" className="w-40">
            <Link href="/projects">Browse projects</Link>
          </Button>
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
          className="space-y-3 sm:space-y-0 sm:overflow-hidden sm:rounded-xl sm:border sm:border-card/40 sm:bg-card/40 sm:shadow-md sm:ring-1 sm:ring-card/40 sm:backdrop-blur"
        >
          <div className="flex w-full flex-wrap items-center justify-between gap-3 rounded-lg border border-card/40 bg-card/40 px-4 py-3 shadow-xs sm:rounded-none sm:border-0 sm:bg-transparent sm:shadow-none sm:border-b sm:border-card/40">
            <h2 className="text-sm font-semibold text-foreground">{label}</h2>
            <p className="text-xs text-muted-foreground">
              {bookmarks.length} bookmarked
            </p>
          </div>

          <ul className="space-y-3 sm:space-y-0 sm:divide-y sm:divide-card/40">
            {bookmarks.map((bookmark) => (
              <li
                key={bookmark.occurrence.id}
                className="relative flex flex-col gap-3 rounded-lg border border-card/40 bg-card/40 px-4 py-4 shadow-xs transition-colors duration-200 hover:bg-linear-to-r hover:from-airbroke-800 hover:to-airbroke-900 sm:flex-row sm:items-center sm:gap-4 sm:rounded-none sm:border-0 sm:bg-transparent sm:shadow-none"
              >
                <div className="min-w-0 flex-auto">
                  <div className="flex items-center gap-x-3">
                    <EnvironmentLabel env={bookmark.occurrence.notice.env} />
                    <h3 className="min-w-0 text-sm font-semibold leading-6 text-white">
                      <Link
                        href={`/occurrences/${bookmark.occurrence_id}`}
                        className="flex min-w-0 gap-x-2"
                      >
                        <span className="min-w-0 truncate">
                          {bookmark.occurrence.message}
                        </span>
                        <span className="absolute inset-0" />
                      </Link>
                    </h3>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs leading-5 text-muted-foreground">
                    <div className="flex-none rounded-md bg-gray-900 px-2 py-1 text-xs font-medium text-white ring-1 ring-inset ring-gray-700">
                      {bookmark.occurrence.notice.kind}
                    </div>
                    <p className="min-w-0 truncate">
                      First seen:{" "}
                      <CustomTimeAgo
                        date={new Date(bookmark.occurrence.created_at)}
                      />
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 sm:ml-auto sm:justify-end">
                  <p className="text-xs text-white sm:min-w-50 sm:text-right">
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
