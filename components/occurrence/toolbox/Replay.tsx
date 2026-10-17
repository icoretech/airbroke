"use client";

import { useState } from "react";
import { BsArrowRepeat } from "react-icons/bs";
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
    <Card className="h-full min-w-0">
      <CardHeader>
        <CardTitle>Replay Request</CardTitle>
        <CardDescription>
          Send the recorded request and inspect its status.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <Textarea
          readOnly
          aria-label="Replay response output"
          value={responseText}
          placeholder={
            context.url
              ? "The response status will appear here."
              : "No request URL was recorded."
          }
          className="h-48 w-full resize-y font-mono"
        />
      </CardContent>
      <CardFooter>
        <Button
          type="button"
          variant="outline"
          disabled={!context.url}
          onClick={async () => {
            const response = await performReplay(context);
            setResponseText(formatReplayResult(response));
          }}
        >
          <BsArrowRepeat data-icon="inline-start" />
          Perform Request
        </Button>
      </CardFooter>
    </Card>
  );
}

export default ToolboxFetch;
