'use server';

import { prisma } from '@/lib/db';
import { parseGitURL } from '@/lib/parseGitUrl';
import Chance from 'chance';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

interface CreateProjectResponse {
  project_id: string | null;
  error: string | null;
}

// TODO: replace with zod
function validateProjectName(name: string): boolean {
  const nameRegex = /^[a-zA-Z0-9-_.]{1,100}$/;
  return nameRegex.test(name);
}

function invalidateProjectsCache(): void {
  revalidatePath('/projects');
}

function invalidateAllProjectCache(): void {
  revalidatePath('/projects/[project_id]');
}

export async function createProject(data?: FormData): Promise<CreateProjectResponse> {
  if (!data) {
    // Handle the case when no data is provided
    const chance = new Chance();

    try {
      const project = await prisma.project.create({ data: { name: chance.company() } });
      return { project_id: project.id, error: null };
    } catch (e) {
      if (e instanceof Error) {
        return { project_id: null, error: e.message };
      } else {
        return { project_id: null, error: "An unknown error occurred" };
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
    return { project_id: null, error: `Invalid project name "${repository}". It must be 1-100 characters long and can contain only alphanumeric characters without spaces.` };
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
      return { project_id: null, error: "An unknown error occurred" };
    }
  }
}


export async function deleteProjectNotices(projectId: string): Promise<void> {
  await prisma.notice.deleteMany({ where: { project_id: projectId } });
  invalidateAllProjectCache();
}

export async function deleteProject(projectId: string): Promise<void> {
  await prisma.project.delete({ where: { id: projectId } });
  invalidateProjectsCache();
  redirect('/projects');
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

  revalidatePath('/projects/[project_id]/edit');
  invalidateAllProjectCache();
}
