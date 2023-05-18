import OccurrenceCounterLabel from '@/components/CounterLabel';
import CustomTimeAgo from '@/components/CustomTimeAgo';
import EnvironmentLabel from '@/components/EnvironmentLabel';
import ProjectHeader from '@/components/ProjectHeader';
import SidebarDesktop from '@/components/SidebarDesktop';
import Backtrace from '@/components/occurrence/Backtrace';
import Context from '@/components/occurrence/Context';
import Environment from '@/components/occurrence/Environment';
import Params from '@/components/occurrence/Params';
import Session from '@/components/occurrence/Session';
import Toolbox from '@/components/occurrence/Toolbox';
import classNames from '@/lib/classNames';
import { prisma } from '@/lib/db';
import { OccurrenceTabKeys } from '@/types/airbroke';
import Link from 'next/link';
import { FaCarCrash, FaRegAddressBook, FaToolbox } from 'react-icons/fa';
import { HiCubeTransparent } from 'react-icons/hi';
import { MdOutlineWebhook } from 'react-icons/md';
import { SiCodefactor } from 'react-icons/si';
import { TbCubeUnfolded } from 'react-icons/tb';

export default async function Occurrence({
  params,
  searchParams,
}: {
  params: { project_id: string; notice_id: string; occurrence_id: string };
  searchParams: Record<string, string>;
}) {
  const tabKeys: OccurrenceTabKeys[] = ['backtrace', 'context', 'environment', 'session', 'params', 'toolbox'];
  const currentTab = tabKeys.includes(searchParams.tab as OccurrenceTabKeys)
    ? (searchParams.tab as OccurrenceTabKeys)
    : 'backtrace';

  const occurrenceWithRelations = await prisma.occurrence.findFirst({
    where: {
      id: BigInt(params.occurrence_id),
      notice: {
        id: BigInt(params.notice_id),
        project: {
          id: BigInt(params.project_id),
        },
      },
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
    { id: 'backtrace', name: 'Backtrace', current: currentTab === 'backtrace', icon: SiCodefactor },
    { id: 'context', name: 'Context', current: currentTab === 'context', icon: HiCubeTransparent },
    { id: 'environment', name: 'Environment', current: currentTab === 'environment', icon: TbCubeUnfolded },
    { id: 'session', name: 'Session', current: currentTab === 'session', icon: FaRegAddressBook },
    { id: 'params', name: 'Params', current: currentTab === 'params', icon: MdOutlineWebhook },
    { id: 'toolbox', name: 'Toolbox', current: currentTab === 'toolbox', icon: FaToolbox },
  ].map((tab) => ({
    ...tab,
    href: `/projects/${project.id}/notices/${notice.id}/occurrences/${occurrence.id}?tab=${tab.id}`,
  }));

  return (
    <>
      {/* @ts-expect-error Server Component */}
      <SidebarDesktop selectedProject={project} />

      <main className="xl:pl-72">
        <div className="sticky top-0 z-40 bg-airbroke-900">
          <ProjectHeader project={project} />
        </div>

        <div className="pb-8">
          <div className="px-4 py-4 sm:px-6 lg:px-8">
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
              <nav className="flex space-x-4" aria-label="Tabs">
                {tabs.map((tab) => (
                  <Link
                    key={tab.id}
                    href={tab.href}
                    className={classNames(
                      tab.current
                        ? 'bg-indigo-500 text-indigo-200 '
                        : 'bg-indigo-400/10 text-indigo-400 hover:bg-indigo-500 hover:text-indigo-200',
                      'inline-flex items-center gap-x-1.5 rounded-md px-3 py-2 text-sm font-medium ring-1 ring-indigo-400/30 transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500'
                    )}
                    aria-current={tab.current ? 'page' : undefined}
                  >
                    <tab.icon className="-ml-0.5 h-5 w-5 text-indigo-400" aria-hidden="true" />
                    {tab.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          <div className="px-4 pb-4 sm:px-6 lg:px-8">
            <div className="rounded-md bg-gray-900 p-4 shadow-md">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="flex flex-col items-center">
                    <FaCarCrash className="h-5 w-5 text-indigo-400" aria-hidden="true" />
                    <div className="mt-2">
                      <OccurrenceCounterLabel counter={occurrence.seen_count} />
                    </div>
                  </div>
                </div>
                <div className="ml-3">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-sm font-semibold text-indigo-400">
                      <Link href={`/projects/${project.id}/notices/${notice.id}/occurrences`}>{notice.kind}</Link>
                    </h3>
                    <EnvironmentLabel env={notice.env} />
                  </div>

                  <div className="mt-2 space-y-1 text-sm text-indigo-200">
                    <p>{occurrence.message}</p>
                    <div className="flex items-center space-x-2 text-xs">
                      <span>First seen:</span>
                      <CustomTimeAgo datetime={occurrence.created_at} locale="en_US" />
                      <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-gray-300">
                        <circle cx={1} cy={1} r={1} />
                      </svg>
                      <span>Last seen:</span>
                      <CustomTimeAgo datetime={occurrence.updated_at} locale="en_US" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {currentTab === 'backtrace' && <Backtrace occurrence={occurrence} project={project} />}
          {currentTab === 'context' && <Context occurrence={occurrence} />}
          {currentTab === 'environment' && <Environment occurrence={occurrence} />}
          {currentTab === 'session' && <Session occurrence={occurrence} />}
          {currentTab === 'params' && <Params occurrence={occurrence} />}
          {currentTab === 'toolbox' && <Toolbox occurrence={occurrence} />}
        </div>
      </main>
    </>
  );
}
