"use client";

import { useState } from "react";
import { BsArrowRepeat } from "react-icons/bs";
import { Button } from "@/components/ui/button";
import { performReplay } from "@/lib/actions/occurrenceActions";
import type { ReplayResult } from "@/lib/actions/occurrenceActions";
import type { Context } from "@/types/airbroke";

function formatReplayResult(result: ReplayResult): string {
  if (result.ok) {
    return `HTTP Status Code: ${result.status}\nBody hidden`;
  }

  if (result.status !== undefined) {
    return `HTTP Status Code: ${result.status}\n${result.body ?? result.error}`;
  }

  return result.error;
}

function ToolboxFetch({ context }: { context: Context }) {
  const [responseText, setResponseText] = useState<string>("");

  return (
    <>
      <div className="flex flex-1 flex-col rounded-t-md bg-airbroke-800 p-8 ring-1 ring-white/5">
        <div className="mx-auto h-32 w-32 shrink-0">
          <span className="h-32 w-32 text-[8rem] leading-none text-white">
            <BsArrowRepeat />
          </span>
        </div>
        <h3 className="my-6 text-sm font-medium text-white">Replay Request</h3>
        <textarea
          readOnly
          aria-label="Replay response output"
          value={responseText}
          className="h-60 w-full resize-none rounded-lg bg-gray-700 px-4 py-2 text-xs text-white"
        ></textarea>
      </div>
      <div>
        <div className="-mt-px overflow-hidden rounded-b-lg ring-1 ring-indigo-400/30">
          <Button
            type="button"
            variant="outline"
            size="lg"
            disabled={!context.url}
            onClick={async () => {
              const response = await performReplay(context);
              setResponseText(formatReplayResult(response));
            }}
            className="h-auto w-full rounded-none border-transparent bg-indigo-400/10 py-4 text-indigo-200 hover:bg-indigo-500 hover:text-indigo-100 disabled:bg-indigo-400/5 disabled:text-indigo-200/40"
          >
            <BsArrowRepeat />
            Perform Request
          </Button>
        </div>
      </div>
    </>
  );
}

export default ToolboxFetch;
