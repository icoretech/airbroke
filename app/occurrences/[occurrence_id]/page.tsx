import Breadcrumbs from '@/components/Breadcrumbs';
import OccurrenceCounterLabel from '@/components/CounterLabel';
import EnvironmentLabel from '@/components/EnvironmentLabel';
import OccurrenceChartWrapper from '@/components/OccurrenceChartWrapper';
import SidebarDesktop from '@/components/SidebarDesktop';
import SidebarMobile from '@/components/SidebarMobile';
import Backtrace from '@/components/occurrence/Backtrace';
import BookmarkButton from '@/components/occurrence/BookmarkButton';
import Context from '@/components/occurrence/Context';
import Environment from '@/components/occurrence/Environment';
import Params from '@/components/occurrence/Params';
import ResolveButton from '@/components/occurrence/ResolveButton';
import Session from '@/components/occurrence/Session';
import Toolbox from '@/components/occurrence/Toolbox';
import ProjectActionsMenu from '@/components/project/ActionsMenu';
import { authOptions } from '@/lib/auth';
import classNames from '@/lib/classNames';
import { checkOccurrenceBookmarkExistence } from '@/lib/queries/occurrenceBookmarks';
import { getOccurrenceById } from '@/lib/queries/occurrences';
import type { OccurrenceTabKeys, OccurrenceTabs } from '@/types/airbroke';
import type { Metadata, Route } from 'next';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { FaCarCrash } from 'react-icons-ng/fa';
import { SlCompass, SlGlobe, SlGraph, SlLink, SlList, SlUser, SlWrench } from 'react-icons-ng/sl';

export const revalidate = 0;

type ComponentProps = {
  params: { occurrence_id: string };
  searchParams: { [key: string]: string | undefined };
};

export async function generateMetadata({ params }: ComponentProps): Promise<Metadata> {
  const occurrence = await getOccurrenceById(params.occurrence_id);
  return { title: occurrence?.message };
}

export default async function Occurrence({ params, searchParams }: ComponentProps) {
  const occurrence = await getOccurrenceById(params.occurrence_id);
  if (!occurrence) {
    throw new Error('Occurrence not found');
  }
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const isBookmarked = await checkOccurrenceBookmarkExistence(userId, occurrence.id);
  const hasSession = occurrence.session && Object.keys(occurrence.session).length > 0;
  const hasParams = occurrence.params && Object.keys(occurrence.params).length > 0;
  const hasEnvironment = occurrence.environment && Object.keys(occurrence.environment).length > 0;
  const tabKeys: OccurrenceTabKeys[] = ['backtrace', 'context', 'environment', 'session', 'params', 'chart', 'toolbox'];

  const currentTab: OccurrenceTabKeys = tabKeys.includes(searchParams.tab as OccurrenceTabKeys)
    ? (searchParams.tab as OccurrenceTabKeys)
    : 'backtrace';

  const tabs: OccurrenceTabs = {
    backtrace: {
      id: 'backtrace',
      name: 'Backtrace',
      current: currentTab === 'backtrace',
      icon: SlList,
      href: `/occurrences/${occurrence.id}?tab=backtrace` as Route,
    },
    context: {
      id: 'context',
      name: 'Context',
      current: currentTab === 'context',
      icon: SlCompass,
      href: `/occurrences/${occurrence.id}?tab=context` as Route,
    },
    environment: hasEnvironment
      ? {
          id: 'environment',
          name: 'Environment',
          current: currentTab === 'environment',
          icon: SlGlobe,
          href: `/occurrences/${occurrence.id}?tab=environment` as Route,
        }
      : undefined,
    session: hasSession
      ? {
          id: 'session',
          name: 'Session',
          current: currentTab === 'session',
          icon: SlUser,
          href: `/occurrences/${occurrence.id}?tab=session` as Route,
        }
      : undefined,
    params: hasParams
      ? {
          id: 'params',
          name: 'Params',
          current: currentTab === 'params',
          icon: SlLink,
          href: `/occurrences/${occurrence.id}?tab=params` as Route,
        }
      : undefined,
    chart: {
      id: 'chart',
      name: 'Chart',
      current: currentTab === 'chart',
      icon: SlGraph,
      href: `/occurrences/${occurrence.id}?tab=chart` as Route,
    },
    toolbox: {
      id: 'toolbox',
      name: 'Toolbox',
      current: currentTab === 'toolbox',
      icon: SlWrench,
      href: `/occurrences/${occurrence.id}?tab=toolbox` as Route,
    },
  };

  const breadcrumbs = [
    {
      name: `${occurrence.notice.project.organization.toLowerCase()} / ${occurrence.notice.project.name.toLowerCase()}`,
      href: `/projects/${occurrence.notice.project.id}` as Route,
      current: false,
    },
    { name: occurrence.notice.kind, href: `/notices/${occurrence.notice_id}` as Route, current: false },
    {
      name: `${occurrence.message} (${occurrence.id})`,
      href: `/occurrences/${occurrence.id}` as Route,
      current: true,
    },
  ];

  return (
    <>
      <SidebarMobile>
        <SidebarDesktop selectedProjectId={occurrence.notice.project_id} />
      </SidebarMobile>

      <div className="hidden xl:fixed xl:inset-y-0 xl:z-50 xl:flex xl:w-72 xl:flex-col">
        <SidebarDesktop selectedProjectId={occurrence.notice.project_id} />
      </div>

      <main className="xl:pl-72">
        <div className="sticky top-0 z-40 bg-airbroke-900">
          <nav className="border-b border-white border-opacity-10 bg-gradient-to-r from-airbroke-800 to-airbroke-900">
            <div className="flex justify-between pr-4 sm:pr-6 lg:pr-6">
              <Breadcrumbs breadcrumbs={breadcrumbs} />
              <ProjectActionsMenu project={occurrence.notice.project} />
            </div>
          </nav>
        </div>

        <div className="px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-start justify-between space-y-4 rounded-md bg-gray-900 p-4 shadow-md sm:flex-nowrap sm:space-y-0">
            <div className="flex w-full items-center space-x-4 sm:w-auto">
              <FaCarCrash className="h-6 w-6 text-indigo-400" aria-hidden="true" />
              <div>
                <h3 className="text-sm font-semibold text-indigo-400">
                  <Link href={`/notices/${occurrence.notice_id}`}>{occurrence.notice.kind}</Link>
                </h3>
                <p className="max-w-full text-xs text-indigo-200 sm:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl">
                  {occurrence.message}
                </p>
              </div>
            </div>
            <div className="flex w-full flex-wrap items-center justify-between space-y-2 sm:w-auto sm:flex-nowrap sm:justify-start sm:space-x-4 sm:space-y-0">
              <div>
                <OccurrenceCounterLabel counter={occurrence.seen_count} />
              </div>
              <div className="w-full text-xs text-gray-300 sm:w-auto">
                <p>First seen: {occurrence.created_at.toUTCString()}</p>
                <p>Last seen: {occurrence.updated_at.toUTCString()}</p>
              </div>
              <BookmarkButton isBookmarked={isBookmarked} occurrenceId={occurrence.id} />
              <ResolveButton occurrenceId={occurrence.id} resolvedAt={occurrence.resolved_at} />
              <EnvironmentLabel env={occurrence.notice.env} className="self-start sm:self-auto" />
            </div>
          </div>
        </div>

        <div className="pb-8">
          <div className="px-4 pb-4 sm:px-6 lg:px-8">
            <div className="border-b border-white/10">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                {Object.values(tabs).map((tab) =>
                  tab ? (
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
                      <span className="hidden md:block">{tab.name}</span>
                    </Link>
                  ) : null
                )}
              </nav>
            </div>
          </div>

          {currentTab === 'backtrace' && <Backtrace occurrenceId={occurrence.id} />}
          {currentTab === 'context' && <Context occurrenceId={occurrence.id} />}
          {currentTab === 'environment' && <Environment occurrenceId={occurrence.id} />}
          {currentTab === 'session' && <Session occurrenceId={occurrence.id} />}
          {currentTab === 'params' && <Params occurrenceId={occurrence.id} />}
          {currentTab === 'chart' && <OccurrenceChartWrapper occurrenceId={occurrence.id} />}
          {currentTab === 'toolbox' && <Toolbox occurrenceId={occurrence.id} />}
        </div>
      </main>
    </>
  );
}
