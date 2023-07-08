import prisma from '@/lib/db';
import type { Project } from '@prisma/client';
import { unstable_cache } from 'next/cache';

// Define the type for the grouped projects
type GroupedProjects = { [key: string]: Project[] };

// Function to get projects based on optional search term
export async function getProjects(currentSearchTerm?: string): Promise<Project[]> {
  const whereObject: any = {
    ...(currentSearchTerm && { name: { contains: currentSearchTerm, mode: 'insensitive' } }),
  };

  const cachedFetchProjects = unstable_cache(() => _fetchProjects(whereObject), [JSON.stringify(whereObject)], {
    revalidate: 60,
    tags: ['projects'],
  });

  return cachedFetchProjects();
}

// Function to get projects grouped by organization
export async function getProjectsGroupedByOrganization(): Promise<GroupedProjects> {
  const projects = await getProjects();
  const groupedProjects: GroupedProjects = {};

  projects.forEach((project) => {
    const { organization, ...rest } = project;
    const formattedProject: Project = { organization, ...rest };

    if (!groupedProjects[organization]) {
      groupedProjects[organization] = [];
    }

    groupedProjects[organization].push(formattedProject);
  });

  return groupedProjects;
}

// Function to fetch a single project by ID
export async function getProjectById(projectId: string): Promise<Project | null> {
  const cachedProject = unstable_cache(
    async () => {
      return _fetchProjectById(projectId);
    },
    [projectId],
    { revalidate: 60, tags: [`project_${projectId}`] }
  );

  const cachedData = await cachedProject();

  return cachedData;
}

async function _fetchProjects(whereObject?: any): Promise<Project[]> {
  return prisma.project.findMany({
    where: whereObject,
    orderBy: { name: 'asc' },
  });
}

async function _fetchProjectById(projectId: string): Promise<Project | null> {
  return prisma.project.findUnique({ where: { id: projectId } });
}
