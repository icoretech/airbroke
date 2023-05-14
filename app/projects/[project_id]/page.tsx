import ProjectHeader from '@/components/ProjectHeader';
import SidebarDesktop from '@/components/SidebarDesktop';
import { prisma } from '@/lib/db';

export const revalidate = 10;

export default async function Project({ params }: { params: { project_id: string } }) {
  const project = await prisma.project.findFirst({ where: { id: BigInt(params.project_id) } });
  if (!project) {
    throw new Error('Project not found');
  }

  return (
    <>
      {/* @ts-expect-error Server Component */}
      <SidebarDesktop selectedProject={project} />

      <main className="xl:pl-72">
        <div className="sticky top-0 z-40 bg-airbroke-900">
          <ProjectHeader project={project} showAllButtons={true} />
        </div>

        <header className="flex items-center justify-between border-white/5 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
          <h1 className="text-base font-semibold leading-7 text-white">Edit Project</h1>
        </header>

        <p className="px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
          Airbroke provides an Airbrake-compatible API, allowing you to seamlessly use existing clients. The following
          are some suggested configurations for your convenience.
        </p>
      </main>
    </>
  );
}
