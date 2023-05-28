import { LogoutButton } from '@/components/SessionButtons';
import { authOptions } from '@/lib/auth';
import { getProjectsGroupedByOrganization } from '@/lib/queries/projects';
import logo from '@/public/logo.svg';
import { getServerSession } from 'next-auth';
import Image from 'next/image';
import Link from 'next/link';
import { BsBookmarksFill } from 'react-icons/bs';
import { SlPlus } from 'react-icons/sl';
import { Gravatar } from './Gravatar';
import { ProviderIcon } from './ProviderIcon';

type SidebarDesktopProps = {
  selectedProjectId?: string;
};

async function SidebarDesktop({ selectedProjectId }: SidebarDesktopProps) {
  const session = await getServerSession(authOptions);
  const groupedProjects = await getProjectsGroupedByOrganization();

  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-airbroke-800 px-6 ring-1 ring-white/5 scrollbar-none">
      <div className="flex h-16 shrink-0 items-center">
        <Link href="/projects">
          <Image src={logo} alt="Logo" className="h-8 w-auto transform transition-transform hover:scale-105" />
        </Link>
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 mt-2 space-y-1">
              <li>
                <Link
                  href="/bookmarks"
                  className="group flex transform gap-x-3 rounded-md p-2 text-sm leading-6 text-gray-400 transition-colors transition-transform duration-100 hover:scale-105 hover:bg-gray-800 hover:text-white"
                >
                  <div className="flex w-full justify-between">
                    <div className="flex items-center gap-x-3 font-semibold">
                      <BsBookmarksFill className="h-6 w-6 shrink-0" aria-hidden="true" />
                      <span>Bookmarks</span>
                    </div>
                  </div>
                </Link>
              </li>
            </ul>
          </li>
          {Object.entries(groupedProjects).map(([organization, orgProjects]) => (
            <li key={organization}>
              <div className="text-xs font-semibold leading-6 text-gray-400">{organization}</div>
              <ul role="list" className="-mx-2 mt-2 space-y-1">
                {orgProjects.map((project) => (
                  <li key={project.id}>
                    <Link
                      href={`/projects/${project.id}`}
                      className={`group flex transform gap-x-3 rounded-md p-2 text-sm leading-6 transition-transform hover:scale-105 ${
                        project.id === selectedProjectId
                          ? 'bg-gray-800 text-white'
                          : 'text-gray-400 transition-colors duration-100 hover:bg-gray-800 hover:text-white'
                      }`}
                    >
                      <div className="flex w-full justify-between">
                        <div className="flex items-center gap-x-3 font-semibold">
                          <ProviderIcon
                            provider={project.repo_provider}
                            className="h-6 w-6 shrink-0"
                            aria-hidden="true"
                          />
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
              <SlPlus className="h-6 w-6 shrink-0 transform transition-transform hover:scale-105" aria-hidden="true" />
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

export default SidebarDesktop as unknown as (props: SidebarDesktopProps) => JSX.Element;
