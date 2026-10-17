// components/NoticesTable.tsx

import Link from "next/link";
import CounterLabel from "@/components/common/CounterLabel";
import CustomTimeAgo from "@/components/common/CustomTimeAgo";
import EnvironmentLabel from "@/components/common/EnvironmentLabel";
import ResolveNoticeButton from "@/components/notice/ResolveNoticeButton";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { getNotices } from "@/lib/queries/notices";
import type { NoticeSearchParams } from "@/lib/queries/notices";

type NoticesTableProps = {
  projectId: string;
  searchParams: NoticeSearchParams;
};

export default async function NoticesTable({
  projectId,
  searchParams,
}: NoticesTableProps) {
  const notices = await getNotices(projectId, searchParams);

  if (notices.length === 0) {
    const hasFilters = Boolean(
      searchParams.searchQuery || searchParams.filterByEnv,
    );
    const status = searchParams.resolvedFilter ?? "unresolved";
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>
            {hasFilters
              ? "No matching notices"
              : status === "all"
                ? "No notices yet"
                : `No ${status} notices`}
          </EmptyTitle>
          <EmptyDescription>
            {hasFilters
              ? "Try different search terms or clear the filters to view all notices."
              : status === "all"
                ? "Configure an SDK to start sending errors to this project."
                : "There are no notices with this status. View all statuses to check for other errors."}
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent className="flex-row flex-wrap justify-center">
          {(hasFilters || status !== "all") && (
            <Link
              href={`/projects/${projectId}?status=all`}
              className={buttonVariants({ variant: "outline" })}
            >
              View all notices
            </Link>
          )}
          <Link
            href={`/projects/${projectId}/edit`}
            className={buttonVariants({ variant: "outline" })}
          >
            Configure SDKs
          </Link>
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <ul className="flex flex-col gap-3 sm:gap-0 sm:divide-y sm:divide-card/40">
      {notices.map((notice) => (
        <li
          key={notice.id}
          className="relative flex flex-col gap-3 rounded-lg border border-card/40 bg-card/40 px-4 py-4 shadow-xs transition-colors duration-200 hover:bg-linear-to-r hover:from-airbroke-800 hover:to-airbroke-900 sm:gap-4 sm:rounded-none sm:border-0 sm:bg-transparent sm:shadow-none lg:flex-row lg:items-center"
        >
          <div className="min-w-0 flex-auto">
            <div className="flex items-center gap-x-3">
              <EnvironmentLabel env={notice.env} />
              {notice.resolved_at && (
                <Badge variant="secondary">resolved</Badge>
              )}
              <h2 className="min-w-0 text-sm font-semibold leading-6 text-white">
                <Link
                  href={`/notices/${notice.id}`}
                  className="flex min-w-0 gap-x-2"
                >
                  <span className="min-w-0 truncate">{notice.kind}</span>
                  <span className="absolute inset-0" />
                </Link>
              </h2>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 lg:ml-auto lg:justify-end">
            <p className="text-xs text-white lg:min-w-50 lg:text-right">
              <CustomTimeAgo date={new Date(notice.updated_at)} />
            </p>
            <CounterLabel counter={notice.seen_count} />
            <div className="relative z-10">
              <ResolveNoticeButton
                noticeId={notice.id}
                projectId={projectId}
                resolvedAt={notice.resolved_at}
              />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
