// components/NoticesTable.tsx

import { getNotices } from '@/lib/queries/notices';
import Link from 'next/link';
import CounterLabel from './CounterLabel';
import CustomTimeAgo from './CustomTimeAgo';
import EnvironmentLabel from './EnvironmentLabel';

import type { NoticeSearchParams } from '@/lib/queries/notices';

type NoticesTableProps = {
  projectId: string;
  searchParams: NoticeSearchParams;
};

export default async function NoticesTable({ projectId, searchParams }: NoticesTableProps) {
  const notices = await getNotices(projectId, searchParams);

  return (
    <ul role="list" className="divide-y divide-white/5">
      {notices.map((notice) => (
        <li
          key={notice.id}
          className="relative flex items-center space-x-4 px-4 py-4 transition-colors duration-200 hover:bg-gradient-to-r hover:from-airbroke-800 hover:to-airbroke-900 sm:px-6 lg:px-8"
        >
          <div className="min-w-0 flex-auto">
            <div className="flex items-center gap-x-3">
              <EnvironmentLabel env={notice.env} />
              <h2 className="min-w-0 text-sm font-semibold leading-6 text-white">
                <Link href={`/notices/${notice.id}`} className="flex gap-x-2">
                  <span className="truncate">{notice.kind}</span>
                  <span className="absolute inset-0" />
                </Link>
              </h2>
            </div>
          </div>

          <p className="min-w-[200px] text-right text-xs text-white">
            <CustomTimeAgo date={new Date(notice.updated_at)} />
          </p>
          <CounterLabel counter={notice.seen_count} />
        </li>
      ))}
    </ul>
  );
}
