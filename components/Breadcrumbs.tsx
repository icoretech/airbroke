import { SidebarOpenButton } from '@/components/SidebarButtons';
import type { Breadcrumb } from '@/types/airbroke';
import Link from 'next/link';
import { SlLayers } from 'react-icons-ng/sl';

export default function Breadcrumbs({ breadcrumbs }: { breadcrumbs: Breadcrumb[] }) {
  return (
    <ol role="list" className="mx-auto flex w-full space-x-4 px-4 sm:px-2 lg:px-4">
      <li className="flex items-center xl:hidden">
        <SidebarOpenButton />
        <Link href="/projects" className="ml-2 text-xs font-medium text-indigo-200 hover:text-indigo-400">
          Projects
        </Link>
      </li>
      <li className="hidden items-center xl:flex">
        <Link href="/projects" className="text-indigo-400 hover:text-indigo-200">
          <SlLayers className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
          <span className="sr-only">Projects</span>
        </Link>
      </li>
      {breadcrumbs.map((breadcrumb) => (
        <li key={breadcrumb.name} className="flex items-center">
          <svg
            className="h-full w-6 flex-shrink-0 text-white text-opacity-10"
            viewBox="0 0 24 44"
            preserveAspectRatio="none"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
          </svg>
          <Link
            href={breadcrumb.href}
            className="ml-4 text-xs font-medium text-indigo-200 hover:text-indigo-400"
            aria-current={breadcrumb.current ? 'page' : undefined}
          >
            <span className="inline-flex max-w-[50px] items-center truncate sm:max-w-[100px] md:max-w-[200px] lg:max-w-lg">
              {breadcrumb.name}
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}
