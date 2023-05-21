import NoData from '@/components/NoData';
import OccurrencesTable from '@/components/OccurrencesTable';
import ProjectHeader from '@/components/ProjectHeader';
import Search from '@/components/Search';
import SidebarDesktop from '@/components/SidebarDesktop';
import SidebarMobile from '@/components/SidebarMobile';
import { prisma } from '@/lib/db';

export const revalidate = 60;

export default async function Notice({
  params,
  searchParams,
}: {
  params: { project_id: string; notice_id: string };
  searchParams: Record<string, string>;
}) {
  const project = await prisma.project.findFirst({ where: { id: BigInt(params.project_id) } });
  if (!project) {
    throw new Error('Project not found');
  }
  const notice = await prisma.notice.findFirst({
    where: { project_id: project.id, id: BigInt(params.notice_id) },
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
              </div>
            </div>
          </div>

          {occurrences.length === 0 ? (
            <NoData project={project} />
          ) : (
            <OccurrencesTable notice={notice} project={project} occurrences={occurrences} />
          )}
        </main>
      </div>
    </>
  );
}
