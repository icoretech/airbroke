'use client';

import { signIn, signOut } from 'next-auth/react';

export function LoginButton() {
  return (
    <button
      onClick={() => signIn()}
      className="rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
    >
      Sign in
    </button>
  );
}

export function LogoutButton({ username, children }: { username?: string | null; children: React.ReactNode }) {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/' })}
      className="group flex w-full items-center justify-between gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-white hover:bg-gray-800"
    >
      {children}
      <span className="sr-only">Your profile</span>
      <span aria-hidden="true" className="transition-colors duration-200">
        <span className="group-hover:hidden">{username}</span>
        <span className="hidden group-hover:inline group-hover:text-rose-500">Logout</span>
      </span>
    </button>
  );
}
