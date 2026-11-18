"use client";

import { useEffect, useState } from "react";

export default function CopyButton({
  text,
  label = "Copy",
}: {
  text: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(timer);
  }, [copied]);

  return (
    <button
      type="button"
      className="copy"
      aria-label={copied ? "Copied" : label}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
        } catch {
          setCopied(false);
        }
      }}
    >
      <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
        {copied ? (
          <path d="M3 8.5l3 3 7-7" />
        ) : (
          <>
            <rect x="5" y="5" width="8.5" height="8.5" rx="1.5" />
            <path d="M10.5 3.2V3a1.5 1.5 0 0 0-1.5-1.5H3A1.5 1.5 0 0 0 1.5 3v6A1.5 1.5 0 0 0 3 10.5h.3" />
          </>
        )}
      </svg>
      <span aria-hidden="true">{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}
