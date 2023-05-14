'use client';

import classNames from '@/lib/classNames';
import { Menu, Transition } from '@headlessui/react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Fragment } from 'react';
import { BsChevronBarExpand } from 'react-icons/bs';

type SortAttribute = 'env' | 'kind' | 'updated_at' | 'seen_count';

export default function Sort({
  currentSortAttribute,
  currentSort,
}: {
  currentSortAttribute: 'env' | 'kind' | 'updated_at' | 'seen_count';
  currentSort: 'asc' | 'desc';
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  function toggleSort(attribute: 'env' | 'kind' | 'updated_at' | 'seen_count') {
    return currentSortAttribute === attribute && currentSort === 'asc' ? 'desc' : 'asc';
  }

  function generateUpdatedURL(paramsToUpdate: Record<string, string>) {
    const updatedParams = new URLSearchParams(searchParams.toString());

    for (const key in paramsToUpdate) {
      updatedParams.set(key, paramsToUpdate[key]);
    }
    return `${pathname}?${updatedParams.toString()}`;
  }

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="flex h-full items-center gap-x-1 text-sm font-medium leading-6 text-white">
        Sort by
        <BsChevronBarExpand className="h-5 w-5 text-gray-500" aria-hidden="true" />
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2.5 w-40 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
          <Menu.Item>
            {({ active }) => (
              <Link
                href={generateUpdatedURL({ sortBy: toggleSort('kind'), sortAttr: 'kind' })}
                className={classNames(active ? 'bg-gray-50' : '', 'block px-3 py-1 text-sm leading-6 text-gray-900')}
              >
                Exception {toggleSort('kind')}
              </Link>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <Link
                href={generateUpdatedURL({ sortBy: toggleSort('seen_count'), sortAttr: 'seen_count' })}
                className={classNames(active ? 'bg-gray-50' : '', 'block px-3 py-1 text-sm leading-6 text-gray-900')}
              >
                Occurrences {toggleSort('seen_count')}
              </Link>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <Link
                href="#"
                className={classNames(active ? 'bg-gray-50' : '', 'block px-3 py-1 text-sm leading-6 text-gray-900')}
              >
                Environment
              </Link>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
