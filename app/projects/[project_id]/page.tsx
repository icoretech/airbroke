import Breadcrumbs from '@/components/Breadcrumbs';
import NoticesTable from '@/components/NoticesTable';
import Search from '@/components/Search';
import SidebarDesktop from '@/components/SidebarDesktop';
import SidebarMobile from '@/components/SidebarMobile';
import ProjectActionsMenu from '@/components/project/ActionsMenu';
import { getNotices } from '@/lib/queries/notices';
import { getProjectById } from '@/lib/queries/projects';
import type { Route } from 'next';
import { Metadata } from 'next';
import Filter from './Filter';
import Sort from './Sort';

export const revalidate = 0;

type ComponentProps = {
  params: { project_id: string };
  searchParams: { [key: string]: string | undefined };
};

export async function generateMetadata({ params }: ComponentProps): Promise<Metadata> {
  const project = await getProjectById(params.project_id);
  return { title: project?.name };
}

// /projects/:project_id
export default async function ProjectNotices({ params, searchParams }: ComponentProps) {
  const project = await getProjectById(params.project_id);
  if (!project) {
    throw new Error('Project not found');
  }

  const notices = await getNotices(project.id, {});
  const envArray = notices.map((notice) => notice.env);
  const uniqueEnvArray = Array.from(new Set(envArray));

  const breadcrumbs = [
    {
      name: `${project.organization.toLowerCase()} / ${project.name.toLowerCase()}`,
      href: `/projects/${project.id}` as Route,
      current: true,
    },
  ];

  return (
    <div>
      <SidebarMobile>
        <SidebarDesktop selectedProjectId={project.id} />
      </SidebarMobile>

      <div className="hidden xl:fixed xl:inset-y-0 xl:z-50 xl:flex xl:w-72 xl:flex-col">
        <SidebarDesktop selectedProjectId={project.id} />
      </div>

      <main className="xl:pl-72">
        <div className="sticky top-0 z-40  bg-airbroke-900">
          <nav className="border-b border-white border-opacity-10 bg-gradient-to-r from-airbroke-800 to-airbroke-900">
            <div className="flex justify-between pr-4 sm:pr-6 lg:pr-6">
              <Breadcrumbs breadcrumbs={breadcrumbs} />
              <ProjectActionsMenu project={project} />
            </div>
          </nav>

          <div className="flex h-16 shrink-0 items-center gap-x-6 border-b border-white/5 px-4 shadow-sm sm:px-6 lg:px-8">
            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
              <Search />
              <Filter environments={uniqueEnvArray} />
              <Sort />
            </div>
          </div>
        </div>

        <NoticesTable searchParams={searchParams} projectId={project.id} />
      </main>
    </div>
  );
}
