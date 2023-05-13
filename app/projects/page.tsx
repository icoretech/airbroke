import ProjectsTable from '@/components/ProjectsTable';
import SidebarDesktop from '@/components/SidebarDesktop';
import { prisma } from '@/lib/db';
import { SlMagnifier } from 'react-icons/sl';

export default async function Projects({ searchParams }: { searchParams: Record<string, string> }) {
  const sort = searchParams.s === 'desc' ? 'desc' : 'asc';

  const projects = await prisma.project.findMany({
    orderBy: {
      name: sort,
    },
  });

  return (
    <>
      {/* @ts-expect-error Server Component */}
      <SidebarDesktop />

      <main className="scrollbar-none xl:pl-72">
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-6 border-b border-white/5 bg-airbroke-900 px-4 shadow-sm sm:px-6 lg:px-8">
          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <form className="flex flex-1" action="#" method="GET">
              <label htmlFor="search-field" className="sr-only">
                Search Project
              </label>
              <div className="relative w-full">
                <SlMagnifier
                  className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-500"
                  aria-hidden="true"
                />
                <input
                  id="search-field"
                  className="block h-full w-full border-0 bg-transparent py-0 pl-8 pr-0 text-white focus:ring-0 sm:text-sm"
                  placeholder="Search Project..."
                  type="search"
                  name="search"
                />
              </div>
            </form>
          </div>
        </div>

        <header className="flex items-center justify-between border-b border-white/5 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
          <h1 className="text-base font-semibold leading-7 text-white">Projects</h1>
        </header>

        <ProjectsTable projects={projects} currentSort={sort} />
      </main>
    </>
  );
}
