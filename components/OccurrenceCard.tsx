import { BacktraceItem, OccurrenceTabKeys } from '@/types/airbroke';
import { Prisma, notice, occurrence, project } from '@prisma/client';
import Link from 'next/link';
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
    { id: 'backtrace', name: 'Backtrace', current: currentTab === 'backtrace' },
    { id: 'context', name: 'Context', current: currentTab === 'context' },
    { id: 'environment', name: 'Environment', current: currentTab === 'environment' },
    { id: 'session', name: 'Session', current: currentTab === 'session' },
    { id: 'params', name: 'Params', current: currentTab === 'params' },
  ].map((tab) => ({
    ...tab,
    href: `/projects/${project.id}/notices/${notice.id}/occurrences/${occurrence.id}?tab=${tab.id}`,
  }));

  return (
    <div className="px-4 sm:px-6 lg:px-8">
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

      {/* <TabList value={selectedTab} onValueChange={setUrlForTab} className="mt-6">
        <Tab value="backtrace" text="Backtrace" icon={SiCodefactor} />
        <Tab value="context" text="Context" icon={HiCubeTransparent} />
        <Tab value="environment" text="Environment" icon={TbCubeUnfolded} />
        <Tab value="session" text="Session" icon={FaRegAddressBook} />
        <Tab value="params" text="Params" icon={MdOutlineWebhook} />
      </TabList> */}

      {currentTab === 'backtrace' &&
        occurrence.backtrace &&
        typeof occurrence.backtrace === 'object' &&
        Array.isArray(occurrence.backtrace) && (
          <div className="mt-6">
            {(occurrence.backtrace as Prisma.JsonArray).map(
              (trace, index) =>
                isBacktraceItem(trace) && (
                  <div key={index} className="flex  flex-row flex-wrap justify-start font-mono text-xs">
                    <p
                      className={`text-xs text-slate-600 ${trace.file.includes('PROJECT_ROOT') ? 'font-semibold' : ''}`}
                    >
                      <LinkedBacktraceLine file={trace.file} line={trace.line} project={project} />
                    </p>
                    <p className="mx-1">:</p>
                    <p className="text-xs font-semibold text-fuchsia-800">{trace.line}</p>
                    <p className="mx-1">→</p>
                    <p className="text-xs font-semibold text-red-600">{trace.function}</p>
                  </div>
                )
            )}
          </div>
        )}

      {currentTab === 'context' && (
        <div className="mt-6">
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
        <div className="mt-5">
          <h1>{JSON.stringify(occurrence.environment)}</h1>
        </div>
      )}
      {currentTab === 'session' && (
        <div className="mt-5">
          <h1>{JSON.stringify(occurrence.session)}</h1>
        </div>
      )}
      {currentTab === 'params' && (
        <div className="mt-5">
          <h1>{JSON.stringify(occurrence.params)}</h1>
        </div>
      )}
    </div>
  );
}
