// components/NoticesTable.tsx

import Link from "next/link";
import { getNotices } from "@/lib/queries/notices";
import CounterLabel from "./CounterLabel";
import CustomTimeAgo from "./CustomTimeAgo";
import EnvironmentLabel from "./EnvironmentLabel";
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

  return (
    <ul className="space-y-3 sm:space-y-0 sm:divide-y sm:divide-card/40">
      {notices.map((notice) => (
        <li
          key={notice.id}
          className="relative flex flex-col gap-3 rounded-lg border border-card/40 bg-card/40 px-4 py-4 shadow-xs transition-colors duration-200 hover:bg-linear-to-r hover:from-airbroke-800 hover:to-airbroke-900 sm:flex-row sm:items-center sm:gap-4 sm:rounded-none sm:border-0 sm:bg-transparent sm:shadow-none"
        >
          <div className="min-w-0 flex-auto">
            <div className="flex items-center gap-x-3">
              <EnvironmentLabel env={notice.env} />
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

          <div className="flex items-center justify-between gap-3 sm:ml-auto sm:justify-end">
            <p className="text-xs text-white sm:min-w-50 sm:text-right">
              <CustomTimeAgo date={new Date(notice.updated_at)} />
            </p>
            <CounterLabel counter={notice.seen_count} />
          </div>
        </li>
      ))}
    </ul>
  );
}
