'use client';

import { ReactNode, createContext, useContext, useState } from 'react';

interface SidebarContextProps {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return <SidebarContext.Provider value={{ sidebarOpen, setSidebarOpen }}>{children}</SidebarContext.Provider>;
}
