// app/occurrences/[occurrence_id]/page.tsx

import CounterLabel from '@/components/CounterLabel';
import { DashboardShell } from '@/components/DashboardShell';
import EnvironmentLabel from '@/components/EnvironmentLabel';
import Backtrace from '@/components/occurrence/Backtrace';
import BookmarkButton from '@/components/occurrence/BookmarkButton';
import Context from '@/components/occurrence/Context';
import Environment from '@/components/occurrence/Environment';
import Params from '@/components/occurrence/Params';
import ResolveButton from '@/components/occurrence/ResolveButton';
import Session from '@/components/occurrence/Session';
import Toolbox from '@/components/occurrence/Toolbox';
import OccurrenceChartWrapper from '@/components/OccurrenceChartWrapper';
import { auth } from '@/lib/auth';
import { checkOccurrenceBookmarkExistence } from '@/lib/queries/occurrenceBookmarks';
import { getOccurrenceById } from '@/lib/queries/occurrences';
import clsx from 'clsx';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BiSolidNetworkChart } from 'react-icons/bi';
import { CgToolbox } from 'react-icons/cg';
import { FaEnvira, FaLink } from 'react-icons/fa6';
import { LuListEnd } from 'react-icons/lu';
import { MdAccountCircle } from 'react-icons/md';
import { SlGraph } from 'react-icons/sl';

import type { OccurrenceTabKeys, OccurrenceTabs } from '@/types/airbroke';
import type { Route } from 'next';

type ComponentProps = {
  params: Promise<{ occurrence_id: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

export async function generateMetadata(props: ComponentProps) {
  const params = await props.params;
  const occurrence = await getOccurrenceById(params.occurrence_id);
  return { title: occurrence?.message };
}

// /occurrences/:occurrence_id
export default async function Occurrence(props: ComponentProps) {
  const [cookieStore, resolvedSearchParams, resolvedParams, session] = await Promise.all([
    cookies(),
    props.searchParams,
    props.params,
    auth(),
  ]);
  const initialSidebarOpen = cookieStore.get('sidebarOpen')?.value === 'true';

  const occurrence = await getOccurrenceById(resolvedParams.occurrence_id);
  if (!occurrence) {
    notFound();
  }

  const userId = session?.user?.id;
  const isBookmarked = await checkOccurrenceBookmarkExistence(userId, occurrence.id);
  const hasSession = occurrence.session && Object.keys(occurrence.session).length > 0;
  const hasParams = occurrence.params && Object.keys(occurrence.params).length > 0;
  const hasEnvironment = occurrence.environment && Object.keys(occurrence.environment).length > 0;

  const tabKeys: OccurrenceTabKeys[] = ['backtrace', 'context', 'environment', 'session', 'params', 'chart', 'toolbox'];

  const currentTab: OccurrenceTabKeys = tabKeys.includes(resolvedSearchParams.tab as OccurrenceTabKeys)
    ? (resolvedSearchParams.tab as OccurrenceTabKeys)
    : 'backtrace';

  const tabs: OccurrenceTabs = {
    backtrace: {
      id: 'backtrace',
      name: 'Backtrace',
      current: currentTab === 'backtrace',
      icon: LuListEnd,
      href: `/occurrences/${occurrence.id}?tab=backtrace` as Route,
    },
    context: {
      id: 'context',
      name: 'Context',
      current: currentTab === 'context',
      icon: BiSolidNetworkChart,
      href: `/occurrences/${occurrence.id}?tab=context` as Route,
    },
    environment: hasEnvironment
      ? {
          id: 'environment',
          name: 'Environment',
          current: currentTab === 'environment',
          icon: FaEnvira,
          href: `/occurrences/${occurrence.id}?tab=environment` as Route,
        }
      : undefined,
    session: hasSession
      ? {
          id: 'session',
          name: 'Session',
          current: currentTab === 'session',
          icon: MdAccountCircle,
          href: `/occurrences/${occurrence.id}?tab=session` as Route,
        }
      : undefined,
    params: hasParams
      ? {
          id: 'params',
          name: 'Params',
          current: currentTab === 'params',
          icon: FaLink,
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
      icon: CgToolbox,
      href: `/occurrences/${occurrence.id}?tab=toolbox` as Route,
    },
  };

  return (
    <DashboardShell
      initialSidebarOpen={initialSidebarOpen}
      selectedProjectId={occurrence.notice.project.id}
      searchDisabled={true}
    >
      <header className="border-b border-white/5 bg-gradient-to-r from-airbroke-800 to-airbroke-900 px-4 py-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="min-w-0 flex-1">
          <h1 className="text-lg font-bold leading-6 text-indigo-400">
            <Link href={`/projects/${occurrence.notice.project.id}`}>
              {occurrence.notice.project.organization} / {occurrence.notice.project.name}
            </Link>
          </h1>
          <p className="mt-1 text-sm text-indigo-200">
            <Link href={`/notices/${occurrence.notice_id}`}>{occurrence.notice.kind}</Link>
          </p>
          <p className="mt-1 text-sm text-indigo-200">{occurrence.message}</p>
        </div>

        <div className="mt-4 flex sm:ml-4 sm:mt-0">
          <Link
            href={`/projects/${occurrence.notice.project.id}/edit`}
            className="inline-flex items-center gap-x-2 rounded-md bg-indigo-400/10 px-3 py-2 text-sm font-semibold text-indigo-400 shadow-sm ring-1 ring-indigo-400/30 transition-colors duration-200 hover:bg-indigo-500 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            Edit Project
          </Link>
        </div>
      </header>

      <div className="border-b border-white/5 bg-gradient-to-r from-airbroke-800 to-airbroke-900 p-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-y-3 sm:flex-nowrap">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <CounterLabel counter={occurrence.seen_count} />
            <div className="text-xs text-gray-300">
              <p>First seen: {occurrence.created_at.toUTCString()}</p>
              <p>Last seen: {occurrence.updated_at.toUTCString()}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <BookmarkButton isBookmarked={isBookmarked} occurrenceId={occurrence.id} />
            <ResolveButton occurrenceId={occurrence.id} resolvedAt={occurrence.resolved_at} />
            <EnvironmentLabel env={occurrence.notice.env} className="flex-none" />
          </div>
        </div>
      </div>

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

        {currentTab === 'backtrace' && <Backtrace occurrenceId={occurrence.id} />}
        {currentTab === 'context' && <Context occurrence={occurrence} />}
        {currentTab === 'environment' && <Environment occurrence={occurrence} />}
        {currentTab === 'session' && <Session occurrenceId={occurrence.id} />}
        {currentTab === 'params' && <Params occurrence={occurrence} />}
        {currentTab === 'chart' && <OccurrenceChartWrapper occurrenceId={occurrence.id} />}
        {currentTab === 'toolbox' && <Toolbox occurrenceId={occurrence.id} />}
      </div>
    </DashboardShell>
  );
}
