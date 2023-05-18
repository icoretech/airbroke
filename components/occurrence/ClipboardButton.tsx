'use client';

import { Prisma } from '@prisma/client';
import { useState } from 'react';
import { HiClipboardCopy } from 'react-icons/hi';

export default function ClipboardButton({ json }: { json: Prisma.JsonValue }) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(json, null, 2));
    setIsCopied(true);

    // Reset copied status after 3 seconds
    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  };

  return (
    <button
      onClick={handleCopy}
      className="group flex items-center gap-x-1 rounded-lg border border-indigo-500 px-4 py-2 text-xs font-semibold text-indigo-500 shadow-sm transition-colors duration-200 hover:bg-indigo-500 hover:text-white md:gap-x-3 md:text-sm"
    >
      <HiClipboardCopy className="h-4 w-4 md:h-5 md:w-5" aria-hidden="true" />
      {isCopied ? 'Copied!' : 'Copy to Clipboard'}
    </button>
  );
}
