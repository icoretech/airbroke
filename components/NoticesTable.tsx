import { notice, project } from '@prisma/client';
import Link from 'next/link';
import OccurrenceCounterLabel from './CounterLabel';
import CustomTimeAgo from './CustomTimeAgo';
import EnvironmentLabel from './EnvironmentLabel';

export default function NoticesTable({ project, notices }: { project: project; notices: notice[] }) {
  return (
    <ul role="list" className="divide-y divide-white/5">
      {notices.map((notice) => (
        <li
          key={notice.id.toString()}
          className="relative flex items-center space-x-4 px-4 py-4 transition-colors duration-200 hover:bg-airbroke-800 sm:px-6 lg:px-8"
        >
          <div className="min-w-0 flex-auto">
            <div className="flex items-center gap-x-3">
              <EnvironmentLabel env={notice.env} />
              <h2 className="min-w-0 text-sm font-semibold leading-6 text-white">
                <Link
                  href={`/projects/${project.id.toString()}/notices/${notice.id.toString()}/occurrences`}
                  className="flex gap-x-2"
                >
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
