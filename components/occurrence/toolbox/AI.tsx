'use client';

import { useEffect, useRef } from 'react';
import { BsRobot } from 'react-icons-ng/bs';
import { SiOpenai } from 'react-icons-ng/si';

import { useCompletion } from 'ai/react';

export default function ToolboxAI({ occurrenceId }: { occurrenceId: string }) {
  const { complete, completion, stop, isLoading, error } = useCompletion({
    api: `/api/completion?occurrence=${occurrenceId}`,
  });
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
  }, [completion, error]);

  const handleRequest = () => {
    if (isLoading) {
      stop();
    } else {
      complete(occurrenceId);
    }
  };

  return (
    <>
      <div className="flex flex-1 flex-col rounded-t-md bg-airbroke-800 p-8 ring-1 ring-white/5">
        <div className="mx-auto h-32 w-32 flex-shrink-0">
          <SiOpenai className="h-32 w-32 text-white" aria-hidden="true" />
        </div>
        <h3 className="my-6 text-sm font-medium text-white">Ask the AI</h3>
        <textarea
          readOnly
          ref={textareaRef}
          value={error ? error.message : completion}
          className="h-60 w-full resize-none rounded-lg bg-gray-700 px-4 py-2 text-xs text-white  scrollbar-none"
        ></textarea>
      </div>
      <div>
        <div className="-mt-px flex divide-x divide-indigo-400/30">
          <div className="flex w-0 flex-1">
            <button
              onClick={handleRequest}
              className={`relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-b-lg border border-transparent bg-indigo-400/10 py-4 text-sm font-semibold text-indigo-400 shadow-sm ring-1 ring-indigo-400/30 transition-colors duration-200 hover:bg-indigo-500 hover:text-indigo-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 ${
                isLoading ? 'hover:bg-red-500 hover:text-red-200' : 'hover:bg-indigo-500'
              }`}
            >
              <BsRobot className="h-5 w-5" aria-hidden="true" />
              {isLoading ? 'Stop' : 'Start'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
