import classNames from '@/lib/classNames';
import { BacktraceItem, OccurrenceTabKeys } from '@/types/airbroke';
import { Prisma, notice, occurrence, project } from '@prisma/client';
import Link from 'next/link';
import { FaCarCrash, FaRegAddressBook } from 'react-icons/fa';
import { HiCubeTransparent } from 'react-icons/hi';
import { MdOutlineWebhook } from 'react-icons/md';
import { SiCodefactor } from 'react-icons/si';
import { TbCubeUnfolded } from 'react-icons/tb';
import EnvironmentLabel from './EnvironmentLabel';
import LinkedBacktraceLine from './LinkedBacktraceLine';
interface KeyValuePair {
  key: string;
  value: any;
}

export default function OccurrenceCard({
  project,
  notice,
  occurrence,
  currentTab = 'backtrace',
}: {
  project: project;
  notice: notice;
  occurrence: occurrence;
  currentTab?: OccurrenceTabKeys;
}) {
  function isBacktraceItem(item: any): item is BacktraceItem {
    return item && typeof item.file === 'string' && typeof item.line === 'number' && typeof item.function === 'string';
  }
  function objectToArray(obj: Record<string, any>): KeyValuePair[] {
    return Object.entries(obj).map(([key, value]) => ({ key, value }));
  }
  function isObjectWithKeys(item: any): item is Record<string, any> {
    return (
      item &&
      typeof item === 'object' &&
      !Array.isArray(item) &&
      Object.keys(item).every((key) => typeof key === 'string')
    );
  }

  const tabs = [
    { id: 'backtrace', name: 'Backtrace', current: currentTab === 'backtrace', icon: SiCodefactor },
    { id: 'context', name: 'Context', current: currentTab === 'context', icon: HiCubeTransparent },
    { id: 'environment', name: 'Environment', current: currentTab === 'environment', icon: TbCubeUnfolded },
    { id: 'session', name: 'Session', current: currentTab === 'session', icon: FaRegAddressBook },
    { id: 'params', name: 'Params', current: currentTab === 'params', icon: MdOutlineWebhook },
  ].map((tab) => ({
    ...tab,
    href: `/projects/${project.id}/notices/${notice.id}/occurrences/${occurrence.id}?tab=${tab.id}`,
  }));

  return (
    <div className="pb-8">
      <div className="px-4 py-4 sm:px-6 lg:px-8">
        <div className="sm:hidden">
          <label htmlFor="tabs" className="sr-only">
            Select a tab
          </label>
          <select
            id="tabs"
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
                key={tab.name}
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
          <div className="flex">
            <div className="flex-shrink-0">
              <FaCarCrash className="h-5 w-5 text-indigo-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <div className="flex items-center">
                <h3 className="mr-3 text-sm font-semibold text-indigo-400">
                  <Link href={`/projects/${project.id}/notices/${notice.id}/occurrences`}>{notice.kind}</Link>
                </h3>
                <EnvironmentLabel env={notice.env} />
              </div>
              <div className="mt-2 text-sm text-indigo-200">
                <p>{occurrence.message}</p>
              </div>
            </div>
            <div className="ml-3"></div>
          </div>
        </div>
      </div>

      {currentTab === 'backtrace' &&
        occurrence.backtrace &&
        typeof occurrence.backtrace === 'object' &&
        Array.isArray(occurrence.backtrace) && (
          <div className="px-4 sm:px-6 lg:px-8">
            {(occurrence.backtrace as Prisma.JsonArray).map(
              (trace, index) =>
                isBacktraceItem(trace) && (
                  <div key={index} className="flex flex-row flex-wrap justify-start pb-1 font-mono text-xs">
                    <p
                      className={classNames(
                        trace.file.includes('PROJECT_ROOT') ? 'font-semibold' : '',
                        'text-xs text-gray-400'
                      )}
                    >
                      <LinkedBacktraceLine file={trace.file} line={trace.line} project={project} />
                    </p>
                    <p className="mx-1 text-gray-400">:</p>
                    <p className="text-xs font-semibold text-indigo-400">{trace.line}</p>
                    <p className="mx-1 text-gray-400">→</p>
                    <p className="text-xs font-semibold text-red-600">{trace.function}</p>
                  </div>
                )
            )}
          </div>
        )}

      {currentTab === 'context' && (
        <div className="px-4 sm:px-6 lg:px-8">
          {isObjectWithKeys(occurrence.context) && (
            <ul>
              {objectToArray(occurrence.context).map((item: KeyValuePair) => (
                <li key={item.key}>
                  <span className="font-semibold">{item.key}:</span>
                  <span>{JSON.stringify(item.value)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {currentTab === 'environment' && (
        <div className="px-4 sm:px-6 lg:px-8">
          <h1>{JSON.stringify(occurrence.environment)}</h1>
        </div>
      )}
      {currentTab === 'session' && (
        <div className="px-4 sm:px-6 lg:px-8">
          <h1>{JSON.stringify(occurrence.session)}</h1>
        </div>
      )}
      {currentTab === 'params' && (
        <div className="px-4 sm:px-6 lg:px-8">
          <h1>{JSON.stringify(occurrence.params)}</h1>
        </div>
      )}
    </div>
  );
}
