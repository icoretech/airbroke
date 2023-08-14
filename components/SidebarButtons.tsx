'use client';

import { useSidebar } from '@/components/SidebarProvider';
import { SlClose, SlMenu } from 'react-icons-ng/sl';

export function SidebarOpenButton() {
  const { sidebarOpen, setSidebarOpen } = useSidebar();

  return (
    <button
      type="button"
      className="p-2 text-indigo-200 hover:text-indigo-400 xl:hidden"
      onClick={() => setSidebarOpen(true)}
    >
      <span className="sr-only">Open sidebar</span>
      <SlMenu className="h-6 w-6" aria-hidden="true" />
    </button>
  );
}

export function SidebarCloseButton() {
  const { sidebarOpen, setSidebarOpen } = useSidebar();

  return (
    <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
      <span className="sr-only">Close sidebar</span>
      <SlClose className="h-6 w-6 text-white" aria-hidden="true" />
    </button>
  );
}
