// components/occurrence/ResolveButton.tsx

'use client';

import { reinstateOccurrence, resolveOccurrence } from '@/app/_actions';
import { useTransition } from 'react';

interface ResolveButtonProps {
  occurrenceId: string;
  resolvedAt: Date | null;
}

export default function ResolveButton({ occurrenceId, resolvedAt }: ResolveButtonProps) {
  const [isPending, startTransition] = useTransition();

  const isResolved = Boolean(resolvedAt);
  const label = isResolved ? 'Reinstate' : 'Resolve';
  const action = isResolved ? reinstateOccurrence : resolveOccurrence;

  // Different style classes based on resolved vs. not
  const buttonClass = isResolved
    ? 'flex-none rounded-md bg-rose-400/10 px-2 py-1 text-xs font-medium text-rose-400 ring-1 ring-inset ring-rose-400/30 hover:bg-rose-900 focus:z-10'
    : 'flex-none rounded-md bg-green-400/10 px-2 py-1 text-xs font-medium text-green-400 ring-1 ring-inset ring-green-400/30 hover:bg-green-900 focus:z-10';

  return (
    <button
      onClick={() => startTransition(() => action(occurrenceId))}
      type="button"
      disabled={isPending}
      className={buttonClass}
    >
      {label}
    </button>
  );
}
