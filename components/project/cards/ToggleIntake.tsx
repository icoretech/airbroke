// components/project/cards/ToggleIntake.tsx

'use client';

import { toggleProjectPausedStatus } from '@/app/_actions';
import { Field, Label, Switch } from '@headlessui/react';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';

export default function ToggleIntake({ projectId, isPaused }: { projectId: string; isPaused: boolean }) {
  const [enabled, setEnabled] = useState(!isPaused);
  const [isPending, startTransition] = useTransition();
  const { refresh } = useRouter();

  useEffect(() => {
    setEnabled(!isPaused);
  }, [isPaused]);

  async function handleToggle() {
    const newEnabledStatus = !enabled;
    await toggleProjectPausedStatus(projectId);

    startTransition(() => {
      setEnabled(newEnabledStatus);
      refresh();
    });
  }

  return (
    <Field as="div" className="flex items-center">
      <Switch
        checked={enabled}
        onChange={handleToggle}
        disabled={isPending}
        className={clsx(
          enabled ? 'bg-rose-600' : 'bg-gray-200',
          'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-rose-600 focus:ring-offset-2',
          isPending ? 'cursor-wait opacity-60' : ''
        )}
      >
        <span
          aria-hidden="true"
          className={clsx(
            enabled ? 'translate-x-5' : 'translate-x-0',
            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
          )}
        />
      </Switch>
      <Label as="span" className="ml-3 text-sm">
        <span className="font-medium text-gray-200">Accept Data</span>{' '}
        <span className="text-gray-400">({enabled ? 'Active' : 'Paused'})</span>
      </Label>
    </Field>
  );
}
