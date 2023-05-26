'use client';

import classNames from '@/lib/classNames';
import { Menu, Transition } from '@headlessui/react';
import type { Route } from 'next';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Fragment } from 'react';
import { RxCaretSort } from 'react-icons/rx';
import { TbArrowBadgeDown, TbArrowBadgeUp } from 'react-icons/tb';

type SortAttribute = 'env' | 'kind' | 'updated_at' | 'seen_count';

export default function Sort({
  currentSortAttribute,
  currentSort,
}: {
  currentSortAttribute: SortAttribute;
  currentSort: 'asc' | 'desc';
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const sortOptions: { sortAttr: SortAttribute; label: string }[] = [
    { sortAttr: 'kind', label: 'Exception' },
    { sortAttr: 'seen_count', label: 'Seen Count' },
    { sortAttr: 'env', label: 'Environment' },
    { sortAttr: 'updated_at', label: 'Last Update' },
  ];

  function toggleSort(attribute: SortAttribute) {
    return currentSortAttribute === attribute && currentSort === 'asc' ? 'desc' : 'asc';
  }

  function getSortIcon(attribute: SortAttribute) {
    const sortOrder = toggleSort(attribute);
    const IconComponent = sortOrder === 'asc' ? TbArrowBadgeUp : TbArrowBadgeDown;

    return <IconComponent className="mr-3 h-5 w-5 text-indigo-400 group-hover:text-indigo-500" aria-hidden="true" />;
  }

  function generateUpdatedURL(paramsToUpdate: Record<string, string>) {
    const updatedParams = new URLSearchParams(searchParams.toString());

    for (const key in paramsToUpdate) {
      updatedParams.set(key, paramsToUpdate[key]);
    }
    return `${pathname}?${updatedParams.toString()}` as Route;
  }

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="flex h-full items-center gap-x-1 text-sm font-medium leading-6 text-white">
        Sort by
        <RxCaretSort className="h-5 w-5 text-gray-500" aria-hidden="true" />
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
        <Menu.Items className="absolute right-0 z-10 w-56 origin-top-right divide-y divide-white/5  rounded-md  bg-airbroke-800  py-2 shadow-2xl ring-1 ring-gray-900/5 focus:outline-none">
          {sortOptions.map((option) => (
            <Menu.Item key={option.sortAttr}>
              {({ active }) => (
                <Link
                  href={generateUpdatedURL({ sortBy: toggleSort(option.sortAttr), sortAttr: option.sortAttr })}
                  className={classNames(
                    active ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                    'group flex items-center px-4 py-2 text-sm'
                  )}
                >
                  {getSortIcon(option.sortAttr)}
                  {option.label} <span className="sr-only">{toggleSort(option.sortAttr).toUpperCase()}</span>
                </Link>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
