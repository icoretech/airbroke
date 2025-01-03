// app/projects/[project_id]/Filter.tsx

'use client';

import { getEnvironmentClasses } from '@/lib/environmentStyles';
import { generateUpdatedURLWithRemovals } from '@/lib/generateUpdatedUrlWithRemovals';
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Fragment } from 'react';
import { MdOutlineFilterList, MdOutlineFilterListOff } from 'react-icons/md';

export default function Filter({ environments }: { environments: string[] }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { filterByEnv } = Object.fromEntries(searchParams);

  return (
    <div className="relative">
      <Menu>
        <MenuButton className="flex items-center gap-2 rounded-md px-2 py-1 text-sm font-medium text-white shadow-inner transition-colors duration-100 focus:outline-none data-[hover]:bg-indigo-600 data-[open]:bg-indigo-600">
          Environment
          <MdOutlineFilterList className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </MenuButton>

        <Transition
          as={Fragment}
          enter="ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="ease-in duration-75"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <MenuItems className="absolute right-0 z-50 mt-2 max-h-64 w-52 origin-top-right overflow-y-auto rounded-xl border border-white/5 bg-gray-900 p-1 text-sm/6 text-white shadow-xl ring-1 ring-gray-900/5 ring-indigo-900 transition scrollbar-none focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0">
            {/* List environment items */}
            {environments.map((env) => {
              const envStyle = getEnvironmentClasses(env);
              const isActive = filterByEnv === env;

              return (
                <MenuItem key={env}>
                  {({ focus }) => (
                    <Link
                      href={generateUpdatedURLWithRemovals(pathname, searchParams, { filterByEnv: env })}
                      className={clsx(
                        // Base styling for each menu item
                        'group flex w-full items-center gap-2 rounded-lg px-3 py-1.5',
                        // If focused or selected, show environment styling
                        focus || isActive ? envStyle : 'text-gray-300 hover:text-white'
                      )}
                    >
                      {env}
                    </Link>
                  )}
                </MenuItem>
              );
            })}
            <div className="my-1 h-px bg-white/5" />
            {/* “Clear filter” item with an icon */}
            <MenuItem>
              {({ focus }) => (
                <Link
                  href={generateUpdatedURLWithRemovals(pathname, searchParams, {}, ['filterByEnv'])}
                  className={clsx(
                    'group flex w-full items-center gap-2 rounded-lg px-3 py-1.5',
                    focus ? 'bg-rose-700 text-white' : 'text-gray-300 hover:text-white'
                  )}
                >
                  <MdOutlineFilterListOff className="h-4 w-4 fill-white/30 group-hover:fill-white" aria-hidden="true" />
                  Clear filter
                </Link>
              )}
            </MenuItem>
          </MenuItems>
        </Transition>
      </Menu>
    </div>
  );
}
