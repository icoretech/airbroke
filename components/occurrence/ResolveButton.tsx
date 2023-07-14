'use client';

import { reinstateOccurrence, resolveOccurrence } from '@/app/_actions';
import { useTransition } from 'react';

export default function ResolveButton({ occurrenceId, resolvedAt }: { occurrenceId: string; resolvedAt: Date | null }) {
  let [isPending, startTransition] = useTransition();

  return resolvedAt ? (
    <button
      onClick={() => startTransition(() => reinstateOccurrence(occurrenceId))}
      type="button"
      disabled={isPending}
      className="flex-none rounded-md bg-rose-400/10 px-2 py-1 text-xs font-medium text-rose-400 ring-1 ring-inset ring-rose-400/30 hover:bg-rose-900 focus:z-10"
    >
      Reinstate
    </button>
  ) : (
    <button
      onClick={() => startTransition(() => resolveOccurrence(occurrenceId))}
      type="button"
      disabled={isPending}
      className="flex-none rounded-md bg-green-400/10 px-2 py-1 text-xs font-medium text-green-400 ring-1 ring-inset ring-green-400/30 hover:bg-green-900 focus:z-10"
    >
      Resolve
    </button>
  );
}
