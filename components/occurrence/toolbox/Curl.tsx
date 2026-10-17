// components/occurrence/toolbox/Curl.tsx

"use client";

import { useState } from "react";
import { SiCurl } from "react-icons/si";
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
    <Card className="h-full min-w-0">
      <CardHeader>
        <CardTitle>cURL Command</CardTitle>
        <CardDescription>
          Copy the recorded request for your terminal.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <Textarea
          readOnly
          aria-label="Generated cURL command"
          value={curlCommand}
          placeholder="No request URL was recorded."
          className="h-48 w-full resize-y font-mono"
        />
      </CardContent>
      <CardFooter>
        <Button
          type="button"
          variant="outline"
          disabled={!curlCommand}
          onClick={handleCopy}
        >
          <SiCurl data-icon="inline-start" />
          {isCopied ? "Copied!" : "Copy"}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default ToolboxCurl;
