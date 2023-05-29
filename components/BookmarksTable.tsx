import { authOptions } from '@/lib/auth';
import { getOccurrenceBookmarks } from '@/lib/queries/occurrenceBookmarks';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import OccurrenceCounterLabel from './CounterLabel';
import CustomTimeAgo from './CustomTimeAgo';
import EnvironmentLabel from './EnvironmentLabel';

type BookmarksTableProps = {
  searchQuery?: string | undefined;
};

async function BookmarksTable({ searchQuery }: BookmarksTableProps) {
  const session = await getServerSession(authOptions);

  const occurrenceBookmarks = await getOccurrenceBookmarks(session?.user?.id, searchQuery);
  // Group by project name
  const groupedBookmarks = occurrenceBookmarks.reduce((acc, bookmark) => {
    const projectName = bookmark.occurrence.notice.project.name;
    if (!acc[projectName]) {
      acc[projectName] = [];
    }
    acc[projectName].push(bookmark);
    return acc;
  }, {} as Record<string, (typeof occurrenceBookmarks)[0][]>);

  // Convert the grouped object into an array that can be mapped over
  const groupedBookmarksArray = Object.entries(groupedBookmarks);
  groupedBookmarksArray.sort(([projectNameA], [projectNameB]) => projectNameA.localeCompare(projectNameB));

  return (
    <div>
      {groupedBookmarksArray.map(([projectName, bookmarks]) => (
        <div key={projectName}>
          <div className="bg-airbroke-800 px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-airbroke-700">
            {projectName}
          </div>
          <ul role="list" className="divide-y divide-white/5">
            {bookmarks.map((bookmark) => (
              <li
                key={bookmark.occurrence.id}
                className="relative flex items-center space-x-4 px-4 py-4 transition-colors duration-200 hover:bg-airbroke-800 sm:px-6 lg:px-8"
              >
                <div className="min-w-0 flex-auto">
                  <div className="flex items-center gap-x-3">
                    <h2 className="min-w-0 text-sm font-semibold leading-6 text-white">
                      <Link href={`/occurrences/${bookmark.occurrence_id}`} className="flex gap-x-2">
                        <span className="truncate">{bookmark.occurrence.message}</span>
                        <span className="absolute inset-0" />
                      </Link>
                    </h2>
                  </div>
                  <div className="mt-3 flex items-center gap-x-2.5 text-xs leading-5 text-gray-400">
                    <div className="flex-none rounded-md bg-gray-900 px-2 py-1 text-xs font-medium text-white ring-1 ring-inset ring-gray-700">
                      {bookmark.occurrence.notice.kind}
                    </div>
                    <EnvironmentLabel env={bookmark.occurrence.notice.env} />

                    <p className="truncate">
                      First seen: <CustomTimeAgo datetime={bookmark.occurrence.created_at} locale="en_US" />
                    </p>
                  </div>
                </div>

                <div className="text-right text-xs">
                  <p className="text-white">
                    <CustomTimeAgo datetime={bookmark.occurrence.updated_at} locale="en_US" />
                  </p>
                  <p className="text-xs text-gray-400">{bookmark.occurrence.updated_at.toUTCString()}</p>
                </div>
                <OccurrenceCounterLabel counter={bookmark.occurrence.seen_count} />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default BookmarksTable as unknown as (props: BookmarksTableProps) => JSX.Element;
