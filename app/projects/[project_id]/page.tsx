import Breadcrumbs from '@/components/Breadcrumbs';
import NoData from '@/components/NoData';
import NoticesTable from '@/components/NoticesTable';
import Search from '@/components/Search';
import SidebarDesktop from '@/components/SidebarDesktop';
import SidebarMobile from '@/components/SidebarMobile';
import ProjectActionsMenu from '@/components/project/ActionsMenu';
import { prisma } from '@/lib/db';
import type { Route } from 'next';
import Sort from './Sort';

type SortAttribute = 'env' | 'kind' | 'updated_at' | 'seen_count';

export const revalidate = 60;

// /projects/15
export default async function ProjectNotices({
  params,
  searchParams,
}: {
  params: { project_id: string };
  searchParams: Record<string, string>;
}) {
  const project = await prisma.project.findFirst({ where: { id: params.project_id } });
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

  const breadcrumbs = [
    {
      name: `${project.organization.toLowerCase()} / ${project.name.toLowerCase()}`,
      href: `/projects/${project.id}` as Route,
      current: true,
    },
  ];

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
            <nav className="border-b border-white border-opacity-10 bg-gradient-to-r from-airbroke-800 to-airbroke-900">
              <div className="flex justify-between pr-4 sm:pr-6 lg:pr-6">
                <Breadcrumbs breadcrumbs={breadcrumbs} />
                <ProjectActionsMenu project={project} />
              </div>
            </nav>

            <div className="flex h-16 shrink-0 items-center gap-x-6 border-b border-white/5 px-4 shadow-sm sm:px-6 lg:px-8">
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
