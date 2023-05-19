'use client';

import { useEffect, useState } from 'react';
import { BsRobot } from 'react-icons/bs';
import { SiOpenai } from 'react-icons/si';
import { SlDisc } from 'react-icons/sl';

export default function ToolboxAI({ occurrenceId }: { occurrenceId: bigint }) {
  const [data, setData] = useState('');
  const [isStarted, setIsStarted] = useState(false);

  const startFetching = () => {
    setIsStarted(true);
  };

  useEffect(() => {
    if (!isStarted) {
      return;
    }

    const eventSource = new EventSource(`/api/ai?occurrence=${occurrenceId}`);

    eventSource.onmessage = (event) => {
      const newData = event.data.replace(/\\n/g, '\n').trim();
      setData(newData);
    };

    eventSource.onerror = (event) => {
      console.log('Connection was closed');
      setIsStarted(false);
      eventSource.close();
    };

    return () => {
      setIsStarted(false);
      eventSource.close();
    };
  }, [occurrenceId, isStarted]);

  return (
    <>
      <div className="flex flex-1 flex-col rounded-t-md bg-airbroke-800 p-8 ring-1 ring-white/5">
        <div className="mx-auto h-32 w-32 flex-shrink-0">
          <SiOpenai className="h-32 w-32 text-white" aria-hidden="true" />
        </div>
        <h3 className="my-6 text-sm font-medium text-white">Ask the AI</h3>
        <textarea
          readOnly
          value={data}
          className="h-60 w-full resize-none rounded-lg bg-gray-700 px-4 py-2 text-xs text-white"
        ></textarea>
      </div>
      <div>
        <div className="-mt-px flex divide-x divide-indigo-400/30">
          <div className="flex w-0 flex-1">
            {isStarted ? (
              <div className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-b-lg border border-transparent bg-indigo-400/10 py-4 text-sm font-semibold text-indigo-400 shadow-sm ring-1 ring-indigo-400/30 transition-colors duration-200">
                <div className="flex animate-spin">
                  <SlDisc className="h-5 w-5 text-indigo-400" aria-hidden="true" />
                </div>
              </div>
            ) : (
              <button
                onClick={startFetching}
                className={`relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-b-lg border border-transparent bg-indigo-400/10 py-4 text-sm font-semibold text-indigo-400 shadow-sm ring-1 ring-indigo-400/30 transition-colors duration-200 hover:bg-indigo-500 hover:text-indigo-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 ${
                  isStarted ? 'cursor-not-allowed opacity-50' : 'hover:bg-indigo-500'
                }`}
                disabled={isStarted}
              >
                <BsRobot className="h-5 w-5" aria-hidden="true" />
                Start
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
