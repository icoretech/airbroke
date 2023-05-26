'use client';

import classNames from '@/lib/classNames';
import { Menu, Transition } from '@headlessui/react';
import { Project } from '@prisma/client';
import Link from 'next/link';
import { Fragment } from 'react';
import { RxCaretDown } from 'react-icons/rx';
import { SlInfo, SlKey } from 'react-icons/sl';

export default function ProjectActionsMenu({ project }: { project: Project }) {
  return (
    <Menu as="div" className="relative inline-flex items-center text-left">
      <div>
        <Menu.Button className="inline-flex justify-center gap-x-1.5 rounded-md px-3 py-2 text-sm font-semibold text-indigo-200 shadow-sm transition-colors duration-200 hover:bg-indigo-700 hover:text-white">
          Project
          <RxCaretDown className="-mr-1 h-5 w-5 text-gray-500" aria-hidden="true" />
        </Menu.Button>
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
        <Menu.Items className="z-11 absolute right-0 mt-10 w-56 origin-top-right translate-y-1/2 divide-y divide-white/5 rounded-md bg-airbroke-800 shadow-2xl ring-1 ring-gray-900/5 focus:outline-none">
          <div className="px-4 py-3">
            <p className="text-sm text-white">{project.name}</p>
            <p className="truncate text-xs font-medium text-gray-200">{project.organization}</p>
          </div>
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <Link
                  href={`/projects/${project.id}/edit`}
                  className={classNames(
                    active ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                    'group flex items-center px-4 py-2 text-sm'
                  )}
                >
                  <SlInfo className="mr-3 h-5 w-5 text-indigo-200 group-hover:text-indigo-400" aria-hidden="true" />
                  Overview
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <a
                  href={`/projects/${project.id}/edit?tab=integrations`}
                  className={classNames(
                    active ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                    'group flex items-center px-4 py-2 text-sm'
                  )}
                >
                  <SlKey className="mr-3 h-5 w-5 text-indigo-200 group-hover:text-indigo-400" aria-hidden="true" />
                  API Key
                </a>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
