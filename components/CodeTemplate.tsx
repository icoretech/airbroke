'use client';

import { useState } from 'react';
import { HiClipboardCopy } from 'react-icons/hi';

interface CodeProps {
  code: string;
  replacements: Record<string, string>;
  name: string;
}

const replacePlaceholders = (template: string, replacements: Record<string, string>): string => {
  let result = template;
  for (const key in replacements) {
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), replacements[key]);
  }
  return result;
};

export default function CodeTemplate({ code, replacements, name }: CodeProps) {
  const [isCopied, setIsCopied] = useState(false);

  const htmlString = replacePlaceholders(code, replacements)
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br/>')
    .replace(/\s/g, '&nbsp;');

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setIsCopied(true);

    // Reset copied status after 3 seconds
    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  };

  return (
    <div className="mb-6 divide-y divide-indigo-400/30 overflow-hidden rounded-lg bg-airbroke-500 text-white shadow">
      <div className="flex items-center justify-between px-4 py-5 sm:px-6">
        <h2 className="min-w-0 text-sm font-semibold leading-6">{name}</h2>
        <button
          type="button"
          className="flex items-center text-sm font-medium text-white focus:outline-none"
          onClick={handleCopy}
        >
          {isCopied ? 'Copied!' : 'Copy'}
          <HiClipboardCopy className="ml-1 h-4 w-4" />
        </button>
      </div>
      <div className="px-4 text-xs sm:px-6">
        <pre className="z-40 whitespace-pre-wrap text-white" dangerouslySetInnerHTML={{ __html: htmlString }} />
      </div>
    </div>
  );
}
