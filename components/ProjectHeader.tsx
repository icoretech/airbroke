import { project } from '@prisma/client';
import Link from 'next/link';
import { FaGithub } from 'react-icons/fa';
import { RiOrganizationChart } from 'react-icons/ri';
import { VscEdit } from 'react-icons/vsc';

export default function ProjectHeader({ project }: { project: project }) {
  return (
    <div className="px-4 py-4 sm:px-6 sm:py-6 lg:flex lg:items-center lg:justify-between lg:px-8">
      <div className="min-w-0 flex-1">
        <h2 className="text-2xl font-bold leading-7 text-white sm:truncate sm:text-3xl sm:tracking-tight">
          <Link href={`/projects/${project.id.toString()}/notices`}>{project.name}</Link>
        </h2>
        <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
          <div className="mt-2 flex items-center text-sm text-gray-300">
            <RiOrganizationChart className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-500" aria-hidden="true" />
            {project.organization}
          </div>
          <div className="mt-2 flex items-center text-sm text-gray-300">
            <FaGithub className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-500" aria-hidden="true" />
            {project.repo_provider}
          </div>
          <div className="mt-2 flex items-center text-sm text-gray-300">
            <FaGithub className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-500" aria-hidden="true" />
            {project.repo_branch}
          </div>
          <div className="mt-2 flex items-center text-sm text-gray-300">
            <FaGithub className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-500" aria-hidden="true" />
            {project.repo_issue_tracker}
          </div>
          <div className="mt-2 flex items-center text-sm text-gray-300">
            <FaGithub className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-500" aria-hidden="true" />
            {project.created_at.toDateString()}
          </div>
        </div>
      </div>
      <div className="mt-5 flex lg:ml-4 lg:mt-0">
        <span className="hidden sm:block">
          <Link
            href={`/projects/${project.id.toString()}`}
            className="inline-flex items-center rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            <VscEdit className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            Edit
          </Link>
        </span>
      </div>
    </div>
  );
}
