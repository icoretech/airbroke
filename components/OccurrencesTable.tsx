// components/OccurrencesTable.tsx

import Link from "next/link";
import { getOccurrences } from "@/lib/queries/occurrences";
import CounterLabel from "./CounterLabel";
import CustomTimeAgo from "./CustomTimeAgo";
import EnvironmentLabel from "./EnvironmentLabel";
import type { OccurrenceSearchParams } from "@/lib/queries/occurrences";

type OccurrencesTableProps = {
  noticeId: string;
  searchParams: OccurrenceSearchParams;
} & OccurrenceSearchParams;

export default async function OccurrencesTable({
  noticeId,
  searchParams,
}: OccurrencesTableProps) {
  const occurrences = await getOccurrences(noticeId, searchParams);

  return (
    <ul className="space-y-3 sm:space-y-0 sm:divide-y sm:divide-card/40">
      {occurrences.map((occurrence) => (
        <li
          key={occurrence.id}
          className="relative flex flex-col gap-3 rounded-lg border border-card/40 bg-card/40 px-4 py-4 shadow-xs transition-colors duration-200 hover:bg-linear-to-r hover:from-airbroke-800 hover:to-airbroke-900 sm:flex-row sm:items-center sm:gap-4 sm:rounded-none sm:border-0 sm:bg-transparent sm:shadow-none"
        >
          <div className="min-w-0 flex-auto">
            <div className="flex items-center gap-x-3">
              <h2 className="min-w-0 text-sm font-semibold leading-6 text-white">
                <Link
                  href={`/occurrences/${occurrence.id}`}
                  className="flex min-w-0 gap-x-2"
                >
                  <span className="min-w-0 truncate">{occurrence.message}</span>
                  <span className="absolute inset-0" />
                </Link>
              </h2>
            </div>
            <div className="mt-3 flex items-center gap-x-2.5 text-xs leading-5 text-gray-400">
              <div className="flex-none rounded-md bg-gray-900 px-2 py-1 text-xs font-medium text-white ring-1 ring-inset ring-gray-700">
                {occurrence.notice.kind}
              </div>
              <EnvironmentLabel env={occurrence.notice.env} />

              {occurrence.resolved_at && (
                <div className="flex-none rounded-md bg-green-900 px-2 py-1 text-xs font-medium text-white ring-1 ring-inset ring-green-700">
                  resolved
                </div>
              )}

              <p className="truncate">
                First seen:{" "}
                <CustomTimeAgo date={new Date(occurrence.created_at)} />
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 sm:ml-auto sm:justify-end">
            <div className="text-left text-xs sm:min-w-50 sm:text-right">
              <p className="text-white">
                <CustomTimeAgo date={new Date(occurrence.updated_at)} />
              </p>
              <p className="text-xs text-gray-400">
                {occurrence.updated_at.toUTCString()}
              </p>
            </div>
            <CounterLabel counter={occurrence.seen_count} />
          </div>
        </li>
      ))}
    </ul>
  );
}
