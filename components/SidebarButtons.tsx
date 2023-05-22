'use client';

import { useSidebar } from '@/components/SidebarProvider';
import { SlClose, SlMenu } from 'react-icons/sl';

export function SidebarOpenButton() {
  const { sidebarOpen, setSidebarOpen } = useSidebar();

  return (
    <button type="button" className="-m-2.5 p-2.5 text-white xl:hidden" onClick={() => setSidebarOpen(true)}>
      <span className="sr-only">Open sidebar</span>
      <SlMenu className="h-5 w-5" aria-hidden="true" />
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
