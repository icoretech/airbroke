'use client';

import { Dialog, Transition } from '@headlessui/react';
import { project } from '@prisma/client';
import { Fragment, useRef, useState, useTransition } from 'react';
import { SlDisc, SlFire } from 'react-icons/sl';
import { VscTrash } from 'react-icons/vsc';

export default function ConfirmationDialog({
  project,
  title,
  body,
  btnTitle,
  projectConfirmationAction, // server action imported from _actions and passed down as prop
}: {
  project: project;
  title?: string;
  body?: string;
  btnTitle?: string;
  projectConfirmationAction: (projectId: bigint) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const cancelButtonRef = useRef(null);

  async function handleDeleteProjectConfirm(project_id: bigint) {
    startTransition(async () => {
      await projectConfirmationAction(project_id);
      setOpen(false);
    });
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`inline-flex items-center rounded-md bg-red-400/10 px-3 py-2 text-sm font-semibold text-red-400 shadow-sm ring-1 ring-red-400/30 transition-colors duration-200 hover:bg-red-500 hover:text-red-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500`}
      >
        <VscTrash className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
        {btnTitle || 'Delete All Errs'}
      </button>

      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-50" initialFocus={cancelButtonRef} onClose={setOpen}>
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-gray-900 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-rose-600 sm:mx-0 sm:h-10 sm:w-10">
                      <SlFire className="h-6 w-6 text-red-200" aria-hidden="true" />
                    </div>
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-white">
                        {title || 'Are you sure?'}
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-300">
                          {body || 'All data will be erased, are you sure you want to continue?'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                      type="button"
                      disabled={isPending}
                      className="inline-flex w-full justify-center rounded-md bg-rose-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-500 sm:ml-3 sm:w-auto"
                      onClick={() => handleDeleteProjectConfirm(project.id)}
                    >
                      {isPending ? (
                        <SlDisc className="-ml-0.5 mr-1.5 h-5 w-5 animate-spin" aria-hidden="true" />
                      ) : (
                        <VscTrash className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
                      )}
                      <span>{isPending ? 'Deleting...' : 'Proceed'}</span>
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-gray-800 px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-700 hover:bg-gray-700 sm:mt-0 sm:w-auto"
                      onClick={() => setOpen(false)}
                      ref={cancelButtonRef}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
