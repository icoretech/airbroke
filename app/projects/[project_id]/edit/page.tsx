// app/projects/[project_id]/edit/page.tsx

import { DashboardShell } from '@/components/DashboardShell';
import IntegrationsGrid from '@/components/IntegrationsGrid';
import EditForm from '@/components/project/EditForm';
import Overview from '@/components/project/Overview';
import { getProjectById } from '@/lib/queries/projects';
import clsx from 'clsx';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MdDataObject, MdDataSaverOff, MdDriveFileRenameOutline } from 'react-icons/md';

import type { ProjectTabs } from '@/types/airbroke';
import type { Route } from 'next';

type ComponentProps = {
  params: Promise<{ project_id: string }>;
  searchParams: Promise<Record<string, string>>;
};

export default async function Project(props: ComponentProps) {
  const cookieStore = await cookies();
  const initialSidebarOpen = cookieStore.get('sidebarOpen')?.value === 'true';

  const searchParams = await props.searchParams;
  const params = await props.params;

  const currentTab = searchParams.tab ?? 'overview';

  const project = await getProjectById(params.project_id);
  if (!project) {
    notFound();
  }

  const replacements = {
    REPLACE_PROJECT_KEY: project.api_key,
  };

  const tabs: ProjectTabs = {
    overview: {
      id: 'overview',
      name: 'Overview',
      current: currentTab === 'overview',
      icon: MdDataSaverOff,
      href: `/projects/${project.id}/edit?tab=overview` as Route,
    },
    integrations: {
      id: 'integrations',
      name: 'Integrations',
      current: currentTab === 'integrations',
      icon: MdDataObject,
      href: `/projects/${project.id}/edit?tab=integrations` as Route,
    },
    edit: {
      id: 'edit',
      name: 'Edit',
      current: currentTab === 'edit',
      icon: MdDriveFileRenameOutline,
      href: `/projects/${project.id}/edit?tab=edit` as Route,
    },
  };

  return (
    <DashboardShell initialSidebarOpen={initialSidebarOpen} selectedProjectId={project.id} searchDisabled={true}>
      <div className="pb-8">
        <div className="px-4 pb-4 sm:px-6 lg:px-8">
          <div className="border-b border-white/5">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {Object.values(tabs).map((tab) =>
                tab ? (
                  <Link
                    key={tab.id}
                    href={tab.href}
                    className={clsx(
                      tab.current
                        ? 'border-indigo-500 text-indigo-400'
                        : 'border-transparent text-indigo-200 hover:border-indigo-500 hover:text-indigo-400',
                      'group inline-flex items-center border-b-2 px-1 py-4 text-sm font-medium'
                    )}
                    aria-current={tab.current ? 'page' : undefined}
                  >
                    <tab.icon
                      className={clsx(
                        tab.current ? 'text-indigo-400' : 'text-indigo-200 group-hover:text-indigo-400',
                        '-ml-0.5 mr-2 h-5 w-5'
                      )}
                      aria-hidden="true"
                    />
                    <span className="hidden md:block">{tab.name}</span>
                  </Link>
                ) : null
              )}
            </nav>
          </div>
        </div>

        {currentTab === 'overview' && <Overview project={project} />}
        {currentTab === 'integrations' && (
          <div className="px-4 py-6 text-white sm:px-6 lg:px-8">
            <IntegrationsGrid replacements={replacements} />
          </div>
        )}
        {currentTab === 'edit' && <EditForm project={project} />}
      </div>
    </DashboardShell>
  );
}
