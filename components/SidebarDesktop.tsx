import { prisma } from '@/lib/db';
import { project } from '@prisma/client';
import Link from 'next/link';
import { MdBrokenImage } from 'react-icons/md';
import { SlPlus } from 'react-icons/sl';
import { TbBrandGithub } from 'react-icons/tb';
import { LogoutButton } from './HomeButton';

function groupBy<T>(array: T[], key: keyof T) {
  return array.reduce((result: { [key: string]: T[] }, item) => {
    (result[item[key] as unknown as string] = result[item[key] as unknown as string] || []).push(item);
    return result;
  }, {});
}

export default async function SidebarDesktop({ selectedProject }: { selectedProject?: project }) {
  const projects = await prisma.project.findMany({
    orderBy: {
      name: 'asc',
    },
  });
  const groupedProjects = groupBy(projects, 'organization');

  return (
    <div className="hidden xl:fixed xl:inset-y-0 xl:z-50 xl:flex xl:w-72 xl:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-airbroke-800 px-8 pb-4 ring-1 ring-white/5 scrollbar-none">
        <div className="flex h-16 shrink-0 items-center">
          <Link href={`/projects`}>
            <MdBrokenImage className="h-8 w-auto text-indigo-500" aria-hidden="true" />
          </Link>
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            {Object.entries(groupedProjects).map(([organization, orgProjects]) => (
              <li key={organization}>
                <div className="text-xs font-semibold leading-6 text-gray-400">{organization}</div>
                <ul role="list" className="-mx-2 mt-2 space-y-1">
                  {orgProjects.map((project) => (
                    <li key={project.id.toString()}>
                      <Link
                        href={`/projects/${project.id}/notices`}
                        className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 ${
                          project.id === selectedProject?.id
                            ? 'bg-gray-800 text-white'
                            : 'text-gray-400 transition-colors duration-100 hover:bg-gray-800 hover:text-white'
                        }`}
                      >
                        <div className="flex w-full justify-between">
                          <div className="flex items-center gap-x-3 font-semibold ">
                            <TbBrandGithub className="h-6 w-6 shrink-0" aria-hidden="true" />
                            <span className="truncate">{project.name}</span>
                          </div>
                          {project.notices_count > 0 && (
                            <span
                              className="ml-auto w-9 min-w-max whitespace-nowrap rounded-full bg-gray-900 px-2.5 py-0.5 text-center text-xs font-medium leading-5 text-white ring-1 ring-inset ring-gray-700"
                              aria-hidden="true"
                            >
                              {project.notices_count.toString()}
                            </span>
                          )}
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
            <li>
              <Link
                href="/projects/new"
                className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-indigo-200 shadow-sm transition-colors duration-200 hover:bg-indigo-500 hover:text-white"
              >
                <SlPlus className="h-6 w-6 shrink-0" aria-hidden="true" />
                Create Project
              </Link>
            </li>
          </ul>
        </nav>

        {/* User Profile Section */}
        <div className="flex flex-col items-center gap-y-5 px-4 py-4">
          {/* User info can go here, e.g. avatar and username */}

          {/* Logout Button */}
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
