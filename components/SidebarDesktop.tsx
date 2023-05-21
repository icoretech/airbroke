import { LogoutButton } from '@/components/SessionButtons';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import logo from '@/public/logo.svg';
import { project } from '@prisma/client';
import { getServerSession } from 'next-auth';
import Image from 'next/image';
import Link from 'next/link';
import { SlPlus } from 'react-icons/sl';
import { TbBrandGithub } from 'react-icons/tb';
import { Gravatar } from './Gravatar';

function groupBy<T>(array: T[], key: keyof T) {
  return array.reduce((result: { [key: string]: T[] }, item) => {
    (result[item[key] as unknown as string] = result[item[key] as unknown as string] || []).push(item);
    return result;
  }, {});
}

export default async function SidebarDesktop({ selectedProject }: { selectedProject?: project }) {
  const session = await getServerSession(authOptions);

  const projects = await prisma.project.findMany({
    orderBy: {
      name: 'asc',
    },
  });
  const groupedProjects = groupBy(projects, 'organization');

  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-airbroke-800 px-6 ring-1 ring-white/5 scrollbar-none">
      <div className="flex h-16 shrink-0 items-center">
        <Link href={`/projects`}>
          <Image src={logo} alt="Airbroke logo" className="h-8 w-auto" />
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
          <li className="">
            <Link
              href="/projects/new"
              className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-indigo-200 shadow-sm transition-colors duration-200 hover:bg-indigo-500 hover:text-white"
            >
              <SlPlus className="h-6 w-6 shrink-0" aria-hidden="true" />
              Create Project
            </Link>
          </li>
          <li className="-mx-6 mt-auto">
            <LogoutButton username={session?.user?.name}>
              <Gravatar email={session?.user?.email} className="h-8 w-8 rounded-full bg-gray-800" />
            </LogoutButton>
          </li>
        </ul>
      </nav>
    </div>
  );
}
