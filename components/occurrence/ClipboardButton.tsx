// components/occurrence/ClipboardButton.tsx

"use client";

import { useState } from "react";
import { HiClipboard } from "react-icons/hi";
import { Button } from "@/components/ui/button";
import type { Prisma } from "@/prisma/generated/client";

export default function ClipboardButton({
  json,
  text = false,
}: {
  json: Prisma.JsonValue;
  text?: boolean;
}) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = text ? (json as string) : JSON.stringify(json, null, 2);

    navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);

    // Reset copied status after 3 seconds
    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  };

  return (
    <Button type="button" onClick={handleCopy} variant="outline">
      <HiClipboard data-icon="inline-start" aria-hidden="true" />
      {isCopied ? "Copied!" : text ? "Copy Text" : "Copy JSON"}
    </Button>
  );
}
