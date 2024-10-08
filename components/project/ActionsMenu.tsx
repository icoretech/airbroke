'use client';

import classNames from '@/lib/classNames';
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import { Project } from '@prisma/client';
import Link from 'next/link';
import { Fragment } from 'react';
import { RxCaretDown } from 'react-icons-ng/rx';
import { SlInfo, SlKey } from 'react-icons-ng/sl';

export default function ProjectActionsMenu({ project }: { project: Project }) {
  return (
    <Menu as="div" className="relative inline-flex items-center text-left">
      <div>
        <MenuButton className="inline-flex justify-center gap-x-1.5 rounded-md px-3 py-2 text-sm font-semibold text-indigo-200 shadow-sm transition-colors duration-200 hover:bg-indigo-700 hover:text-white">
          Project
          <RxCaretDown className="-mr-1 h-5 w-5 text-gray-500" aria-hidden="true" />
        </MenuButton>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <MenuItems className="absolute right-0 z-50 mt-10 w-56 origin-top-right translate-y-1/2 divide-y divide-white/5 rounded-md bg-airbroke-800 shadow-2xl ring-1 ring-gray-900/5 focus:outline-none">
          <div className="px-4 py-3">
            <p className="text-sm text-white">{project.name}</p>
            <p className="truncate text-xs font-medium text-gray-200">{project.organization}</p>
          </div>
          <div className="py-1">
            <MenuItem>
              {({ focus }) => (
                <Link
                  href={`/projects/${project.id}/edit`}
                  className={classNames(
                    focus ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                    'group flex items-center px-4 py-2 text-sm'
                  )}
                >
                  <SlInfo className="mr-3 h-5 w-5 text-indigo-200 group-hover:text-indigo-400" aria-hidden="true" />
                  Overview
                </Link>
              )}
            </MenuItem>
            <MenuItem>
              {({ focus }) => (
                <a
                  href={`/projects/${project.id}/edit?tab=integrations`}
                  className={classNames(
                    focus ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                    'group flex items-center px-4 py-2 text-sm'
                  )}
                >
                  <SlKey className="mr-3 h-5 w-5 text-indigo-200 group-hover:text-indigo-400" aria-hidden="true" />
                  API Key
                </a>
              )}
            </MenuItem>
          </div>
        </MenuItems>
      </Transition>
    </Menu>
  );
}
