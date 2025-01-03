// components/SidebarButtons.tsx

'use client';

import { useSidebar } from '@/components/SidebarProvider';
import { IoMenuOutline } from 'react-icons/io5';
import { SlClose } from 'react-icons/sl';

export function SidebarOpenButton() {
  const { setSidebarOpen } = useSidebar();

  return (
    <button type="button" className="-m-2.5 p-2.5 text-gray-700 lg:hidden" onClick={() => setSidebarOpen(true)}>
      <span className="sr-only">Open sidebar</span>
      <IoMenuOutline className="size-6" aria-hidden="true" />
    </button>
  );
}

export function SidebarCloseButton() {
  const { setSidebarOpen } = useSidebar();

  return (
    <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
      <span className="sr-only">Close sidebar</span>
      <SlClose className="h-6 w-6 text-white" aria-hidden="true" />
    </button>
  );
}
