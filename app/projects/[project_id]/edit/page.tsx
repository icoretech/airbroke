import Breadcrumbs from '@/components/Breadcrumbs';
import CodeTemplate from '@/components/CodeTemplate';
import SidebarDesktop from '@/components/SidebarDesktop';
import SidebarMobile from '@/components/SidebarMobile';
import ProjectActionsMenu from '@/components/project/ActionsMenu';
import Overview from '@/components/project/Overview';
import { jsclientTemplate, rubyTemplate } from '@/lib/configTemplates';
import { getProjectById } from '@/lib/queries/projects';
import type { Route } from 'next';
import Link from 'next/link';

export default async function Project({
  params,
  searchParams,
}: {
  params: { project_id: string };
  searchParams: Record<string, string>;
}) {
  const tab = searchParams.tab ?? 'overview';

  const project = await getProjectById(params.project_id);
  if (!project) {
    throw new Error('Project not found');
  }
  const replacements = {
    REPLACE_PROJECT_KEY: project.api_key,
  };

  const tabs = [
    { id: 'overview', name: 'Overview', current: tab === 'overview' },
    { id: 'integrations', name: 'Integrations', current: tab === 'integrations' },
  ].map((tab) => ({
    ...tab,
    href: `/projects/${project.id}/edit?tab=${tab.id}` as Route,
  }));

  const breadcrumbs = [
    {
      name: `${project.organization.toLowerCase()} / ${project.name.toLowerCase()}`,
      href: `/projects/${project.id}` as Route,
      current: false,
    },
    {
      name: tabs.find((tab) => tab.current)?.name || 'Overview',
      href: `/projects/${project.id}/edit` as Route,
      current: true,
    },
  ];

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
            <nav className="border-b border-white border-opacity-10 bg-gradient-to-r from-airbroke-800 to-airbroke-900">
              <div className="flex justify-between pr-4 sm:pr-6 lg:pr-6">
                <Breadcrumbs breadcrumbs={breadcrumbs} />
                <ProjectActionsMenu project={project} />
              </div>
            </nav>
            <nav className="flex overflow-x-auto border-b border-white/10 py-4">
              <ul
                role="list"
                className="flex min-w-full flex-none gap-x-6 px-4 text-sm font-semibold leading-6 text-gray-400 sm:px-6 lg:px-8"
              >
                {tabs.map((item) => (
                  <li key={item.name}>
                    <Link href={item.href} className={item.current ? 'text-indigo-400' : ''}>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="mt-2 block max-w-full overflow-x-auto rounded-md p-4 text-xs">
              {tab === 'overview' && <Overview project={project} />}
              {tab === 'integrations' && (
                <>
                  <CodeTemplate code={rubyTemplate} replacements={replacements} name="Ruby / Rails" />
                  <CodeTemplate code={jsclientTemplate} replacements={replacements} name="JavaScript (Browser)" />
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
