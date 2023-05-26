import Breadcrumbs from '@/components/Breadcrumbs';
import OccurrenceCounterLabel from '@/components/CounterLabel';
import EnvironmentLabel from '@/components/EnvironmentLabel';
import OccurrenceChartWrapper from '@/components/OccurrenceChartWrapper';
import SidebarDesktop from '@/components/SidebarDesktop';
import SidebarMobile from '@/components/SidebarMobile';
import Backtrace from '@/components/occurrence/Backtrace';
import Context from '@/components/occurrence/Context';
import Environment from '@/components/occurrence/Environment';
import Params from '@/components/occurrence/Params';
import Session from '@/components/occurrence/Session';
import Toolbox from '@/components/occurrence/Toolbox';
import ProjectActionsMenu from '@/components/project/ActionsMenu';
import classNames from '@/lib/classNames';
import { prisma } from '@/lib/db';
import type { Route } from 'next';
import Link from 'next/link';
import { FaCarCrash } from 'react-icons/fa';
import { SlCompass, SlGlobe, SlGraph, SlLink, SlList, SlUser, SlWrench } from 'react-icons/sl';

type OccurrenceTabKeys = 'backtrace' | 'context' | 'environment' | 'session' | 'params' | 'chart' | 'toolbox';

export default async function Occurrence({
  params,
  searchParams,
}: {
  params: { occurrence_id: string };
  searchParams: Record<string, string>;
}) {
  const tabKeys: OccurrenceTabKeys[] = ['backtrace', 'context', 'environment', 'session', 'params', 'chart', 'toolbox'];
  const currentTab = tabKeys.includes(searchParams.tab as OccurrenceTabKeys)
    ? (searchParams.tab as OccurrenceTabKeys)
    : 'backtrace';

  const occurrenceWithRelations = await prisma.occurrence.findFirst({
    where: {
      id: params.occurrence_id,
    },
    include: {
      notice: {
        include: {
          project: true,
        },
      },
    },
  });

  if (!occurrenceWithRelations) {
    throw new Error('Occurrence not found');
  }

  const { notice, ...occurrence } = occurrenceWithRelations;
  const { project, ...noticeData } = notice;

  const tabs = [
    { id: 'backtrace', name: 'Backtrace', current: currentTab === 'backtrace', icon: SlList },
    { id: 'context', name: 'Context', current: currentTab === 'context', icon: SlCompass },
    { id: 'environment', name: 'Environment', current: currentTab === 'environment', icon: SlGlobe },
    { id: 'session', name: 'Session', current: currentTab === 'session', icon: SlUser },
    { id: 'params', name: 'Params', current: currentTab === 'params', icon: SlLink },
    { id: 'chart', name: 'Chart', current: currentTab === 'chart', icon: SlGraph },
    { id: 'toolbox', name: 'Toolbox', current: currentTab === 'toolbox', icon: SlWrench },
  ].map((tab) => ({
    ...tab,
    href: `/occurrences/${occurrence.id}?tab=${tab.id}` as Route,
  }));

  const breadcrumbs = [
    {
      name: `${project.organization.toLowerCase()} / ${project.name.toLowerCase()}`,
      href: `/projects/${project.id}` as Route,
      current: false,
    },
    { name: notice.kind, href: `/notices/${notice.id}` as Route, current: false },
    {
      name: occurrence.message,
      href: `/occurrences/${occurrence.id}` as Route,
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
          </div>

          <div className="px-4 py-4 sm:px-6 lg:px-8">
            <div className="rounded-md bg-gray-900 p-4 shadow-md">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="flex flex-col items-center">
                    <FaCarCrash className="h-5 w-5 text-indigo-400" aria-hidden="true" />
                    <div className="mt-4">
                      <OccurrenceCounterLabel counter={occurrence.seen_count} />
                    </div>
                  </div>
                </div>
                <div className="ml-3">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-sm font-semibold text-indigo-400">
                      <Link href={`/notices/${notice.id}`}>{notice.kind}</Link>
                    </h3>
                    <EnvironmentLabel env={notice.env} />
                  </div>

                  <div className="mt-2 space-y-1 text-sm text-indigo-200">
                    <p>{occurrence.message}</p>
                    <div className="flex items-center space-x-2 text-xs text-gray-300">
                      <span>First seen: {occurrence.created_at.toUTCString()}</span>
                      <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-gray-300">
                        <circle cx={1} cy={1} r={1} />
                      </svg>
                      <span>Last seen: {occurrence.updated_at.toUTCString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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

            {currentTab === 'backtrace' && <Backtrace occurrence={occurrence} project={project} />}
            {currentTab === 'context' && <Context occurrence={occurrence} />}
            {currentTab === 'environment' && <Environment occurrence={occurrence} />}
            {currentTab === 'session' && <Session occurrence={occurrence} />}
            {currentTab === 'params' && <Params occurrence={occurrence} />}
            {/* @ts-expect-error Server Component */}
            {currentTab === 'chart' && <OccurrenceChartWrapper occurrenceId={occurrence.id} />}
            {currentTab === 'toolbox' && <Toolbox occurrence={occurrence} />}
          </div>
        </main>
      </div>
    </>
  );
}
