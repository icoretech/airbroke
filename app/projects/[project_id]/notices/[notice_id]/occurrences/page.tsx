import OccurrencesTable from '@/components/OccurrencesTable';
import ProjectHeader from '@/components/ProjectHeader';
import SidebarDesktop from '@/components/SidebarDesktop';
import { prisma } from '@/lib/db';

export const revalidate = 60;

export default async function Notice({ params }: { params: { project_id: string; notice_id: string } }) {
  const project = await prisma.project.findFirst({ where: { id: BigInt(params.project_id) } });
  if (!project) {
    throw new Error('Project not found');
  }
  const notice = await prisma.notice.findFirst({
    where: { project_id: BigInt(project.id), id: BigInt(params.notice_id) },
  });
  if (!notice) {
    throw new Error('Notice not found');
  }
  const occurrences = await prisma.occurrence.findMany({
    where: { notice_id: notice.id },
    orderBy: { updated_at: 'desc' },
    take: 100,
  });

  return (
    <>
      {/* @ts-expect-error Server Component */}
      <SidebarDesktop selectedProject={project} />

      <main className="xl:pl-72">
        <div className="sticky top-0 z-40 bg-airbroke-900">
          <ProjectHeader project={project} />
        </div>

        <header className="flex items-center justify-between  border-white/5 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
          <h1 className="text-lg font-extrabold leading-7 text-white">{notice.kind}</h1>

          {/* Sort dropdown */}
        </header>

        <OccurrencesTable notice={notice} project={project} occurrences={occurrences} currentSort="asc" />
      </main>
    </>
  );
}
