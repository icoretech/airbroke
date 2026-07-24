// components/OccurrencesTable.tsx

import { headers } from "next/headers";
import Link from "next/link";
import CounterLabel from "@/components/common/CounterLabel";
import CustomTimeAgo from "@/components/common/CustomTimeAgo";
import EnvironmentLabel from "@/components/common/EnvironmentLabel";
import BookmarkButton from "@/components/occurrence/BookmarkButton";
import ResolveButton from "@/components/occurrence/ResolveButton";
import { getAuth } from "@/lib/auth";
import { getBookmarkedOccurrenceIds } from "@/lib/queries/occurrenceBookmarks";
import { getOccurrences } from "@/lib/queries/occurrences";
import type { OccurrenceSearchParams } from "@/lib/queries/occurrences";

type OccurrencesTableProps = {
  noticeId: string;
  searchParams: OccurrenceSearchParams;
} & OccurrenceSearchParams;

export default async function OccurrencesTable({
  noticeId,
  searchParams,
}: OccurrencesTableProps) {
  const [occurrences, session] = await Promise.all([
    getOccurrences(noticeId, searchParams),
    getAuth().api.getSession({ headers: await headers() }),
  ]);
  const userId = session?.user?.id;
  const occurrenceIds = occurrences.map((o) => o.id);
  const bookmarkedIds = await getBookmarkedOccurrenceIds(userId, occurrenceIds);

  return (
    <ul className="space-y-3 sm:space-y-0 sm:divide-y sm:divide-border">
      {occurrences.map((occurrence) => (
        <li
          key={occurrence.id}
          className="relative flex flex-col gap-3 rounded-lg border border-border bg-card px-4 py-4 shadow-xs transition-colors duration-200 hover:bg-muted/50 sm:gap-4 sm:rounded-none sm:border-0 sm:bg-transparent sm:shadow-none lg:flex-row lg:items-center"
        >
          <div className="min-w-0 flex-auto">
            <div className="flex items-center gap-x-3">
              <h2 className="min-w-0 text-sm font-semibold leading-6 text-foreground">
                <Link
                  href={`/occurrences/${occurrence.id}`}
                  className="flex min-w-0 gap-x-2"
                >
                  <span className="min-w-0 line-clamp-2 wrap-anywhere">
                    {occurrence.message}
                  </span>
                  <span className="absolute inset-0" />
                </Link>
              </h2>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2.5 text-xs leading-5 text-muted-foreground">
              <div className="flex-none rounded-md bg-muted px-2 py-1 text-xs font-medium text-foreground ring-1 ring-inset ring-border">
                {occurrence.notice.kind}
              </div>
              <EnvironmentLabel env={occurrence.notice.env} />

              {occurrence.resolved_at && (
                <div className="flex-none rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/30">
                  resolved
                </div>
              )}

              <p>
                First seen:{" "}
                <CustomTimeAgo date={new Date(occurrence.created_at)} />
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 lg:ml-auto lg:justify-end">
            <div className="text-left text-xs lg:min-w-50 lg:text-right">
              <p className="text-foreground">
                <CustomTimeAgo date={new Date(occurrence.updated_at)} />
              </p>
              <p className="text-xs text-muted-foreground">
                {occurrence.updated_at.toUTCString()}
              </p>
            </div>
            <CounterLabel counter={occurrence.seen_count} />
            <div className="relative z-10 flex items-center gap-1">
              <BookmarkButton
                occurrenceId={occurrence.id}
                isBookmarked={bookmarkedIds.has(occurrence.id)}
              />
              <ResolveButton
                occurrenceId={occurrence.id}
                resolvedAt={occurrence.resolved_at}
                iconOnly
              />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
