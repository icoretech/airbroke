// lib/queries/projects.ts

import { db } from "@/lib/db";
import "server-only";

import type { Prisma, Project } from "@/prisma/generated/client";

/**
 * A record that groups projects by organization name.
 */
type GroupedProjects = Record<string, Project[]>;

/**
 * Retrieves a list of projects. If `currentSearchTerm` is provided,
 * the returned list is filtered by a case-insensitive partial match on the project's name.
 *
 * @param currentSearchTerm - Optional substring to filter projects by name
 * @returns Promise resolving to a list of matching projects
 */
export function getProjects(currentSearchTerm?: string): Promise<Project[]> {
  const whereObject: Prisma.ProjectWhereInput = currentSearchTerm
    ? { name: { contains: currentSearchTerm, mode: "insensitive" } }
    : {};

  return db.project.findMany({
    where: whereObject,
    orderBy: [{ organization: "asc" }, { name: "asc" }],
  });
}

/**
 * Retrieves all projects and returns them grouped by their `organization` field.
 *
 * @returns Promise resolving to an object keyed by organization
 */
export async function getProjectsGroupedByOrganization(): Promise<GroupedProjects> {
  const projects = await getProjects();
  const groupedProjects: GroupedProjects = {};

  for (const project of projects) {
    const { organization } = project;
    if (!groupedProjects[organization]) {
      groupedProjects[organization] = [];
    }
    groupedProjects[organization].push(project);
  }

  return groupedProjects;
}

/**
 * Retrieves a single project by its ID.
 *
 * @param projectId - The unique project ID (string)
 * @returns Promise resolving to the Project, or null if not found
 */
export function getProjectById(projectId: string): Promise<Project | null> {
  return db.project.findUnique({
    where: { id: projectId },
  });
}
