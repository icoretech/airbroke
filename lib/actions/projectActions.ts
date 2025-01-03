// lib/actions/projectActions.ts

'use server';

import { prisma } from '@/lib/db';
import { parseGitURL } from '@/lib/gitProvider';
import { unstable_cacheLife as cacheLife } from 'next/cache';
import { redirect, unstable_rethrow } from 'next/navigation';
import { z } from 'zod';

import type { Project } from '@prisma/client';

export interface ProjectState {
  error: string | null;
  lastUrl: string;
}

export interface ProjectResponse {
  error?: string | null;
  errors?: {
    [K in keyof Project]?: string[];
  };
}

// REGEX for validating the repository name (1-100 chars, no spaces, only [a-zA-Z0-9-_.])
const repoNameRegex = /^[a-zA-Z0-9._-]{1,100}$/;

export async function createProject(prevState: ProjectState, formData: FormData): Promise<ProjectState> {
  // Convert FormData to a plain record of strings
  const dataObj: Record<string, string> = {};
  formData.forEach((val, key) => {
    dataObj[key] = val.toString();
  });

  const repository_url = dataObj.repository_url?.trim() || '';

  // If there's no repository_url, create a random project name
  if (!repository_url) {
    const randomNum = Math.floor(Math.random() * 10000);

    try {
      const project = await prisma.project.create({ data: { name: `project${randomNum}` } });
      redirect(`/projects/${project.id}/edit?tab=integrations`);
    } catch (err) {
      unstable_rethrow(err);
      return { error: (err as Error).message ?? 'Unknown error', lastUrl: '' };
    }
  }

  // If we do have a repository_url => parse & validate
  const parsed = parseGitURL(repository_url);
  if (!parsed) {
    return { error: 'Invalid repository URL format.', lastUrl: repository_url };
  }

  // Zod schema for the parseGitURL results
  const parseSchema = z.object({
    provider: z.string().min(1),
    organization: z.string().min(1),
    repository: z.string().regex(repoNameRegex, 'Invalid project name. Must be 1-100 chars (no spaces).'),
  });

  // Run the schema check
  const parseResult = parseSchema.safeParse(parsed);
  if (!parseResult.success) {
    // E.g. invalid repository format
    const firstIssue = parseResult.error.issues[0];
    return {
      error: firstIssue?.message || 'Invalid repository name or format.',
      lastUrl: repository_url,
    };
  }

  // If valid, we proceed
  const { provider, organization, repository } = parseResult.data;

  // Attempt to create the project in the DB
  try {
    const newProject = await prisma.project.create({
      data: {
        name: repository,
        organization,
        repo_provider: provider,
        repo_url: repository_url,
        repo_branch: 'main',
        repo_issue_tracker: repository_url,
      },
    });
    redirect(`/projects/${newProject.id}/edit?tab=integrations`);
  } catch (err) {
    unstable_rethrow(err);
    return { error: (err as Error).message ?? 'Unknown error', lastUrl: repository_url };
  }
}

export async function updateProject(prevState: ProjectResponse, formData: FormData): Promise<ProjectResponse> {
  // Define the shape of the data for updating a project.
  const updateProjectSchema = z
    .object({
      projectId: z.string().uuid('Invalid project ID'),
      organization: z.string().min(1, 'organization is required'),
      name: z.string().min(1, 'name is required'),
      repo_provider_api_key: z.string().optional(),
      repo_provider_api_secret: z.string().optional(),
      repo_branch: z.string().optional(),
      repo_issue_tracker: z
        .string()
        .optional()
        .or(z.literal(''))
        .transform((val) => (val === '' ? undefined : val))
        .refine((val) => {
          if (!val) return true;
          try {
            new URL(val);
            return true;
          } catch {
            return false;
          }
        }, 'repo_issue_tracker must be a valid URL'),
      repo_url: z
        .string()
        .optional()
        .or(z.literal(''))
        .transform((val) => (val === '' ? undefined : val))
        .refine((val) => {
          if (!val) return true;
          try {
            new URL(val);
            return true;
          } catch {
            return false;
          }
        }, 'repo_url must be a valid URL'),
    })
    // If one credential is provided, ensure the other is too
    .refine(
      (data) =>
        !(
          (data.repo_provider_api_key && !data.repo_provider_api_secret) ||
          (!data.repo_provider_api_key && data.repo_provider_api_secret)
        ),
      {
        message: 'Both repo_provider_api_key and repo_provider_api_secret must be provided if one is present',
        path: ['repo_provider_api_key', 'repo_provider_api_secret'],
      }
    );

  const dataObj: Record<string, string> = {};
  formData.forEach((val, key) => {
    dataObj[key] = val.toString();
  });

  const parsed = updateProjectSchema.safeParse(dataObj);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    return { errors: fieldErrors };
  }

  const {
    projectId,
    name,
    organization,
    repo_provider_api_key,
    repo_provider_api_secret,
    repo_branch,
    repo_issue_tracker,
    repo_url,
  } = parsed.data;

  const dataForPrisma: Record<string, unknown> = {};

  if (name !== undefined) dataForPrisma.name = name;
  if (organization !== undefined) dataForPrisma.organization = organization;
  if (repo_provider_api_key !== undefined) {
    dataForPrisma.repo_provider_api_key = repo_provider_api_key;
  }
  if (repo_provider_api_secret !== undefined) {
    dataForPrisma.repo_provider_api_secret = repo_provider_api_secret;
  }
  if (repo_branch !== undefined) dataForPrisma.repo_branch = repo_branch;
  if (repo_issue_tracker !== undefined) {
    dataForPrisma.repo_issue_tracker = repo_issue_tracker;
  }
  if (repo_url !== undefined) dataForPrisma.repo_url = repo_url;

  try {
    await prisma.project.update({
      where: { id: projectId },
      data: dataForPrisma,
    });
  } catch (err) {
    // Could put a "global" error if DB fails
    const message = (err as Error)?.message || 'Database error';
    return { error: message };
  }

  // success: no errors
  return {};
}

export async function toggleProjectPausedStatus(projectId: string) {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) {
    throw new Error('Project not found.');
  }

  await prisma.project.update({
    where: { id: projectId },
    data: { paused: !project.paused },
  });
}

export async function deleteProjectNotices(projectId: string) {
  await prisma.notice.deleteMany({ where: { project_id: projectId } });
}

export async function deleteProject(projectId: string) {
  await prisma.project.delete({ where: { id: projectId } });
}

export async function cachedProjectChartOccurrencesData(projectId: string) {
  'use cache';
  cacheLife('hours');

  const endDate = new Date();
  const startDate = new Date(endDate.getTime() - 14 * 24 * 60 * 60 * 1000);

  const occurrenceSummaries = await prisma.hourlyOccurrence.groupBy({
    by: ['interval_start'],
    where: {
      occurrence: {
        notice: { project_id: projectId },
      },
      interval_start: { gte: startDate },
      interval_end: { lte: endDate },
    },
    _sum: { count: true },
    orderBy: { interval_start: 'asc' },
  });

  const occurrenceCountByDate: Record<string, number> = {};
  occurrenceSummaries.forEach((summary) => {
    const hourStamp = summary.interval_start.toISOString().slice(0, 13);
    occurrenceCountByDate[hourStamp] = Number(summary._sum.count);
  });

  const data = [];
  const cursorDate = new Date(startDate);
  while (cursorDate <= endDate) {
    const stamp = cursorDate.toISOString().slice(0, 13);
    const count = occurrenceCountByDate[stamp] || 0;
    data.push({ date: stamp, count });
    cursorDate.setHours(cursorDate.getHours() + 1);
  }

  return data;
}
