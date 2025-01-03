// components/SidebarDesktop.tsx

import { getProjectsGroupedByOrganization } from '@/lib/queries/projects';
import logo from '@/public/logo.svg';
import Image from 'next/image';
import { TbClockPause } from 'react-icons/tb';
import { BookmarksLink, CreateProjectLink, ProjectLink, ProjectsLink } from './SidebarLinks';
import { SourceRepoProviderIcon } from './SourceRepoProviderIcon';

export default async function SidebarDesktop({ selectedProjectId }: { selectedProjectId?: string | undefined }) {
  const groupedProjects = await getProjectsGroupedByOrganization();

  return (
    <>
      <div className="flex h-16 shrink-0 items-center">
        <Image src={logo} alt="Airbroke" className="h-8 w-auto" />
      </div>

      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {/* Basic pages */}
              <li>
                <ProjectsLink />
              </li>
              <li>
                <BookmarksLink />
              </li>
              <li>
                <CreateProjectLink />
              </li>
            </ul>
          </li>

          {/* Projects grouped by organization */}
          {Object.entries(groupedProjects).length === 0 ? (
            <li className="mt-2 text-sm text-gray-400">No projects yet.</li>
          ) : (
            Object.entries(groupedProjects).map(([organization, orgProjects]) => (
              <li key={organization}>
                <div className="text-xs font-semibold leading-6 text-gray-400">{organization}</div>
                <ul role="list" className="-mx-2 mt-2 space-y-1">
                  {orgProjects.map((project) => (
                    <li key={project.id}>
                      <ProjectLink projectId={project.id} selectedProjectId={selectedProjectId}>
                        <div className="flex items-center gap-x-3 font-semibold">
                          {project.paused ? (
                            <TbClockPause className="h-6 w-6 shrink-0" aria-hidden="true" />
                          ) : (
                            <SourceRepoProviderIcon
                              sourceRepoProvider={project.repo_provider}
                              className="h-6 w-6 shrink-0"
                              aria-hidden="true"
                            />
                          )}
                          <span className="truncate">{project.name}</span>
                        </div>
                        {project.notices_count > 0 && (
                          <span
                            className="ml-auto w-9 min-w-max whitespace-nowrap rounded-full bg-gray-900 px-2.5 py-0.5 text-center text-xs font-medium leading-5 text-white ring-1 ring-inset ring-gray-700"
                            aria-hidden="true"
                          >
                            {project.notices_count}
                          </span>
                        )}
                      </ProjectLink>
                    </li>
                  ))}
                </ul>
              </li>
            ))
          )}
        </ul>
      </nav>
    </>
  );
}
