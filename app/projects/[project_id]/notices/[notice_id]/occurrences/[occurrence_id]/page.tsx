import OccurrenceCard from '@/components/OccurrenceCard';
import ProjectHeader from '@/components/ProjectHeader';
import SidebarDesktop from '@/components/SidebarDesktop';
import { prisma } from '@/lib/db';

export default async function Occurrence({
  params,
}: {
  params: { project_id: string; notice_id: string; occurrence_id: string };
}) {
  const occurrenceWithRelations = await prisma.occurrence.findFirst({
    where: {
      id: BigInt(params.occurrence_id),
      notice: {
        id: BigInt(params.notice_id),
        project: {
          id: BigInt(params.project_id),
        },
      },
    },
    include: {
      notice: {
        include: {
          project: true,
        },
      },
    },
  });

  if (!occurrenceWithRelations) {
    throw new Error('Occurrence not found');
  }

  const { notice, ...occurrence } = occurrenceWithRelations;
  const { project, ...noticeData } = notice;
  return (
    <>
      {/* @ts-expect-error Server Component */}
      <SidebarDesktop selectedProject={project} />

      <main className="xl:pl-72">
        <div className="sticky top-0 z-40 bg-airbroke-900">
          <ProjectHeader project={project} />
        </div>

        <header className="flex items-center justify-between border-b border-white/5 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
          <div className="-ml-2 -mt-2 flex flex-wrap items-baseline">
            <h1 className="ml-2 mt-2 text-base font-semibold leading-7 text-gray-400">{notice.kind}</h1>
            <p className="ml-2 mt-1 truncate text-sm text-white">Occurrence#{occurrence.id.toString()}</p>
          </div>

          {/* Sort dropdown */}
        </header>

        <OccurrenceCard notice={notice} occurrence={occurrence} project={project} />
      </main>
    </>
  );
}
