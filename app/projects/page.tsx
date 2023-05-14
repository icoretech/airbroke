import ProjectsTable from '@/components/ProjectsTable';
import Search from '@/components/Search';
import SidebarDesktop from '@/components/SidebarDesktop';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';

export default async function Projects({ searchParams }: { searchParams: Record<string, string> }) {
  const search = searchParams.q;

  const totalProjects = await prisma.project.count();

  if (totalProjects === 0) {
    redirect('/projects/new');
  }

  const whereObject: any = {
    ...(search && { name: { contains: search, mode: 'insensitive' } }),
  };
  const projects = await prisma.project.findMany({
    where: whereObject,
    orderBy: { name: 'asc' },
  });

  return (
    <>
      {/* @ts-expect-error Server Component */}
      <SidebarDesktop />

      <main className="xl:pl-72">
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-6 border-b border-white/5 bg-airbroke-900 px-4 shadow-sm sm:px-6 lg:px-8">
          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <Search currentSearchTerm={search} />
          </div>
        </div>

        <ProjectsTable projects={projects} />
      </main>
    </>
  );
}
