// components/TestZone.tsx

'use client';

import { sendAirbrakeNodeException } from '@/app/_actions';
import { Notifier as AirbrakeJsNotifier } from '@airbrake/browser';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { SlDisc, SlEnergy } from 'react-icons/sl';

import type { Project } from '@prisma/client';

export default function TestZone({ project }: { project: Project }) {
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
    startTransition(() => refresh());
  };

  const sendAirbrakeNode = () => {
    startTransition(() => {
      sendAirbrakeNodeException(project.id, project.api_key, window.location.origin);
    });
  };

  return (
    <div className="space-y-5 text-gray-300">
      <h2 className="text-base font-bold text-indigo-200">Test Zone</h2>
      <p className="text-sm text-gray-400">
        Send sample errors to confirm your project is receiving exceptions properly.
      </p>

      {/* Airbrake JavaScript Test */}
      <div className="flex items-center justify-between rounded-md bg-gray-800 p-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-200">Airbrake: JavaScript</h3>
          <p className="text-xs text-gray-400">Simulate a client-side error in the “test” environment.</p>
        </div>
        <button
          onClick={sendAirbrakeJsException}
          disabled={isPending}
          className="ml-4 inline-flex items-center rounded-md bg-indigo-400/10 px-3 py-2 text-sm font-semibold text-indigo-400 hover:bg-indigo-500 hover:text-indigo-50"
        >
          {isPending ? (
            <SlDisc className="mr-1.5 h-5 w-5 animate-spin" aria-hidden="true" />
          ) : (
            <SlEnergy className="mr-1.5 h-5 w-5" aria-hidden="true" />
          )}
          <span>{isPending ? 'Sending...' : 'Test'}</span>
        </button>
      </div>

      {/* Airbrake Node.js Test */}
      <div className="flex items-center justify-between rounded-md bg-gray-800 p-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-200">Airbrake: Node.js</h3>
          <p className="text-xs text-gray-400">Send a Node.js error to confirm server-side exception tracking.</p>
        </div>
        <button
          onClick={sendAirbrakeNode}
          disabled={isPending}
          className="ml-4 inline-flex items-center rounded-md bg-indigo-400/10 px-3 py-2 text-sm font-semibold text-indigo-400 hover:bg-indigo-500 hover:text-indigo-50"
        >
          {isPending ? (
            <SlDisc className="mr-1.5 h-5 w-5 animate-spin" aria-hidden="true" />
          ) : (
            <SlEnergy className="mr-1.5 h-5 w-5" aria-hidden="true" />
          )}
          <span>{isPending ? 'Sending...' : 'Test'}</span>
        </button>
      </div>
    </div>
  );
}
