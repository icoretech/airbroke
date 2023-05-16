import OccurrenceCard from '@/components/OccurrenceCard';
import ProjectHeader from '@/components/ProjectHeader';
import SidebarDesktop from '@/components/SidebarDesktop';
import { prisma } from '@/lib/db';
import { OccurrenceTabKeys } from '@/types/airbroke';

export default async function Occurrence({
  params,
  searchParams,
}: {
  params: { project_id: string; notice_id: string; occurrence_id: string };
  searchParams: Record<string, string>;
}) {
  const tabKeys: OccurrenceTabKeys[] = ['backtrace', 'context', 'environment', 'session', 'params', 'toolbox'];
  const tab = tabKeys.includes(searchParams.tab as OccurrenceTabKeys)
    ? (searchParams.tab as OccurrenceTabKeys)
    : 'backtrace';

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

        <OccurrenceCard notice={notice} occurrence={occurrence} project={project} currentTab={tab} />
      </main>
    </>
  );
}
