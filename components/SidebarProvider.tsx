// components/SidebarProvider.tsx

'use client';

import React, { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';

interface SidebarContextValue {
  sidebarOpen: boolean;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
}

const SidebarContext = createContext<SidebarContextValue>({
  sidebarOpen: false,
  setSidebarOpen: () => {},
});

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}

export function SidebarProvider({
  children,
  initialSidebarOpen = false,
}: {
  children: React.ReactNode;
  initialSidebarOpen?: boolean;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(initialSidebarOpen);

  // Whenever sidebarOpen changes, update the cookie.
  useEffect(() => {
    document.cookie = `sidebarOpen=${sidebarOpen}; path=/;`;
  }, [sidebarOpen]);

  return <SidebarContext.Provider value={{ sidebarOpen, setSidebarOpen }}>{children}</SidebarContext.Provider>;
}
