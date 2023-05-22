import CodeTemplate from '@/components/CodeTemplate';
import ProjectHeader from '@/components/ProjectHeader';
import SidebarDesktop from '@/components/SidebarDesktop';
import SidebarMobile from '@/components/SidebarMobile';
import Overview from '@/components/project/Overview';
import { jsclientTemplate, rubyTemplate } from '@/lib/configTemplates';
import { prisma } from '@/lib/db';
import Link from 'next/link';

export default async function Project({
  params,
  searchParams,
}: {
  params: { project_id: string };
  searchParams: Record<string, string>;
}) {
  const tab = searchParams.tab ?? 'overview';

  const project = await prisma.project.findFirst({ where: { id: BigInt(params.project_id) } });
  if (!project) {
    throw new Error('Project not found');
  }
  const replacements = {
    REPLACE_PROJECT_KEY: project.api_key,
  };

  const tabs = [
    { id: 'overview', name: 'Overview', current: tab === 'overview' },
    { id: 'integrations', name: 'Integrations', current: tab === 'integrations' },
    { id: 'settings', name: 'Settings', current: tab === 'settings' },
    { id: 'collaborators', name: 'Collaborators', current: false },
    { id: 'notifications', name: 'Notifications', current: false },
  ].map((tab) => ({
    ...tab,
    href: `/projects/${project.id}?tab=${tab.id}`,
  }));

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
            <ProjectHeader project={project} showAllButtons={true} />

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
