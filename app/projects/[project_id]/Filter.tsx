'use client';

import classNames from '@/lib/classNames';
import { generateUpdatedURL } from '@/lib/generateUpdatedUrl';
import { Menu, Transition } from '@headlessui/react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Fragment } from 'react';
import { CiFilter } from 'react-icons-ng/ci';

export default function Filter({ environments }: { environments: string[] }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { filterByEnv } = Object.fromEntries(searchParams);

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="flex h-full items-center gap-x-1 text-sm font-medium leading-6 text-white">
        Filter by
        <CiFilter className="h-5 w-5 text-gray-500" aria-hidden="true" />
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
        <Menu.Items className="absolute right-0 z-40 w-56 origin-top-right divide-y divide-white/5 rounded-md bg-airbroke-800 py-2 shadow-2xl ring-1 ring-gray-900/5 focus:outline-none">
          {environments.map((env) => (
            <Menu.Item key={env}>
              {({ active }) => (
                <Link
                  href={generateUpdatedURL(pathname, searchParams, { filterByEnv: env })}
                  className={classNames(
                    active ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                    'group flex items-center px-4 py-2 text-sm'
                  )}
                >
                  {env} <span className="sr-only">{filterByEnv === env ? '(selected)' : ''}</span>
                </Link>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
