'use client';

import { Notifier } from '@airbrake/browser';
import { project } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { SlCheck, SlDisc, SlEnergy } from 'react-icons/sl';

export default function NoData({ project }: { project: project }) {
  const [isPending, startTransition] = useTransition();
  const { refresh } = useRouter();
  const [airbrake, setAirbrake] = useState<Notifier | null>(null);

  useEffect(() => {
    setAirbrake(
      new Notifier({
        projectId: 1,
        projectKey: project.api_key,
        environment: 'test',
        host: window.location.origin,
        remoteConfig: false,
        performanceStats: false,
        queryStats: false,
        queueStats: false,
      })
    );
  }, [project.api_key]);

  const sendTestException = async () => {
    if (airbrake) {
      await airbrake.notify(new Error('This is a test exception from Airbroke'));
      startTransition(() => refresh());
    }
  };

  return (
    <div className="mt-10 text-center text-gray-400">
      <SlCheck className="mx-auto h-12 w-12" aria-hidden="true" />

      <h3 className="my-5 text-sm font-semibold">{'No exceptions recorded'}</h3>

      <button
        onClick={sendTestException}
        disabled={isPending}
        className="inline-flex items-center rounded-md bg-indigo-400/10 px-3 py-2 text-sm font-semibold text-indigo-400 shadow-sm ring-indigo-400/30 transition-colors duration-200 hover:bg-indigo-500 hover:text-indigo-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:bg-indigo-400"
      >
        {isPending ? (
          <SlDisc className="-ml-0.5 mr-1.5 h-5 w-5 animate-spin" aria-hidden="true" />
        ) : (
          <SlEnergy className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
        )}

        <span>{isPending ? 'Sending...' : 'Send a test exception'}</span>
      </button>
    </div>
  );
}
