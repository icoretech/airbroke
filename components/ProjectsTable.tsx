import classNames from '@/lib/classNames';
import { composeRepoUrl } from '@/lib/gitProvider';
import { project } from '@prisma/client';
import Link from 'next/link';
import { FaGithub } from 'react-icons/fa';
import OccurrenceCounterLabel from './CounterLabel';

export default function ProjectsTable({ projects }: { projects: project[] }) {
  const statuses = {
    offline: 'text-gray-500 bg-gray-100/50',
    online: 'text-green-400 bg-green-400/50',
    error: 'text-rose-400 bg-rose-400/50',
  };
  const environments = {
    staging: 'text-gray-400 bg-gray-400/10 ring-gray-400/20',
    production: 'text-indigo-400 bg-indigo-400/10 ring-indigo-400/30',
    test: 'text-white bg-gray-900 ring-gray-700',
  };

  return (
    <ul role="list" className="divide-y divide-white/5">
      {projects.map((project) => (
        <li key={project.id.toString()} className="relative flex items-center space-x-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="min-w-0 flex-auto">
            <div className="flex items-center gap-x-3">
              <span className="relative flex h-2 w-2">
                <span
                  className={classNames(
                    statuses[project.notices_count === BigInt(0) ? 'online' : 'error'],
                    'absolute inline-flex h-full w-full rounded-full',
                    project.notices_count !== BigInt(0) && 'animate-ping'
                  )}
                ></span>
                <span
                  className={classNames(
                    statuses[project.notices_count === BigInt(0) ? 'online' : 'error'],
                    'relative inline-flex h-2 w-2 rounded-full'
                  )}
                ></span>
              </span>

              <h2 className="relative min-w-0 text-sm font-semibold leading-6 text-white">
                <Link href={`/projects/${project.id.toString()}/notices`} className="flex gap-x-2">
                  <span className="truncate">{project.organization.toLowerCase()}</span>
                  <span className="text-gray-400">/</span>
                  <span className="cursor-pointer whitespace-nowrap">{project.name}</span>
                  <span className="absolute inset-0" />
                </Link>
                <Link
                  href={`/projects/${project.id.toString()}/notices`}
                  className={classNames(
                    'absolute inset-0 flex gap-x-2 bg-gradient-to-r from-gray-400 bg-clip-text text-transparent opacity-0 transition-opacity duration-300 ease-in-out hover:opacity-100',
                    project.notices_count === BigInt(0) ? 'to-green-600' : 'to-red-600'
                  )}
                >
                  <span className="truncate">{project.organization.toLowerCase()}</span>
                  <span className="text-gray-400">/</span>
                  <span className="cursor-pointer whitespace-nowrap">{project.name}</span>
                </Link>
              </h2>
            </div>
            <div className="ml-5 mt-1 flex items-center gap-x-2.5 text-xs leading-5 text-gray-400">
              <p className="inline-flex items-center whitespace-nowrap">
                <FaGithub className="h-1em w-1em mr-1 shrink-0" aria-hidden="true" />
                <Link href={composeRepoUrl(project)} className="hover:text-white">
                  {project.organization.toLowerCase()} / {project.name}
                </Link>
              </p>
              <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 flex-none fill-gray-300">
                <circle cx={1} cy={1} r={1} />
              </svg>
              <p className="truncate">{project.repo_branch}</p>
            </div>
          </div>

          <Link href={`/projects/${project.id.toString()}/notices`}>
            <OccurrenceCounterLabel counter={project.notices_count} />
          </Link>
        </li>
      ))}
    </ul>
  );
}
