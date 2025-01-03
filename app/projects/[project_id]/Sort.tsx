// app/projects/[project_id]/Sort.tsx

'use client';

import { generateUpdatedURLWithRemovals } from '@/lib/generateUpdatedUrlWithRemovals';
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Fragment } from 'react';
import { MdDeleteSweep, MdSort } from 'react-icons/md';
import { TbArrowBadgeDown, TbArrowBadgeUp } from 'react-icons/tb';

export type SortAttribute = 'env' | 'kind' | 'updated_at' | 'seen_count' | undefined;
export type SortDirection = 'asc' | 'desc' | undefined;

const sortAttributes: Exclude<SortAttribute, undefined>[] = ['kind', 'seen_count', 'env', 'updated_at'];

export default function Sort() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { sortDir, sortAttr } = Object.fromEntries(searchParams) as {
    sortDir?: SortDirection;
    sortAttr?: SortAttribute;
  };

  // Toggle logic: If already sorting by "attr" asc, switch to "desc"; otherwise default to "asc"
  function toggleSort(attr: Exclude<SortAttribute, undefined>): SortDirection {
    return sortAttr === attr && sortDir === 'asc' ? 'desc' : 'asc';
  }

  // Decide which arrow to show next to each attribute
  function sortIcon(attr: Exclude<SortAttribute, undefined>) {
    const nextDir = toggleSort(attr);
    // If we are currently sorting by this attribute, show arrow up/down for the *next* direction
    if (sortAttr === attr) {
      return nextDir === 'asc' ? <TbArrowBadgeUp /> : <TbArrowBadgeDown />;
    }
    // Otherwise, no arrow
    return null;
  }

  return (
    <div className="relative">
      <Menu>
        <MenuButton className="flex items-center gap-2 rounded-md px-2 py-1 text-sm font-medium text-white shadow-inner transition-colors duration-100 focus:outline-none data-[hover]:bg-indigo-600 data-[open]:bg-indigo-600">
          Sort
          <MdSort className="h-5 w-5 text-gray-400" aria-hidden="true" />
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
          <MenuItems className="absolute right-0 z-50 mt-2 w-52 origin-top-right rounded-xl border border-white/5 bg-gray-900 p-1 text-sm/6 text-white shadow-xl ring-1 ring-gray-900/5 ring-indigo-900 transition focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0">
            {/* Sort attributes */}
            {sortAttributes.map((attr) => {
              const nextDir = toggleSort(attr);
              // Are we currently sorting by this attribute?
              const isActive = sortAttr === attr;
              return (
                <MenuItem key={attr}>
                  {({ focus }) => (
                    <Link
                      href={generateUpdatedURLWithRemovals(pathname, searchParams, {
                        sortAttr: attr,
                        sortDir: nextDir,
                      })}
                      className={clsx(
                        'group flex w-full items-center gap-2 rounded-lg px-3 py-1.5',
                        focus || isActive ? 'bg-indigo-700 text-white' : 'text-gray-300 hover:text-white'
                      )}
                    >
                      {/* Arrow icon if currently sorting by this attribute */}
                      <span className="h-4 w-4 text-indigo-200 group-hover:text-indigo-300">{sortIcon(attr)}</span>
                      {attr}
                      {/* Show the “(asc)” or “(desc)” status if currently sorting */}
                      {isActive && ` (${sortDir || 'desc'})`}
                    </Link>
                  )}
                </MenuItem>
              );
            })}

            {/* Divider */}
            <div className="my-1 h-px bg-white/5" />

            {/* Clear sort - removes sortAttr and sortDir from the URL */}
            <MenuItem>
              {({ focus }) => (
                <Link
                  href={generateUpdatedURLWithRemovals(pathname, searchParams, {}, ['sortAttr', 'sortDir'])}
                  className={clsx(
                    'group flex w-full items-center gap-2 rounded-lg px-3 py-1.5',
                    focus ? 'bg-rose-700 text-white' : 'text-gray-300 hover:text-white'
                  )}
                >
                  <MdDeleteSweep className="h-4 w-4 fill-white/30 group-hover:fill-white" aria-hidden="true" />
                  Clear sorting
                </Link>
              )}
            </MenuItem>
          </MenuItems>
        </Transition>
      </Menu>
    </div>
  );
}
