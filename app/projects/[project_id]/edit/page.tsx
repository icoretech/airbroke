import Breadcrumbs from '@/components/Breadcrumbs';
import CodeTemplate from '@/components/CodeTemplate';
import SidebarDesktop from '@/components/SidebarDesktop';
import SidebarMobile from '@/components/SidebarMobile';
import ProjectActionsMenu from '@/components/project/ActionsMenu';
import Overview from '@/components/project/Overview';
import classNames from '@/lib/classNames';
import { jsclientTemplate, rubyTemplate } from '@/lib/configTemplates';
import { getProjectById } from '@/lib/queries/projects';
import type { Route } from 'next';
import Link from 'next/link';
import { SlSettings, SlWrench } from 'react-icons/sl';

export default async function Project({
  params,
  searchParams,
}: {
  params: { project_id: string };
  searchParams: Record<string, string>;
}) {
  const currentTab = searchParams.tab ?? 'overview';

  const project = await getProjectById(params.project_id);
  if (!project) {
    throw new Error('Project not found');
  }
  const replacements = {
    REPLACE_PROJECT_KEY: project.api_key,
  };

  const tabs = [
    { id: 'overview', name: 'Overview', current: currentTab === 'overview', icon: SlSettings },
    { id: 'integrations', name: 'Integrations', current: currentTab === 'integrations', icon: SlWrench },
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
          <SidebarDesktop selectedProjectId={project.id} />
        </SidebarMobile>

        <div className="hidden xl:fixed xl:inset-y-0 xl:z-50 xl:flex xl:w-72 xl:flex-col">
          <SidebarDesktop selectedProjectId={project.id} />
        </div>

        <main className="xl:pl-72">
          <div className="sticky top-0 z-40 bg-airbroke-900">
            <nav className="border-b border-white border-opacity-10 bg-gradient-to-r from-airbroke-800 to-airbroke-900">
              <div className="flex justify-between pr-4 sm:pr-6 lg:pr-6">
                <Breadcrumbs breadcrumbs={breadcrumbs} />
                <ProjectActionsMenu project={project} />
              </div>
            </nav>
          </div>

          <div className="pb-8">
            <div className="px-4 pb-4 sm:px-6 lg:px-8">
              <div className="sm:hidden">
                <label htmlFor="tabs" className="sr-only">
                  Select a tab
                </label>
                <select
                  name="tabs"
                  className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  defaultValue={currentTab}
                >
                  {tabs.map((tab) => (
                    <option key={tab.name}>{tab.name}</option>
                  ))}
                </select>
              </div>
              <div className="hidden sm:block">
                <div className="border-b border-white/10">
                  <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    {tabs.map((tab) => (
                      <Link
                        key={tab.id}
                        href={tab.href}
                        className={classNames(
                          tab.current
                            ? 'border-indigo-500 text-indigo-400 '
                            : 'border-transparent text-indigo-200 hover:border-indigo-500 hover:text-indigo-400',
                          'group inline-flex items-center border-b-2 px-1 py-4 text-sm font-medium'
                        )}
                        aria-current={tab.current ? 'page' : undefined}
                      >
                        <tab.icon
                          className={classNames(
                            tab.current ? 'text-indigo-400' : 'text-indigo-200 group-hover:text-indigo-400',
                            '-ml-0.5 mr-2 h-5 w-5'
                          )}
                          aria-hidden="true"
                        />
                        <span>{tab.name}</span>
                      </Link>
                    ))}
                  </nav>
                </div>
              </div>
            </div>

            {currentTab === 'overview' && <Overview projectId={project.id} />}
            {currentTab === 'integrations' && (
              <>
                <CodeTemplate code={rubyTemplate} replacements={replacements} name="Ruby / Rails" />
                <CodeTemplate code={jsclientTemplate} replacements={replacements} name="JavaScript (Browser)" />
              </>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
