// components/UserMenu.tsx

'use client';

import { Gravatar } from '@/components/Gravatar';
import { LogoutButton } from '@/components/SessionButtons';
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import clsx from 'clsx';
import { Fragment } from 'react';
import { RxCaretDown } from 'react-icons/rx';
import { SlLogout } from 'react-icons/sl';

interface UserMenuProps {
  email: string;
  username: string;
}

export function UserMenu({ email, username }: UserMenuProps) {
  return (
    <Menu as="div" className="relative">
      <MenuButton className="-m-1.5 flex items-center p-1.5 focus:outline-none">
        <span className="sr-only">Open user menu</span>
        <Gravatar email={email} className="size-8 rounded-full bg-gray-50" />
        <span className="hidden lg:flex lg:items-center">
          <span aria-hidden="true" className="ml-4 text-sm/6 font-semibold text-white">
            {username}
          </span>
          <RxCaretDown aria-hidden="true" className="ml-2 size-5 text-gray-400" />
        </span>
      </MenuButton>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <MenuItems
          className={clsx(
            'absolute right-0 z-50 mt-2 w-44 origin-top-right rounded-xl border border-white/5',
            'bg-gray-900 p-1 text-sm text-white shadow-xl ring-1 ring-white/5 focus:outline-none'
          )}
        >
          <MenuItem as={Fragment}>
            {({ focus }) => (
              <LogoutButton
                className={clsx(
                  'flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm',
                  focus ? 'bg-indigo-700 text-white' : 'text-gray-300 hover:text-white'
                )}
              >
                <SlLogout className="h-4 w-4" aria-hidden="true" />
                Logout
              </LogoutButton>
            )}
          </MenuItem>
        </MenuItems>
      </Transition>
    </Menu>
  );
}
