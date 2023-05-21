import NoData from '@/components/NoData';
import NoticesTable from '@/components/NoticesTable';
import ProjectHeader from '@/components/ProjectHeader';
import Search from '@/components/Search';
import SidebarDesktop from '@/components/SidebarDesktop';
import SidebarMobile from '@/components/SidebarMobile';
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
    ...(search && { kind: { contains: search, mode: 'insensitive' } }),
  };

  const notices = await prisma.notice.findMany({
    where: whereObject,
    orderBy: orderByObject,
  });

  return (
    <>
      <div>
        <SidebarMobile>
          {/* @ts-expect-error Server Component */}
          <SidebarDesktop selectedProject={project} />
        </SidebarMobile>

        <div className="hidden xl:fixed xl:inset-y-0 xl:z-50 xl:flex xl:w-72 xl:flex-col">
          {/* @ts-expect-error Server Component */}
          <SidebarDesktop selectedProject={project} />
        </div>

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
      </div>
    </>
  );
}
