// components/CodeBlock.tsx

"use client";

import React from "react";
import { FaCheck } from "react-icons/fa";
import { HiClipboard } from "react-icons/hi";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { Button } from "@/components/ui/button";

type CodeBlockProps = {
  language: string;
  code: string;
  filename?: string;
  highlightLines?: number[];
};

export const CodeBlock = ({
  language,
  code,
  filename,
  highlightLines = [],
}: CodeBlockProps) => {
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative w-full min-w-0 rounded-lg border border-white/10 bg-black/20 p-3">
      <div className="mb-2 flex items-center justify-between gap-2 text-xs text-zinc-400">
        <span className="min-w-0 truncate">{filename ?? "\u00A0"}</span>
        <Button
          type="button"
          onClick={copyToClipboard}
          variant="ghost"
          size="icon-sm"
          className="shrink-0 text-zinc-400 hover:text-zinc-100"
          aria-label="Copy code"
        >
          {copied ? <FaCheck size={18} /> : <HiClipboard size={18} />}
        </Button>
      </div>

      <div className="overflow-x-auto">
        <SyntaxHighlighter
          language={language}
          style={atomDark}
          wrapLines
          lineProps={(lineNumber) => {
            const isHighlighted = highlightLines.includes(lineNumber);
            return {
              style: {
                backgroundColor: isHighlighted
                  ? "rgba(255,255,255,0.1)"
                  : "transparent",
              },
            };
          }}
          customStyle={{
            margin: 0,
            background: "transparent",
            padding: 0,
            fontSize: "0.8125rem",
            fontFamily:
              'var(--font-roboto-mono), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
            whiteSpace: "pre-wrap",
            overflowWrap: "anywhere",
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};
