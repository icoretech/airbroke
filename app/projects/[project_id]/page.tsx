// app/projects/[project_id]/page.tsx

import { DashboardShell } from '@/components/DashboardShell';
import NoticesTable from '@/components/NoticesTable';
import { getNoticeEnvs } from '@/lib/queries/notices';
import { getProjectById } from '@/lib/queries/projects';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Filter from './Filter';
import Sort from './Sort';

type ComponentProps = {
  params: Promise<{ project_id: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

export async function generateMetadata(props: ComponentProps) {
  const projectId = (await props.params).project_id;
  const project = await getProjectById(projectId);
  return { title: project?.name };
}

// /projects/:project_id
export default async function ProjectNotices(props: ComponentProps) {
  const [cookieStore, resolvedSearchParams, resolvedParams] = await Promise.all([
    cookies(),
    props.searchParams,
    props.params,
  ]);
  const initialSidebarOpen = cookieStore.get('sidebarOpen')?.value === 'true';

  const project = await getProjectById(resolvedParams.project_id);
  if (!project) {
    notFound();
  }

  const uniqueEnvArray = await getNoticeEnvs(project.id);

  return (
    <DashboardShell initialSidebarOpen={initialSidebarOpen} selectedProjectId={project.id}>
      <header className="border-b border-white/5 bg-gradient-to-r from-airbroke-800 to-airbroke-900 px-4 py-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="min-w-0 flex-1">
          <h1 className="text-lg font-bold leading-6 text-indigo-400">
            {project.organization} / {project.name}
          </h1>
          <p className="mt-1 text-sm text-indigo-200">API Key: {project.api_key}</p>
        </div>

        <div className="mt-4 flex sm:ml-4 sm:mt-0">
          <Link
            href={`/projects/${project.id}/edit`}
            className="inline-flex items-center gap-x-2 rounded-md bg-indigo-400/10 px-3 py-2 text-sm font-semibold text-indigo-400 shadow-sm ring-1 ring-indigo-400/30 transition-colors duration-200 hover:bg-indigo-500 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            Edit Project
          </Link>
        </div>
      </header>

      <div className="border-b border-white/5 bg-airbroke-900 px-4 py-2 sm:px-6 lg:px-8">
        <div className="flex items-center justify-end space-x-6">
          <Filter environments={uniqueEnvArray} />
          <Sort />
        </div>
      </div>

      <NoticesTable searchParams={resolvedSearchParams} projectId={project.id} />
    </DashboardShell>
  );
}
