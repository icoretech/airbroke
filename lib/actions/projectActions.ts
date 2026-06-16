// lib/actions/projectActions.ts

"use server";

import { refresh, updateTag } from "next/cache";
import { redirect, unstable_rethrow } from "next/navigation";
import { z } from "zod";
import { requireAuth } from "@/lib/actions/requireAuth";
import {
  revalidateProjectShellPaths,
  revalidateProjectsSidebarPaths,
} from "@/lib/actions/revalidateProjectShellPaths";
import { getProjectActivityTag } from "@/lib/cache/projectActivity";
import { db } from "@/lib/db";
import { parseGitURL } from "@/lib/gitProvider";
import type { Project } from "@/prisma/generated/client";

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

export async function createProject(
  _prevState: ProjectState,
  formData: FormData,
): Promise<ProjectState> {
  await requireAuth();

  // Convert FormData to a plain record of strings
  const dataObj: Record<string, string> = {};
  formData.forEach((val, key) => {
    dataObj[key] = val.toString();
  });

  const repository_url = dataObj.repository_url?.trim() || "";

  // If there's no repository_url, create a random project name
  if (!repository_url) {
    const randomNum = Math.floor(Math.random() * 10000);
    let projectId: string;

    try {
      const project = await db.project.create({
        data: { name: `project${randomNum}` },
      });
      projectId = project.id;
    } catch (err) {
      unstable_rethrow(err);
      return { error: (err as Error).message ?? "Unknown error", lastUrl: "" };
    }

    redirect(`/projects/${projectId}/edit`);
  }

  // If we do have a repository_url => parse & validate
  const parsed = parseGitURL(repository_url);
  if (!parsed) {
    return { error: "Invalid repository URL format.", lastUrl: repository_url };
  }

  // Zod schema for the parseGitURL results
  const parseSchema = z.object({
    provider: z.string().min(1),
    organization: z.string().min(1),
    repository: z
      .string()
      .regex(
        repoNameRegex,
        "Invalid project name. Must be 1-100 chars (no spaces).",
      ),
  });

  // Run the schema check
  const parseResult = parseSchema.safeParse(parsed);
  if (!parseResult.success) {
    // E.g. invalid repository format
    const firstIssue = parseResult.error.issues[0];
    return {
      error: firstIssue?.message || "Invalid repository name or format.",
      lastUrl: repository_url,
    };
  }

  // If valid, we proceed
  const { provider, organization, repository } = parseResult.data;

  // Attempt to create the project in the DB
  let newProjectId: string;
  try {
    const newProject = await db.project.create({
      data: {
        name: repository,
        organization,
        repo_provider: provider,
        repo_url: repository_url,
        repo_branch: "main",
        repo_issue_tracker: repository_url,
      },
    });
    newProjectId = newProject.id;
  } catch (err) {
    unstable_rethrow(err);
    return {
      error: (err as Error).message ?? "Unknown error",
      lastUrl: repository_url,
    };
  }

  redirect(`/projects/${newProjectId}/edit`);
}

export async function updateProject(
  _prevState: ProjectResponse,
  formData: FormData,
): Promise<ProjectResponse> {
  await requireAuth();

  // Define the shape of the data for updating a project.
  const updateProjectSchema = z
    .object({
      // Accept any non-empty string (DB uses string IDs; older records may not be UUIDs)
      projectId: z.string().min(1, "Invalid project ID"),
      organization: z.string().min(1, "organization is required"),
      name: z.string().min(1, "name is required"),
      repo_provider_api_key: z.string().optional(),
      repo_provider_api_secret: z.string().optional(),
      repo_branch: z.string().optional(),
      repo_issue_tracker: z
        .string()
        .optional()
        .or(z.literal(""))
        .transform((val) => (val === "" ? undefined : val))
        .refine((val) => {
          if (!val) return true;
          try {
            new URL(val);
            return true;
          } catch {
            return false;
          }
        }, "repo_issue_tracker must be a valid URL"),
      repo_url: z
        .string()
        .optional()
        .or(z.literal(""))
        .transform((val) => (val === "" ? undefined : val))
        .refine((val) => {
          if (!val) return true;
          try {
            new URL(val);
            return true;
          } catch {
            return false;
          }
        }, "repo_url must be a valid URL"),
    })
    // If one credential is provided, ensure the other is too
    .refine(
      (data) =>
        !(
          (data.repo_provider_api_key && !data.repo_provider_api_secret) ||
          (!data.repo_provider_api_key && data.repo_provider_api_secret)
        ),
      {
        message:
          "Both repo_provider_api_key and repo_provider_api_secret must be provided if one is present",
        path: ["repo_provider_api_key", "repo_provider_api_secret"],
      },
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
    await db.project.update({
      where: { id: projectId },
      data: dataForPrisma,
    });
  } catch (err) {
    // Could put a "global" error if DB fails
    const message = (err as Error)?.message || "Database error";
    return { error: message };
  }

  // Invalidate and refresh pages that display project data, then redirect back to Edit tab
  revalidateProjectShellPaths(projectId);
  redirect(`/projects/${projectId}`);
}

export async function toggleProjectPausedStatus(projectId: string) {
  await requireAuth();

  const project = await db.project.findUnique({ where: { id: projectId } });
  if (!project) {
    throw new Error("Project not found.");
  }

  await db.project.update({
    where: { id: projectId },
    data: { paused: !project.paused },
  });

  // Cache Components mode: ensure project pages and sidebar reflect changes.
  revalidateProjectShellPaths(projectId);
}

export async function deleteProjectNotices(projectId: string) {
  await requireAuth();

  await db.notice.deleteMany({ where: { project_id: projectId } });

  updateTag(getProjectActivityTag(projectId));
  revalidateProjectShellPaths(projectId);
  refresh();
}

export async function deleteProject(projectId: string) {
  await requireAuth();

  await db.project.delete({ where: { id: projectId } });

  revalidateProjectsSidebarPaths();
  redirect("/projects");
}
