'use server';

import prisma from '@/lib/db';
import { parseGitURL } from '@/lib/parseGitUrl';
import { revalidateTag } from 'next/cache';
import { z } from 'zod';
import { generateErrorMessage } from 'zod-error';
import { zfd } from 'zod-form-data';

interface ProjectResponse {
  project_id: string | null;
  error: string | null;
}

// TODO: replace with zod
function validateProjectName(name: string): boolean {
  const nameRegex = /^[a-zA-Z0-9-_.]{1,100}$/;
  return nameRegex.test(name);
}

export async function createProject(data?: FormData): Promise<ProjectResponse> {
  if (!data) {
    // Handle the case when no data is provided
    const randomNum = Math.floor(Math.random() * 10000);

    try {
      const project = await prisma.project.create({ data: { name: `Company ${randomNum}` } });
      return { project_id: project.id, error: null };
    } catch (e) {
      if (e instanceof Error) {
        return { project_id: null, error: e.message };
      } else {
        return { project_id: null, error: 'An unknown error occurred' };
      }
    }
  }

  const repository_url = data.get('repository_url') as string;

  const parsed = parseGitURL(repository_url);
  if (!parsed) {
    return {
      project_id: null,
      error: 'Invalid repository URL format.',
    };
  }

  const { provider, organization, repository } = parsed;

  if (!validateProjectName(repository)) {
    return {
      project_id: null,
      error: `Invalid project name "${repository}". It must be 1-100 characters long and can contain only alphanumeric characters without spaces.`,
    };
  }

  const projectData = {
    name: repository,
    organization: organization,
    repo_provider: provider,
    repo_branch: 'main',
    repo_issue_tracker: repository_url,
    repo_url: repository_url,
    // repo_provider_api_key: data.get('repo_provider_api_key') as string,
    // repo_provider_api_secret: data.get('repo_provider_api_secret') as string,
  };

  try {
    const project = await prisma.project.create({ data: projectData });
    return { project_id: project.id, error: null };
  } catch (e) {
    // Check if the exception is an instance of Error
    if (e instanceof Error) {
      // If it is, we can safely cast it to Error
      return { project_id: null, error: e.message };
    } else {
      // Otherwise, create a new Error object
      return { project_id: null, error: 'An unknown error occurred' };
    }
  }
}

export async function updateProject(projectId: string, formData: FormData): Promise<ProjectResponse> {
  // Define a schema for your form data
  const formDataSchema = zfd
    .formData({
      name: zfd.text(),
      organization: zfd.text(),
      repo_provider_api_key: zfd.text(z.string().optional()),
      repo_provider_api_secret: zfd.text(z.string().optional()),
      repo_branch: zfd.text(z.string().optional()),
      repo_issue_tracker: zfd.text(z.string().optional()).refine((value) => {
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
      }, 'Must be a valid URL'),
      repo_url: zfd.text(z.string().optional()).refine((value) => {
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
      }, 'Must be a valid URL'),
    })
    .refine(
      (data) => {
        // If one of repo_provider_api_key or repo_provider_api_secret is present, the other must be too
        if (
          (data.repo_provider_api_key && !data.repo_provider_api_secret) ||
          (!data.repo_provider_api_key && data.repo_provider_api_secret)
        ) {
          return false;
        }
        return true;
      },
      {
        message: 'Both repo_provider_api_key and repo_provider_api_secret must be provided if one is present',
        path: ['repo_provider_api_key', 'repo_provider_api_secret'], // This is where the error message will be attached
      }
    );

  // Validate the form data
  const parsedData = formDataSchema.safeParse(formData);
  if (!parsedData.success) {
    const errorMessage = generateErrorMessage(parsedData.error.issues);
    revalidateTag(`project_${projectId}`);
    return { project_id: projectId, error: errorMessage };
  }
  const convertedData = Object.fromEntries(
    Object.entries(parsedData.data).map(([key, value]) => [key, value === undefined ? null : value])
  );
  await prisma.project.update({
    where: { id: projectId },
    data: convertedData,
  });

  revalidateTag('projects');
  revalidateTag(`project_${projectId}`);

  return { project_id: projectId, error: null };
}

export async function toggleProjectPausedStatus(projectId: string): Promise<void> {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) {
    throw new Error('Project not found.');
  }

  await prisma.project.update({
    where: { id: projectId },
    data: { paused: !project.paused },
  });

  revalidateTag('projects');
  revalidateTag(`project_${projectId}`);
}

export async function deleteProjectNotices(projectId: string): Promise<void> {
  await prisma.notice.deleteMany({ where: { project_id: projectId } });

  revalidateTag('projects');
  revalidateTag(`project_${projectId}`);
  revalidateTag(`project_${projectId}_notices`);
}

export async function deleteProject(projectId: string): Promise<void> {
  await prisma.project.delete({ where: { id: projectId } });

  revalidateTag('projects');
}
