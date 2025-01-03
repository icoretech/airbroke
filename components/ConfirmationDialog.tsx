// components/ConfirmationDialog.tsx

'use client';

import { deleteProject, deleteProjectNotices } from '@/app/_actions';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { useRouter } from 'next/navigation';
import { Fragment, useRef, useState, useTransition } from 'react';
import { SlDisc, SlFire } from 'react-icons/sl';
import { VscTrash } from 'react-icons/vsc';

export default function ConfirmationDialog({
  projectId,
  title,
  body,
  btnId,
}: {
  projectId: string;
  title?: string;
  body?: string;
  btnId?: string;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const cancelButtonRef = useRef(null);
  const { push } = useRouter();

  async function handleConfirmAction() {
    startTransition(() => {
      if (btnId === 'deleteProject') {
        deleteProject(projectId);
        setOpen(false);
        push('/projects');
      } else if (btnId === 'deleteAllErrors') {
        deleteProjectNotices(projectId);
        setOpen(false);
      }
    });
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="text-rose-500 hover:text-rose-700">
        {btnId === 'deleteProject' ? 'Delete Project' : 'Delete All Errors'}
      </button>

      <Transition show={open} as={Fragment}>
        <Dialog
          as="div"
          static
          className="fixed inset-0 overflow-y-auto"
          initialFocus={cancelButtonRef}
          open={open}
          onClose={setOpen}
        >
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <DialogPanel className="relative transform overflow-hidden rounded-lg border border-rose-600 bg-gray-900 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-rose-600 sm:mx-0 sm:h-10 sm:w-10">
                      <SlFire className="h-6 w-6 text-rose-200" aria-hidden="true" />
                    </div>
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <DialogTitle as="h3" className="text-base font-semibold leading-6 text-white">
                        {title}
                      </DialogTitle>
                      <div className="mt-2">
                        <p className="text-sm text-gray-300">{body}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md border border-transparent bg-rose-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={handleConfirmAction}
                      disabled={isPending}
                    >
                      {btnId === 'deleteProject' ? (
                        <>
                          <VscTrash className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                          <span>{isPending ? 'Deleting...' : 'Delete Project'}</span>
                        </>
                      ) : (
                        <>
                          {isPending && <SlDisc className="-ml-1 mr-2 h-5 w-5 animate-spin" aria-hidden="true" />}
                          <span>{isPending ? 'Deleting...' : 'Delete All Errors'}</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                      onClick={() => setOpen(false)}
                      ref={cancelButtonRef}
                      disabled={isPending}
                    >
                      Cancel
                    </button>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
