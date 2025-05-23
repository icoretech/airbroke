// components/occurrence/ClipboardButton.tsx

'use client';

import { Prisma } from '@prisma/client';
import { useState } from 'react';
import { HiClipboard } from 'react-icons/hi';

export default function ClipboardButton({ json, text = false }: { json: Prisma.JsonValue; text?: boolean }) {
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
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-x-1.5 rounded-md px-3 py-2 text-sm font-semibold text-indigo-200 shadow-sm transition-colors duration-200 hover:bg-indigo-500 hover:text-white"
    >
      <HiClipboard className="h-4 w-4 md:h-5 md:w-5" aria-hidden="true" />
      {isCopied ? 'Copied!' : text ? 'Copy Text' : 'Copy JSON'}
    </button>
  );
}
