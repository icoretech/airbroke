import classNames from '@/lib/classNames';
import { notice, project } from '@prisma/client';
import Link from 'next/link';
import CustomTimeAgo from './CustomTimeAgo';
import OccurrenceCounterLabel from './OccurrenceCounterLabel';

export default function NoticesTable({ project, notices }: { project: project; notices: notice[] }) {
  const environments = {
    default: 'text-white bg-gray-900 ring-gray-700',
    production: 'text-indigo-400 bg-indigo-400/10 ring-indigo-400/30',
    staging: 'text-gray-400 bg-gray-400/10 ring-gray-400/20',
  };

  return (
    <ul role="list" className="divide-y divide-white/5">
      {notices.map((notice) => (
        <li key={notice.id.toString()} className="relative flex items-center space-x-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="min-w-0 flex-auto">
            <div className="flex items-center gap-x-3">
              <div
                className={classNames(
                  notice.env === 'production'
                    ? environments.production
                    : notice.env === 'staging'
                    ? environments.staging
                    : environments.default,
                  'flex-none rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset'
                )}
              >
                {notice.env}
              </div>
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
