// components/occurrence/toolbox/Curl.tsx

"use client";

import { useState } from "react";
import { SiCurl } from "react-icons/si";
import { Button } from "@/components/ui/button";
import type { Context } from "@/types/airbroke";

function ToolboxCurl({ context }: { context: Context }) {
  const toCurl = (): string => {
    const { headers = {}, httpMethod = "GET", url } = context;
    if (!url) return "";

    let cmd = `curl -v `;

    if (httpMethod.toUpperCase() !== "GET") {
      cmd += `-X ${httpMethod} `;
    }

    cmd += `'${url}'`;

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
        <div className="mx-auto h-32 w-32 shrink-0">
          <span className="h-32 w-32 text-[8rem] leading-none text-white">
            <SiCurl />
          </span>
        </div>
        <h3 className="my-6 text-sm font-medium text-white">cURL Command</h3>
        <textarea
          readOnly
          value={curlCommand}
          className="h-60 w-full resize-none rounded-lg bg-gray-700 px-4 py-2 text-xs text-white"
        ></textarea>
      </div>
      <div>
        <div className="-mt-px overflow-hidden rounded-b-lg ring-1 ring-indigo-400/30">
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={handleCopy}
            className="h-auto w-full rounded-none border-transparent bg-indigo-400/10 py-4 text-indigo-200 hover:bg-indigo-500 hover:text-indigo-100"
          >
            <SiCurl />
            {isCopied ? "Copied!" : "Copy"}
          </Button>
        </div>
      </div>
    </>
  );
}

export default ToolboxCurl;
