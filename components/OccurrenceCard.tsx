'use client';

import { Prisma, notice, occurrence, project } from '@prisma/client';
import { Flex, List, ListItem, Tab, TabList, Text, Title } from '@tremor/react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { FaRegAddressBook } from 'react-icons/fa';
import { HiCubeTransparent } from 'react-icons/hi';
import { MdOutlineWebhook } from 'react-icons/md';
import { SiCodefactor } from 'react-icons/si';
import { TbCubeUnfolded } from 'react-icons/tb';
import LinkedBacktraceLine from './LinkedBacktraceLine';

interface BacktraceItem {
  file: string;
  line: number;
  function: string;
}
interface KeyValuePair {
  key: string;
  value: any;
}
const TAB_INDEX_MAP = {
  backtrace: 0,
  context: 1,
  environment: 2,
  session: 3,
  params: 4,
} as const;
export default function OccurrenceCard({
  project,
  notice,
  occurrence,
}: {
  project: project;
  notice: notice;
  occurrence: occurrence;
}) {
  const [selectedTab, setSelectedTab] = useState<keyof typeof TAB_INDEX_MAP>('backtrace' as const);
  const { replace } = useRouter();
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    const tabParam = searchParams.get('tab');

    if (tabParam && tabParam in TAB_INDEX_MAP) {
      setSelectedTab(tabParam as keyof typeof TAB_INDEX_MAP);
    } else {
      setSelectedTab('backtrace'); // Set a default tab if no tab is specified
    }
  }, [searchParams]);

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

  const setUrlForTab = (tab: string) => {
    setSelectedTab(tab as keyof typeof TAB_INDEX_MAP);
    const params = new URLSearchParams(searchParams.toString());

    if (tab) {
      params.set('tab', tab);
    } else {
      params.delete('tab');
    }

    startTransition(() => replace(`${pathname}?${params.toString()}`));
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <TabList value={selectedTab} onValueChange={setUrlForTab} className="mt-6">
        <Tab value="backtrace" text="Backtrace" icon={SiCodefactor} />
        <Tab value="context" text="Context" icon={HiCubeTransparent} />
        <Tab value="environment" text="Environment" icon={TbCubeUnfolded} />
        <Tab value="session" text="Session" icon={FaRegAddressBook} />
        <Tab value="params" text="Params" icon={MdOutlineWebhook} />
      </TabList>

      {selectedTab === 'backtrace' &&
        occurrence.backtrace &&
        typeof occurrence.backtrace === 'object' &&
        Array.isArray(occurrence.backtrace) && (
          <div className="mt-6">
            {(occurrence.backtrace as Prisma.JsonArray).map(
              (trace, index) =>
                isBacktraceItem(trace) && (
                  <Flex
                    key={index}
                    flexDirection="row"
                    justifyContent="start"
                    alignItems="start"
                    className="flex-wrap font-mono text-xs"
                  >
                    <Text
                      className={`text-xs text-slate-600 ${trace.file.includes('PROJECT_ROOT') ? 'font-semibold' : ''}`}
                    >
                      <LinkedBacktraceLine file={trace.file} line={trace.line} project={project} />
                    </Text>
                    <Text className="mx-1">:</Text>
                    <Text className="text-xs font-semibold text-fuchsia-800">{trace.line}</Text>
                    <Text className="mx-1">→</Text>
                    <Text className="text-xs font-semibold text-red-600">{trace.function}</Text>
                  </Flex>
                )
            )}
          </div>
        )}

      {selectedTab === 'context' && (
        <div className="mt-6">
          {isObjectWithKeys(occurrence.context) && (
            <List>
              {objectToArray(occurrence.context).map((item: KeyValuePair) => (
                <ListItem key={item.key}>
                  <span className="font-semibold">{item.key}:</span>
                  <span>{JSON.stringify(item.value)}</span>
                </ListItem>
              ))}
            </List>
          )}
        </div>
      )}

      {selectedTab === 'environment' && (
        <div className="mt-5">
          <Title>{JSON.stringify(occurrence.environment)}</Title>
        </div>
      )}
      {selectedTab === 'session' && (
        <div className="mt-5">
          <Title>{JSON.stringify(occurrence.session)}</Title>
        </div>
      )}
      {selectedTab === 'params' && (
        <div className="mt-5">
          <Title>{JSON.stringify(occurrence.params)}</Title>
        </div>
      )}
    </div>
  );
}
