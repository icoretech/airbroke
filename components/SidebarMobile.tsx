// components/SidebarMobile.tsx

'use client';

import { Dialog, DialogBackdrop, DialogPanel, TransitionChild } from '@headlessui/react';
import { IoMdCloseCircleOutline } from 'react-icons/io';
import { useSidebar } from './SidebarProvider';

export default function SidebarMobile({ children }: { children: React.ReactNode }) {
  const { sidebarOpen, setSidebarOpen } = useSidebar();

  return (
    <Dialog open={sidebarOpen} onClose={setSidebarOpen} className="relative z-50 lg:hidden">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
      />

      <div className="fixed inset-0 flex">
        <DialogPanel
          transition
          className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full"
        >
          <TransitionChild>
            <div className="absolute left-full top-0 flex w-16 justify-center pt-5 duration-300 ease-in-out data-[closed]:opacity-0">
              <button type="button" onClick={() => setSidebarOpen(false)} className="-m-2.5 p-2.5">
                <span className="sr-only">Close sidebar</span>
                <IoMdCloseCircleOutline aria-hidden="true" className="size-6 text-white" />
              </button>
            </div>
          </TransitionChild>
          {children}
        </DialogPanel>
      </div>
    </Dialog>
  );
}
