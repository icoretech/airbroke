import { Notice, Occurrence, Project } from '@prisma/client';
import Link from 'next/link';
import OccurrenceCounterLabel from './CounterLabel';
import CustomTimeAgo from './CustomTimeAgo';
import EnvironmentLabel from './EnvironmentLabel';

export default function OccurrencesTable({
  project,
  notice,
  occurrences,
}: {
  project: Project;
  notice: Notice;
  occurrences: Occurrence[];
}) {
  return (
    <ul role="list" className="divide-y divide-white/5">
      {occurrences.map((occurrence) => (
        <li
          key={occurrence.id}
          className="relative flex items-center space-x-4 px-4 py-4 transition-colors duration-200 hover:bg-airbroke-800 sm:px-6 lg:px-8"
        >
          <div className="min-w-0 flex-auto">
            <div className="flex items-center gap-x-3">
              <h2 className="min-w-0 text-sm font-semibold leading-6 text-white">
                <Link href={`/occurrences/${occurrence.id}`} className="flex gap-x-2">
                  <span className="truncate">{occurrence.message}</span>
                  <span className="absolute inset-0" />
                </Link>
              </h2>
            </div>
            <div className="mt-3 flex items-center gap-x-2.5 text-xs leading-5 text-gray-400">
              <div className="flex-none rounded-md bg-gray-900 px-2 py-1 text-xs font-medium text-white ring-1 ring-inset ring-gray-700">
                {notice.kind}
              </div>
              <EnvironmentLabel env={notice.env} />

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
          <OccurrenceCounterLabel counter={occurrence.seen_count} />
        </li>
      ))}
    </ul>
  );
}
