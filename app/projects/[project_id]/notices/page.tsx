import NoticesTable from '@/components/NoticesTable';
import ProjectHeader from '@/components/ProjectHeader';
import SidebarDesktop from '@/components/SidebarDesktop';
import { prisma } from '@/lib/db';
import Search from './Search';
import Sort from './Sort';

type SortAttribute = 'env' | 'kind' | 'updated_at' | 'occurrences_count';

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
    ...(search && { kind: { contains: search, mode: 'insensitive', gt: '' } }),
  };

  const notices = await prisma.notice.findMany({
    where: whereObject,
    orderBy: orderByObject,
  });

  return (
    <>
      {/* @ts-expect-error Server Component */}
      <SidebarDesktop selectedProject={project} />

      <main className="xl:pl-72">
        <div className="sticky top-0 z-40 bg-airbroke-900">
          <ProjectHeader project={project} />
        </div>

        <div className="sticky top-16 z-40 bg-airbroke-900 px-4 shadow-sm sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex flex-1 items-center">
              <Search />
            </div>
            <div className="flex flex-1 items-center justify-end">
              <Sort currentSortAttribute={sortAttr} currentSort={sortBy} />
            </div>
          </div>
        </div>

        <NoticesTable
          notices={notices}
          project={project}
          currentSearchTerm={search}
          currentSortAttribute={sortAttr}
          currentSort={sortBy}
        />
      </main>
    </>
  );
}
