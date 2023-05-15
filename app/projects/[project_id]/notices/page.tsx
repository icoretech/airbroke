import NoData from '@/components/NoData';
import NoticesTable from '@/components/NoticesTable';
import ProjectHeader from '@/components/ProjectHeader';
import Search from '@/components/Search';
import SidebarDesktop from '@/components/SidebarDesktop';
import { prisma } from '@/lib/db';
import Sort from './Sort';

type SortAttribute = 'env' | 'kind' | 'updated_at' | 'seen_count';

export const revalidate = 60;

export default async function ProjectNotices({
  params,
  searchParams,
}: {
  params: { project_id: string };
  searchParams: Record<string, string>;
}) {
  const project = await prisma.project.findFirst({ where: { id: BigInt(params.project_id) } });
  if (!project) {
    throw new Error('Project not found');
  }
  const sortBy = searchParams.sortBy === 'asc' ? 'asc' : 'desc';
  const sortAttr = (searchParams.sortAttr ?? 'updated_at') as SortAttribute;
  const filterByEnv = searchParams.filterByEnv;
  const search = searchParams.q;

  const orderByObject = {
    [sortAttr]: sortBy,
  };

  const whereObject: any = {
    project_id: project.id,
    ...(filterByEnv && { env: filterByEnv }),
  };

  const occurrenceNoticeIds = [];
  if (search) {
    // Fetch the notice IDs from the notice table where kind matches the search term
    const noticeIdsFromNoticeTable = await prisma.notice.findMany({
      where: {
        ...whereObject,
        kind: { contains: search, mode: 'insensitive' },
      },
      select: {
        id: true,
      },
    });

    // Fetch the notice IDs from the occurrence table where the message matches the search term
    const noticeIdsFromOccurrenceTable = await prisma.occurrence.findMany({
      where: {
        message: {
          contains: search,
          mode: 'insensitive',
        },
      },
      select: {
        notice_id: true,
      },
    });

    // Combine the notice IDs from both searches
    const combinedNoticeIds = [
      ...noticeIdsFromNoticeTable.map((n) => n.id),
      ...noticeIdsFromOccurrenceTable.map((o) => o.notice_id),
    ];

    occurrenceNoticeIds.push(...combinedNoticeIds);
  }

  const notices = await prisma.notice.findMany({
    where: {
      ...whereObject,
      id: { in: occurrenceNoticeIds },
    },
    orderBy: orderByObject,
  });

  return (
    <>
      {/* @ts-expect-error Server Component */}
      <SidebarDesktop selectedProject={project} />

      <main className="xl:pl-72">
        <div className="sticky top-0 z-40 bg-airbroke-900">
          <ProjectHeader project={project} />

          <div className="flex h-16 shrink-0 items-center gap-x-6 border-b border-white/5  px-4 shadow-sm sm:px-6 lg:px-8">
            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
              <Search currentSearchTerm={search} />
              <Sort currentSortAttribute={sortAttr} currentSort={sortBy} />
            </div>
          </div>
        </div>

        {notices.length === 0 ? <NoData project={project} /> : <NoticesTable notices={notices} project={project} />}
      </main>
    </>
  );
}
