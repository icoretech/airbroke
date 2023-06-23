import classNames from '@/lib/classNames';
import { getProjects } from '@/lib/queries/projects';
import Link from 'next/link';
import OccurrenceCounterLabel from './CounterLabel';

type ProjectsTableProps = {
  currentSearchTerm: string;
};

const statusClasses = {
  dark: 'text-gray-500 bg-gray-100/50',
  green: 'text-green-400 bg-green-400/50',
  red: 'text-rose-400 bg-rose-400/50',
};

export default async function ProjectsTable({ currentSearchTerm }: ProjectsTableProps) {
  const projects = await getProjects(currentSearchTerm);

  return (
    <ul role="list" className="divide-y divide-white/5">
      {projects.map((project) => (
        <li
          key={project.id}
          className="relative flex items-center space-x-4 px-4 py-4 transition-colors duration-200 hover:bg-airbroke-800 sm:px-6 lg:px-8"
        >
          <div className="min-w-0 flex-auto">
            <div className="flex items-center gap-x-3">
              <span className="relative flex h-2 w-2">
                <span
                  className={classNames(
                    statusClasses[project.notices_count === BigInt(0) ? 'green' : 'red'],
                    'absolute inline-flex h-full w-full rounded-full',
                    project.notices_count !== BigInt(0) && 'animate-ping'
                  )}
                ></span>
                <span
                  className={classNames(
                    statusClasses[project.notices_count === BigInt(0) ? 'green' : 'red'],
                    'relative inline-flex h-2 w-2 rounded-full'
                  )}
                ></span>
              </span>

              <h2 className="relative min-w-0 text-sm font-semibold leading-6 text-white">
                <Link href={`/projects/${project.id}`} className="flex gap-x-2">
                  <span className="truncate">{project.organization.toLowerCase()}</span>
                  <span className="text-gray-400">/</span>
                  <span className="cursor-pointer whitespace-nowrap">{project.name}</span>
                  <span className="absolute inset-0" />
                </Link>
              </h2>
            </div>
          </div>

          <Link href={`/projects/${project.id}`}>
            <OccurrenceCounterLabel counter={project.notices_count} />
          </Link>
        </li>
      ))}
    </ul>
  );
}
