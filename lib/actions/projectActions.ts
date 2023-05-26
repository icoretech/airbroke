'use server';

import { prisma } from '@/lib/db';
import { parseGitURL } from '@/lib/parseGitUrl';
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

export async function createProject(data: FormData): Promise<CreateProjectResponse> {
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
  const projectIds = await prisma.project.findMany({
    select: { id: true },
  }).then((projects) => projects.map((project) => project.id));

  // Run revalidatePath on each project ID in parallel
  await Promise.all(
    projectIds.map((id) => revalidatePath(`/projects/${id}/notices`))
  );
  revalidatePath('/projects');
}

export async function deleteProject(projectId: string): Promise<void> {
  await prisma.project.delete({ where: { id: projectId } });
  revalidatePath('/projects');
  redirect('/projects');
}
