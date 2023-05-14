import { project } from '@prisma/client';
import Link from 'next/link';
import { VscEdit } from 'react-icons/vsc';

export default function ProjectHeader({ project }: { project: project }) {
  return (
    <header className="flex items-center justify-between border-b border-white/5 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
      <h1 className="text-base font-semibold leading-7 text-white">
        <Link href={`/projects/${project.id.toString()}/notices`} className="flex gap-x-2">
          <span className="truncate">{project.organization.toLowerCase()}</span>
          <span className="text-gray-400">/</span>
          <span className="cursor-pointer whitespace-nowrap">{project.name}</span>
        </Link>
      </h1>
      <Link
        href={`/projects/${project.id.toString()}`}
        className="inline-flex items-center rounded-md bg-indigo-400/10 px-3 py-2 text-sm font-semibold text-indigo-400 shadow-sm ring-indigo-400/30 transition-colors duration-200 hover:bg-indigo-500 hover:text-indigo-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
      >
        <VscEdit className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
        Edit
      </Link>
    </header>
  );
}
