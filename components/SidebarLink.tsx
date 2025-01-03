// components/SidebarLink.tsx

'use client';

import clsx from 'clsx';
import type { Route } from 'next';
import Link from 'next/link';

/**
 * Variants:
 * - "default": normal gray/indigo style
 * - "create": text-indigo-200 by default, hover:bg-indigo-600, etc.
 */
type SidebarLinkProps = {
  href: Route;
  isActive: boolean;
  variant?: 'default' | 'create';
  children: React.ReactNode;
};

export function SidebarLink({ href, isActive, variant = 'default', children }: SidebarLinkProps) {
  const baseClasses =
    'group flex items-center gap-x-2 transform rounded-md p-2 text-sm leading-6 transition-all duration-100 ease-out will-change-transform hover:scale-105';

  // Determine color classes
  let variantClasses: string;
  if (variant === 'create') {
    variantClasses = isActive ? 'bg-indigo-600 text-white' : 'text-indigo-200 hover:bg-indigo-600 hover:text-white';
  } else {
    variantClasses = isActive ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white';
  }

  return (
    <Link href={href} className={clsx(baseClasses, variantClasses)}>
      {/*
        We only define a minimal "flex items-center" for the link itself.
        No extra <div> that could interfere with the child's own layout.
      */}
      {children}
    </Link>
  );
}
