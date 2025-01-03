// components/SidebarLinks.tsx

'use client';

import { usePathname } from 'next/navigation';
import { TbBookmarks, TbFileDelta, TbFilePlus } from 'react-icons/tb';
import { SidebarLink } from './SidebarLink';

import type { Route } from 'next';

export function ProjectsLink() {
  const pathname = usePathname();
  const isActive = pathname === '/projects';

  return (
    <SidebarLink href="/projects" isActive={isActive}>
      <TbFileDelta className="h-6 w-6 shrink-0" aria-hidden="true" />
      <span>Projects</span>
    </SidebarLink>
  );
}

export function BookmarksLink() {
  const pathname = usePathname();
  const isActive = pathname === '/bookmarks';

  return (
    <SidebarLink href="/bookmarks" isActive={isActive}>
      <TbBookmarks className="h-6 w-6 shrink-0" aria-hidden="true" />
      <span>Bookmarks</span>
    </SidebarLink>
  );
}

export function CreateProjectLink() {
  const pathname = usePathname();
  const isActive = pathname === '/projects/new';

  // Notice we pass variant="create" here
  return (
    <SidebarLink href="/projects/new" isActive={isActive} variant="create">
      <TbFilePlus className="h-6 w-6 shrink-0" aria-hidden="true" />
      <span>Create Project</span>
    </SidebarLink>
  );
}

/**
 * For linking to an individual project:
 *   <ProjectLink projectId="abc123" selectedProjectId="abc123">
 *     {children}
 *   </ProjectLink>
 */
export function ProjectLink({
  projectId,
  selectedProjectId,
  children,
}: {
  projectId: string;
  selectedProjectId?: string | undefined;
  children: React.ReactNode;
}) {
  const isActive = projectId === selectedProjectId;

  return (
    <SidebarLink href={`/projects/${projectId}` as Route} isActive={isActive}>
      {/* Here we define a custom layout: a flex row with justify-between */}
      <div className="flex w-full items-center justify-between">{children}</div>
    </SidebarLink>
  );
}
