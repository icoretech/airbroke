'use client';

import { occurrence } from '@prisma/client';
import Image from 'next/image';
import curl from 'public/curl.png';
import { useState } from 'react';
import { SiCurl } from 'react-icons/si';

interface Context {
  headers?: Record<string, string>;
  httpMethod?: string;
  url?: string;
}

function ToolboxCurl({ occurrence }: { occurrence: occurrence }) {
  const context = occurrence.context as Context;

  const toCurl = (): string => {
    const { headers, httpMethod, url } = context;
    if (!headers) return '';

    let cmd = `curl -X ${httpMethod} '${url}'`;
    Object.entries(headers).forEach(([k, v]) => {
      cmd += ` -H '${k}: ${v}'`;
    });

    return cmd;
  };

  const [isCopied, setIsCopied] = useState(false);

  const curlCommand = toCurl();

  const handleCopy = () => {
    navigator.clipboard.writeText(curlCommand);
    setIsCopied(true);

    // Reset copied status after 3 seconds
    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  };

  return (
    <>
      <div className="flex flex-1 flex-col rounded-t-md bg-airbroke-800 p-8 ring-1 ring-white/5">
        <Image className="mx-auto h-32 w-32 flex-shrink-0" src={curl} alt="cURL" />
        <h3 className="my-6 text-sm font-medium text-white">cURL Command</h3>
        <textarea
          readOnly
          value={curlCommand}
          className="h-60 w-full resize-none rounded-lg bg-gray-700 px-4 py-2 text-xs text-white"
        ></textarea>
      </div>
      <div>
        <div className="-mt-px flex divide-x divide-indigo-400/30">
          <div className="flex w-0 flex-1">
            <button
              onClick={handleCopy}
              className={`relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-b-lg border border-transparent bg-indigo-400/10 py-4 text-sm font-semibold text-indigo-400 shadow-sm ring-1 ring-indigo-400/30 transition-colors duration-200 hover:bg-indigo-500 hover:text-indigo-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 ${'hover:bg-indigo-500'}`}
            >
              <SiCurl className="h-5 w-5" aria-hidden="true" />
              {isCopied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ToolboxCurl;
