'use client';

import { performReplay } from '@/app/_actions';
import { Context } from '@/types/airbroke';
import { useState } from 'react';
import { BsArrowRepeat } from 'react-icons/bs';

function ToolboxFetch({ context }: { context: Context }) {
  const [responseText, setResponseText] = useState<string>('');

  return (
    <>
      <div className="flex flex-1 flex-col rounded-t-md bg-airbroke-800 p-8 ring-1 ring-white/5">
        <div className="mx-auto h-32 w-32 flex-shrink-0">
          <BsArrowRepeat className="h-32 w-32 text-white" aria-hidden="true" />
        </div>
        <h3 className="my-6 text-sm font-medium text-white">Replay Request</h3>
        <textarea
          readOnly
          value={responseText}
          className="h-60 w-full resize-none rounded-lg bg-gray-700 px-4 py-2 text-xs text-white"
        ></textarea>
      </div>
      <div>
        <div className="-mt-px flex divide-x divide-indigo-400/30">
          <div className="flex w-0 flex-1">
            <button
              disabled={!context.url}
              onClick={async () => {
                const response = await performReplay(context);
                setResponseText(response);
              }}
              className={`relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-b-lg border border-transparent bg-indigo-400/10 py-4 text-sm font-semibold text-indigo-400 shadow-sm ring-1 ring-indigo-400/30 transition-colors duration-200 ${
                context.url ? 'hover:bg-indigo-500 hover:text-indigo-200' : ''
              } focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500`}
            >
              <BsArrowRepeat className="h-5 w-5" aria-hidden="true" />
              Perform Request
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ToolboxFetch;
