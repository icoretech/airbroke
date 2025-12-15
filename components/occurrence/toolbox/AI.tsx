// components/occurrence/toolbox/AI.tsx

"use client";

import { useCompletion } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";
import { BsRobot } from "react-icons/bs";
import { SiOpenai } from "react-icons/si";
import { Button } from "@/components/ui/button";

export default function ToolboxAI({ occurrenceId }: { occurrenceId: string }) {
  const [isDetailMode, setIsDetailMode] = useState(false);
  const { complete, completion, stop, isLoading, error } = useCompletion({
    api: "/api/completion",
    streamProtocol: "text",
    body: {
      occurrenceId,
      isDetailMode,
    },
  });
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const outputText = error ? error.message : completion;

  useEffect(() => {
    if (!textareaRef.current) return;
    if (outputText === "") return;
    textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
  }, [outputText]);

  const handleRequest = (detailMode: boolean) => {
    if (isLoading) {
      stop();
    } else {
      setIsDetailMode(detailMode);
      complete(occurrenceId, {
        body: {
          occurrenceId,
          isDetailMode: detailMode,
        },
      });
    }
  };

  return (
    <>
      <div className="flex flex-1 flex-col rounded-t-md bg-airbroke-800 p-8 ring-1 ring-white/5">
        <div className="mx-auto h-32 w-32 shrink-0">
          <span className="h-32 w-32 text-[8rem] leading-none text-white">
            <SiOpenai />
          </span>
        </div>
        <h3 className="my-6 text-sm font-medium text-white">Ask the AI</h3>
        <textarea
          readOnly
          ref={textareaRef}
          value={outputText}
          className="h-60 w-full resize-none rounded-lg bg-gray-700 px-4 py-2 text-xs text-white scrollbar-none"
        ></textarea>
      </div>
      <div>
        {isLoading ? (
          <div className="-mt-px overflow-hidden rounded-b-lg ring-1 ring-red-400/30">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => handleRequest(isDetailMode)}
              className="h-auto w-full rounded-none border-transparent bg-red-400/10 py-4 text-red-200 hover:bg-red-500 hover:text-red-100"
            >
              <BsRobot />
              Stop
            </Button>
          </div>
        ) : (
          <div className="-mt-px overflow-hidden rounded-b-lg ring-1 ring-indigo-400/30">
            <div className="flex divide-x divide-indigo-400/30">
              <Button
                type="button"
                variant="ghost"
                size="lg"
                onClick={() => handleRequest(false)}
                className="h-auto flex-1 rounded-none bg-indigo-400/10 py-4 text-indigo-200 hover:bg-indigo-500 hover:text-indigo-100"
              >
                <BsRobot />
                Ask
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="lg"
                onClick={() => handleRequest(true)}
                className="h-auto flex-1 rounded-none bg-indigo-400/10 py-4 text-indigo-200 hover:bg-indigo-500 hover:text-indigo-100"
              >
                <BsRobot />
                Ask with details
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
