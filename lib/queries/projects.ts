import prisma from '@/lib/db';
import type { Project } from '@prisma/client';
import { cache } from 'react';
import { z } from 'zod';
import { generateErrorMessage } from 'zod-error';
import { zfd } from "zod-form-data";
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

interface UpdateProjectResponse {
  project_id: string | null;
  error: string | null;
}

export async function updateProject(projectId: string, formData: FormData): Promise<UpdateProjectResponse> {
  // Define a schema for your form data
  const formDataSchema = zfd.formData({
    name: zfd.text(),
    organization: zfd.text(),
    repo_provider_api_key: zfd.text(z.string().optional()),
    repo_provider_api_secret: zfd.text(z.string().optional()),
    repo_branch: zfd.text(z.string().optional()),
    repo_issue_tracker: zfd.text(z.string().optional()).refine(value => {
      // Add a custom URL validation
      if (value) {
        try {
          new URL(value);
          return true;
        } catch {
          return false;
        }
      }
      return true;
    }, "Must be a valid URL"),
    repo_url: zfd.text(z.string().optional()).refine(value => {
      // Add a custom URL validation
      if (value) {
        try {
          new URL(value);
          return true;
        } catch {
          return false;
        }
      }
      return true;
    }, "Must be a valid URL"),
  }).refine(data => {
    // If one of repo_provider_api_key or repo_provider_api_secret is present, the other must be too
    if ((data.repo_provider_api_key && !data.repo_provider_api_secret) || (!data.repo_provider_api_key && data.repo_provider_api_secret)) {
      return false;
    }
    return true;
  }, {
    message: 'Both repo_provider_api_key and repo_provider_api_secret must be provided if one is present',
    path: ['repo_provider_api_key', 'repo_provider_api_secret'] // This is where the error message will be attached
  });

  // Validate the form data
  const parsedData = formDataSchema.safeParse(formData);
  if (!parsedData.success) {
    const errorMessage = generateErrorMessage(parsedData.error.issues);
    return { project_id: projectId, error: errorMessage };
  }
  const convertedData = Object.fromEntries(
    Object.entries(parsedData.data).map(([key, value]) => [key, value === undefined ? null : value])
  );
  await prisma.project.update({
    where: { id: projectId },
    data: convertedData,
  });

  return { project_id: projectId, error: null };
}
