// components/occurrence/toolbox/AI.tsx

"use client";

import { useCompletion } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";
import { BsRobot } from "react-icons/bs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export default function ToolboxAI({ occurrenceId }: { occurrenceId: string }) {
  const [isDetailMode, setIsDetailMode] = useState(false);
  const { complete, completion, stop, isLoading, error } = useCompletion({
    api: "/api/completion",
    streamProtocol: "data",
    body: {
      occurrenceId,
      isDetailMode,
    },
  });
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!textareaRef.current) return;
    if (completion === "") return;
    textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
  }, [completion]);

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
    <Card className="h-full min-w-0">
      <CardHeader>
        <CardTitle>Ask the AI</CardTitle>
        <CardDescription>
          Generate an explanation of this occurrence.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <Textarea
          readOnly
          aria-label="AI explanation output"
          ref={textareaRef}
          value={completion}
          placeholder="Your explanation will appear here."
          className="h-48 w-full resize-y"
        />
        {error && (
          <p role="alert" className="mt-2 text-sm text-destructive">
            {error.message}
          </p>
        )}
      </CardContent>
      <CardFooter className="flex-wrap gap-2">
        {isLoading ? (
          <Button
            type="button"
            variant="destructive"
            onClick={() => handleRequest(isDetailMode)}
          >
            <BsRobot data-icon="inline-start" />
            Stop
          </Button>
        ) : (
          <>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleRequest(false)}
            >
              <BsRobot data-icon="inline-start" />
              Ask
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleRequest(true)}
            >
              <BsRobot data-icon="inline-start" />
              Ask with details
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
