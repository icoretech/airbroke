import { prisma } from '@/lib/db';
import { Project } from '@prisma/client';
import { cache } from 'react';
import 'server-only';

// Define the type for the grouped projects
type GroupedProjects = { [key: string]: Project[] };

// Cached function to fetch projects from the database
const fetchProjects = cache(async (whereObject?: any) => {
  const results = await prisma.project.findMany({
    where: whereObject,
    orderBy: { name: 'asc' },
  });
  return results;
});

// Function to get projects based on optional search term
export const getProjects = async (currentSearchTerm?: string) => {
  const whereObject: any = {
    ...(currentSearchTerm && { name: { contains: currentSearchTerm, mode: 'insensitive' } }),
  };
  return fetchProjects(whereObject);
};

// Function to get projects grouped by organization
export const getProjectsGroupedByOrganization = async (): Promise<GroupedProjects> => {
  const projects = await fetchProjects();
  const groupedProjects = projects.reduce((result: GroupedProjects, project) => {
    const { organization, ...rest } = project;
    const formattedProject: Project = { organization, ...rest };
    if (!result[organization]) {
      result[organization] = [];
    }
    result[organization].push(formattedProject);
    return result;
  }, {});
  return groupedProjects;
};

// Cached function to fetch a single project by ID
const fetchProjectById = cache(async (projectId: string) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });
  return project;
});

// Function to fetch a single project by ID
export const getProjectById = async (projectId: string): Promise<Project | null> => {
  return fetchProjectById(projectId);
};
