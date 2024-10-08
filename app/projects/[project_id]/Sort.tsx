'use client';

import classNames from '@/lib/classNames';
import { generateUpdatedURL } from '@/lib/generateUpdatedUrl';
import type { SortAttribute } from '@/lib/queries/notices';
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Fragment } from 'react';
import { RxCaretSort } from 'react-icons-ng/rx';
import { TbArrowBadgeDown, TbArrowBadgeUp } from 'react-icons-ng/tb';

const sortOptions = [
  { sortAttr: 'kind' as const, label: 'Exception' },
  { sortAttr: 'seen_count' as const, label: 'Seen Count' },
  { sortAttr: 'env' as const, label: 'Environment' },
  { sortAttr: 'updated_at' as const, label: 'Last Update' },
] as const;

export default function Sort() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { sortDir, sortAttr } = Object.fromEntries(searchParams);

  function toggleSort(attribute: SortAttribute) {
    return sortAttr === attribute && sortDir === 'asc' ? 'desc' : 'asc';
  }

  function getSortIcon(attribute: SortAttribute) {
    const sortOrder = toggleSort(attribute);
    const IconComponent = sortOrder === 'asc' ? TbArrowBadgeUp : TbArrowBadgeDown;

    return <IconComponent className="mr-3 h-5 w-5 text-indigo-400 group-hover:text-indigo-500" aria-hidden="true" />;
  }

  return (
    <Menu as="div" className="relative">
      <MenuButton className="flex h-full items-center gap-x-1 text-sm font-medium leading-6 text-white">
        Sort by
        <RxCaretSort className="h-5 w-5 text-gray-500" aria-hidden="true" />
      </MenuButton>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <MenuItems className="absolute right-0 z-10 w-56 origin-top-right divide-y divide-white/5 rounded-md bg-airbroke-800 py-2 shadow-2xl ring-1 ring-gray-900/5 focus:outline-none">
          {sortOptions.map((option) => (
            <MenuItem key={option.sortAttr}>
              {({ focus }) => (
                <Link
                  href={generateUpdatedURL(pathname, searchParams, {
                    sortDir: toggleSort(option.sortAttr),
                    sortAttr: option.sortAttr,
                  })}
                  className={classNames(
                    focus ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                    'group flex items-center px-4 py-2 text-sm'
                  )}
                >
                  {getSortIcon(option.sortAttr)}
                  {option.label} <span className="sr-only">{toggleSort(option.sortAttr).toUpperCase()}</span>
                </Link>
              )}
            </MenuItem>
          ))}
        </MenuItems>
      </Transition>
    </Menu>
  );
}
