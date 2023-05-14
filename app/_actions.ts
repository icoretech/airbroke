'use server';

import { prisma } from '@/lib/db';
import generateUniqueProjectKey from '@/lib/keygen';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

interface CreateProjectResponse {
  project_id: bigint | null;
  error: string | null;
}

function validateProjectName(name: string): boolean {
  const nameRegex = /^[a-zA-Z0-9]{1,36}$/;
  return nameRegex.test(name);
}

export async function createProject(data: FormData): Promise<CreateProjectResponse> {
  const name = data.get('name') as string;
  if (!validateProjectName(name)) {
    return { project_id: null, error: "Invalid project name. It must be 1-36 characters long and can contain only alphanumeric characters without spaces." };
  }

  try {
    const project = await prisma.project.create({
      data: {
        api_key: await generateUniqueProjectKey(prisma),
        name,
      },
    });
    revalidatePath(`/projects/${project.id}`);
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

export async function deleteProjectNotices(projectId: bigint): Promise<void> {
  await prisma.notice.deleteMany({ where: { project_id: projectId } });
  const projectIds = await prisma.project.findMany({
    select: { id: true },
  }).then((projects) => projects.map((project) => project.id));

  // Run revalidatePath on each project ID in parallel
  await Promise.all(
    projectIds.map((id) => revalidatePath(`/projects/${id}`))
  );
}

export async function deleteProject(projectId: bigint): Promise<void> {
  await prisma.project.delete({ where: { id: projectId } });
  revalidatePath('/projects');
  redirect('/projects');
}
