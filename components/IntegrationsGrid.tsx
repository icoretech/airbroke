// components/IntegrationsGrid.tsx

'use client';

import { IntegrationItem, integrations } from '@/lib/integrationsData';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { IoMdCloseCircle } from 'react-icons/io';
import { CodeBlock } from './CodeBlock';

interface IntegrationsGridProps {
  replacements: Record<string, string>;
}

function replacePlaceholders(template: string, replacements: Record<string, string>) {
  let result = template;
  for (const key in replacements) {
    const find = `{${key}}`;
    result = result.split(find).join(replacements[key]);
  }
  return result;
}

export default function IntegrationsGrid({ replacements }: IntegrationsGridProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<IntegrationItem | null>(null);

  const handleSelect = (item: IntegrationItem) => {
    setSelected(item);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelected(null);
  };

  return (
    <div className="space-y-4">
      {/* Info banner */}
      <div className="relative rounded-lg bg-gray-900 px-4 py-3 text-sm text-gray-100 shadow-md sm:px-6">
        <p className="leading-5">
          <strong className="font-semibold text-indigo-300">Heads up!</strong> Airbroke is an Airbrake-compatible error
          collector. Simply install an official Airbrake SDK in your project and configure it to point to Airbroke.
          Below are example snippets showing how to configure Airbrake. Remember to disable extra performance stats or
          remote config options, so only error notifications are sent to Airbroke.
        </p>
      </div>

      {/* Integration cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {integrations.map((item) => {
          const Icon = item.icon; // optional field if using icons

          return (
            <div
              key={item.name}
              onClick={() => handleSelect(item)}
              className="cursor-pointer rounded-lg border border-white/10 bg-gray-900 p-4 shadow-md transition-colors hover:border-indigo-500 hover:bg-airbroke-600"
            >
              <div className="mb-1 flex items-center gap-2">
                {Icon && <Icon className="h-4 w-4 text-indigo-300" />}
                <h3 className="text-sm font-semibold text-white">{item.name}</h3>
              </div>
              <p className="text-xs text-gray-300">Click to view code snippet</p>
            </div>
          );
        })}
      </div>

      {/* Headless UI Dialog for the modal */}
      <Transition show={open} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={handleClose}>
          {/* The backdrop */}
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/60" />
          </TransitionChild>

          {/* Modal outer container (centering) */}
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
              {/* The actual Dialog panel with scale transition */}
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <DialogPanel className="relative w-full max-w-3xl transform overflow-hidden rounded-md bg-slate-900 p-4 font-mono text-sm text-white shadow-lg transition-all">
                  {/* Close button */}
                  <button className="absolute right-4 top-4 text-gray-400 hover:text-gray-200" onClick={handleClose}>
                    <IoMdCloseCircle size={22} />
                  </button>

                  {selected && (
                    <>
                      {/* Dialog Title */}
                      <DialogTitle className="mb-3 text-base font-semibold text-gray-100">
                        {selected.language.toUpperCase()}
                      </DialogTitle>

                      {/* Code snippet */}
                      <CodeBlock
                        language={selected.language}
                        filename={selected.filename}
                        code={replacePlaceholders(selected.code, replacements)}
                      />
                    </>
                  )}
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
