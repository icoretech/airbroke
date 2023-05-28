'use client';

import { sendAirbrakeNodeException } from '@/app/_actions';
import { Notifier as AirbrakeJsNotifier } from '@airbrake/browser';
import { Project } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { SlCheck, SlDisc, SlEnergy } from 'react-icons/sl';

export default function NoData({ project, showHeader = true }: { project: Project; showHeader?: boolean }) {
  const [isPending, startTransition] = useTransition();
  const { refresh } = useRouter();

  const sendAirbrakeJsException = async () => {
    const airbrake = new AirbrakeJsNotifier({
      projectId: 1,
      projectKey: project.api_key,
      environment: 'test',
      host: window.location.origin,
      remoteConfig: false,
      performanceStats: false,
      queryStats: false,
    });

    await airbrake.notify(new Error('[AirbrakeJs] This is a test exception from Airbroke'));
    refresh();
  };

  return (
    <div className="text-center text-gray-400">
      {showHeader && (
        <div className="mt-10">
          <SlCheck className="mx-auto h-12 w-12" aria-hidden="true" />
          <h3 className="my-5 text-sm font-semibold">No exceptions recorded</h3>
        </div>
      )}

      <div className="grid grid-cols-1 justify-items-center gap-4">
        <div className="rounded-lg bg-gray-900 p-6 shadow-lg">
          <h2 className="mb-2 text-lg font-bold text-indigo-500">Airbrake JS</h2>
          <button
            onClick={() => startTransition(() => sendAirbrakeJsException())}
            disabled={isPending}
            className="inline-flex w-full items-center justify-center rounded-md bg-indigo-400/10 px-3 py-2 text-sm font-semibold text-indigo-400 shadow-sm ring-indigo-400/30 transition-colors duration-200 hover:bg-indigo-500 hover:text-indigo-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:text-white"
          >
            {isPending ? (
              <SlDisc className="-ml-0.5 mr-1.5 h-5 w-5 animate-spin" aria-hidden="true" />
            ) : (
              <SlEnergy className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            )}
            <span>{isPending ? 'Sending...' : 'Send a test exception'}</span>
          </button>
        </div>
        <div className="rounded-lg bg-gray-900 p-6 shadow-lg">
          <h2 className="mb-2 text-lg font-bold text-indigo-500">Airbrake Node</h2>
          <button
            onClick={() => startTransition(() => sendAirbrakeNodeException(project.id, window.location.origin))}
            disabled={isPending}
            className="inline-flex w-full items-center justify-center rounded-md bg-indigo-400/10 px-3 py-2 text-sm font-semibold text-indigo-400 shadow-sm ring-indigo-400/30 transition-colors duration-200 hover:bg-indigo-500 hover:text-indigo-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:text-white"
          >
            {isPending ? (
              <SlDisc className="-ml-0.5 mr-1.5 h-5 w-5 animate-spin" aria-hidden="true" />
            ) : (
              <SlEnergy className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            )}
            <span>{isPending ? 'Sending...' : 'Send a test exception'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
