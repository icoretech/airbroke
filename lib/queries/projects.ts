import { customCache } from '@/lib/cache';
import prisma from '@/lib/db';
import type { Project } from '@prisma/client';

// Define the type for the grouped projects
type GroupedProjects = { [key: string]: Project[] };

// Function to get projects based on optional search term
export async function getProjects(currentSearchTerm?: string): Promise<Project[]> {
  const whereObject: any = {
    ...(currentSearchTerm && { name: { contains: currentSearchTerm, mode: 'insensitive' } }),
  };

  const cachedData = await customCache(() => _fetchProjects(whereObject), ['projects', JSON.stringify(whereObject)], {
    revalidate: 60,
    tags: ['projects'],
  });

  return cachedData;
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
  const cachedData = await customCache(() => _fetchProjectById(projectId), ['project', projectId], {
    revalidate: 60,
    tags: [`project_${projectId}`],
  });

  return cachedData;
}

async function _fetchProjects(whereObject?: any): Promise<Project[]> {
  const result = await prisma.project.findMany({
    where: whereObject,
    orderBy: { name: 'asc' },
  });
  return result;
}

async function _fetchProjectById(projectId: string): Promise<Project | null> {
  const result = await prisma.project.findUnique({ where: { id: projectId } });
  return result;
}
