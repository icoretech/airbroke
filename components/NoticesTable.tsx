import type { NoticeSearchParams } from '@/lib/queries/notices';
import { getNotices } from '@/lib/queries/notices';
import Link from 'next/link';
import OccurrenceCounterLabel from './CounterLabel';
import CustomTimeAgo from './CustomTimeAgo';
import EnvironmentLabel from './EnvironmentLabel';

type NoticesTableProps = {
  projectId: string;
  searchParams: NoticeSearchParams;
};

async function NoticesTable({ projectId, searchParams }: NoticesTableProps) {
  const notices = await getNotices(projectId, searchParams);

  return (
    <ul role="list" className="divide-y divide-white/5">
      {notices.map((notice) => (
        <li
          key={notice.id}
          className="relative flex items-center space-x-4 px-4 py-4 transition-colors duration-200 hover:bg-airbroke-800 sm:px-6 lg:px-8"
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

          <p className="text-right text-xs text-white">
            <CustomTimeAgo datetime={notice.updated_at} locale="en_US" />
          </p>
          <OccurrenceCounterLabel counter={notice.seen_count} />
        </li>
      ))}
    </ul>
  );
}

export default NoticesTable as unknown as (props: NoticesTableProps) => JSX.Element;
