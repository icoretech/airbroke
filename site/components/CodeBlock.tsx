"use client";

import React from "react";
import { FaCheck } from "react-icons/fa";
import { HiClipboard } from "react-icons/hi";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

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
    <div className="relative w-full rounded-lg bg-slate-900 p-3">
      {filename && (
        <div className="mb-2 flex items-center justify-between text-xs text-zinc-400">
          <span>{filename}</span>
          <button
            type="button"
            onClick={copyToClipboard}
            className="flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-200"
          >
            {copied ? <FaCheck size={14} /> : <HiClipboard size={14} />}
          </button>
        </div>
      )}

      <SyntaxHighlighter
        language={language}
        style={atomDark}
        showLineNumbers
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
          fontSize: "0.875rem",
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};
