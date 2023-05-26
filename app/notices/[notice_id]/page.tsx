import Breadcrumbs from '@/components/Breadcrumbs';
import NoData from '@/components/NoData';
import OccurrencesTable from '@/components/OccurrencesTable';
import Search from '@/components/Search';
import SidebarDesktop from '@/components/SidebarDesktop';
import SidebarMobile from '@/components/SidebarMobile';
import ProjectActionsMenu from '@/components/project/ActionsMenu';
import { prisma } from '@/lib/db';
import type { Route } from 'next';

export const revalidate = 60;

export default async function Notice({
  params,
  searchParams,
}: {
  params: { project_id: string; notice_id: string };
  searchParams: Record<string, string>;
}) {
  const notice = await prisma.notice.findFirst({
    where: { id: params.notice_id },
    include: {
      project: true,
    },
  });
  if (!notice) {
    throw new Error('Notice not found');
  }
  const occurrences = await prisma.occurrence.findMany({
    where: { notice_id: notice.id },
    orderBy: { updated_at: 'desc' },
    take: 100,
  });

  const search = searchParams.q;

  const breadcrumbs = [
    {
      name: `${notice.project.organization.toLowerCase()} / ${notice.project.name.toLowerCase()}`,
      href: `/projects/${notice.project.id}` as Route,
      current: false,
    },
    { name: notice.kind, href: `/notices/${notice.id}` as Route, current: true },
  ];

  return (
    <>
      <div>
        <SidebarMobile>
          {/* @ts-expect-error Server Component */}
          <SidebarDesktop selectedProject={notice.project} />
        </SidebarMobile>

        <div className="hidden xl:fixed xl:inset-y-0 xl:z-50 xl:flex xl:w-72 xl:flex-col">
          {/* @ts-expect-error Server Component */}
          <SidebarDesktop selectedProject={notice.project} />
        </div>

        <main className="xl:pl-72">
          <div className="sticky top-0 z-40 bg-airbroke-900">
            <nav className="border-b border-white border-opacity-10 bg-gradient-to-r from-airbroke-800 to-airbroke-900">
              <div className="flex justify-between pr-4 sm:pr-6 lg:pr-6">
                <Breadcrumbs breadcrumbs={breadcrumbs} />
                <ProjectActionsMenu project={notice.project} />
              </div>
            </nav>

            <div className="flex h-16 shrink-0 items-center gap-x-6 border-b border-white/5  px-4 shadow-sm sm:px-6 lg:px-8">
              <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                <Search currentSearchTerm={search} />
              </div>
            </div>
          </div>

          {occurrences.length === 0 ? (
            <NoData project={notice.project} />
          ) : (
            <OccurrencesTable notice={notice} project={notice.project} occurrences={occurrences} />
          )}
        </main>
      </div>
    </>
  );
}
