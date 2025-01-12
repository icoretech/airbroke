// components/SessionButtons.tsx

'use client';

import { signOut } from 'next-auth/react';

interface LogoutButtonProps {
  children?: React.ReactNode;
  redirectTo?: string;
  className?: string;
}

export function LogoutButton({ children, redirectTo = '/', className }: LogoutButtonProps) {
  return (
    <button onClick={() => signOut({ redirectTo })} className={className}>
      {children}
    </button>
  );
}
