import ProjectsTable from '@/components/ProjectsTable';
import Search from '@/components/Search';
import { SidebarOpenButton } from '@/components/SidebarButtons';
import SidebarDesktop from '@/components/SidebarDesktop';
import SidebarMobile from '@/components/SidebarMobile';
import prisma from '@/lib/db';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Projects' };
}

// /projects
export default async function Projects(props: { searchParams: Promise<Record<string, string>> }) {
  const searchParams = await props.searchParams;
  const searchQuery = searchParams.searchQuery;

  const totalProjects = await prisma.project.count();

  if (totalProjects === 0) {
    redirect('/projects/new');
  }

  return (
    <div>
      <SidebarMobile>
        <SidebarDesktop />
      </SidebarMobile>

      <div className="hidden xl:fixed xl:inset-y-0 xl:z-50 xl:flex xl:w-72 xl:flex-col">
        <SidebarDesktop />
      </div>

      <main className="xl:pl-72">
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-6 border-b border-white/5 bg-airbroke-900 px-4 shadow-sm sm:px-6 lg:px-8">
          <SidebarOpenButton />
          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <Search />
          </div>
        </div>

        <ProjectsTable currentSearchTerm={searchQuery} />
      </main>
    </div>
  );
}
