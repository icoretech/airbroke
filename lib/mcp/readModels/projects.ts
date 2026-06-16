import { db } from "@/lib/db";
import {
  PROJECT_SUMMARY_SELECT,
  projectNotFound,
  resolveProjectReferenceOrThrow,
} from "@/lib/mcp/readModels/projectResolution";
import type { GetProjectArgs, ListProjectsArgs } from "@/lib/mcp/tools/schemas";
import type { Prisma } from "@/prisma/generated/client";

export async function listProjectsReadModel(args: ListProjectsArgs) {
  const where: Prisma.ProjectWhereInput = {};
  if (args.search) {
    where.OR = [
      { name: { contains: args.search, mode: "insensitive" } },
      { organization: { contains: args.search, mode: "insensitive" } },
    ];
  }
  if (args.organization) {
    where.organization = {
      contains: args.organization,
      mode: "insensitive",
    };
  }
  if (!args.includePaused) {
    where.paused = false;
  }

  const projects = await db.project.findMany({
    where,
    orderBy: [{ organization: "asc" }, { name: "asc" }],
    take: args.limit,
    skip: args.offset,
    select: PROJECT_SUMMARY_SELECT,
  });

  return { projects };
}

export async function getProjectReadModel(args: GetProjectArgs) {
  const resolution = await resolveProjectReferenceOrThrow(args.project_id);

  const project = await db.project.findUnique({
    where: { id: resolution.project.id },
    select: {
      id: true,
      name: true,
      organization: true,
      paused: true,
      notices_count: true,
      repo_provider: true,
      repo_branch: true,
      repo_issue_tracker: true,
      repo_url: true,
      created_at: true,
      updated_at: true,
    },
  });

  if (!project) {
    throw projectNotFound(resolution.project.id);
  }

  return {
    project,
    requested_project_id: args.project_id,
    matched_by: resolution.matched_by,
  };
}
