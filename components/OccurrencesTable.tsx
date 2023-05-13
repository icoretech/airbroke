import classNames from '@/lib/classNames';
import { notice, occurrence, project } from '@prisma/client';
import Link from 'next/link';
import numeral from 'numeral';
import CustomTimeAgo from './CustomTimeAgo';

export default function OccurrencesTable({
  project,
  notice,
  occurrences,
  currentSort,
}: {
  project: project;
  notice: notice;
  occurrences: occurrence[];
  currentSort: 'asc' | 'desc';
}) {
  const environments = {
    default: 'text-gray-400 bg-gray-400/10 ring-gray-400/20',
    production: 'text-indigo-400 bg-indigo-400/10 ring-indigo-400/30',
    staging: 'text-white bg-gray-900 ring-gray-700',
    rose: 'text-white bg-rose-900 ring-rose-700',
  };

  return (
    <>
      {occurrences.length > 0 && (
        <ul role="list" className="divide-y divide-white/5">
          {occurrences.map((occurrence) => (
            <li
              key={occurrence.id.toString()}
              className="relative flex items-center space-x-4 px-4 py-4 sm:px-6 lg:px-8"
            >
              <div className="min-w-0 flex-auto">
                <div className="flex items-center gap-x-3">
                  <h2 className="min-w-0 text-sm font-semibold leading-6 text-white">
                    <Link
                      href={`/projects/${project.id.toString()}/notices/${notice.id.toString()}/occurrences/${
                        occurrence.id
                      }`}
                      className="flex gap-x-2"
                    >
                      <span className="truncate">{occurrence.message}</span>
                      <span className="absolute inset-0" />
                    </Link>
                  </h2>
                </div>
                <div className="mt-3 flex items-center gap-x-2.5 text-xs leading-5 text-gray-400">
                  <div
                    className={classNames(
                      environments['default'],
                      'flex-none rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset'
                    )}
                  >
                    {notice.kind}
                  </div>
                  <div
                    className={classNames(
                      environments['default'],
                      'flex-none rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset'
                    )}
                  >
                    {notice.env}
                  </div>
                  <p className="truncate">
                    First seen: <CustomTimeAgo datetime={occurrence.created_at} locale="en_US" />
                  </p>
                </div>
              </div>

              <div className="text-right text-xs">
                <p className="text-white">
                  <CustomTimeAgo datetime={occurrence.updated_at} locale="en_US" />
                </p>
                <p className="text-xs text-gray-400">{occurrence.updated_at.toUTCString()}</p>
              </div>

              <div
                className={classNames(
                  environments['default'],
                  'flex-none rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset'
                )}
              >
                {numeral(occurrence.seen_count).format('0a')}
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
