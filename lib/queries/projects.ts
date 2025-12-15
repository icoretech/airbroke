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
export async function getProjects(
  currentSearchTerm?: string,
): Promise<Project[]> {
  const whereObject: Prisma.ProjectWhereInput = currentSearchTerm
    ? { name: { contains: currentSearchTerm, mode: "insensitive" } }
    : {};

  return _fetchProjects(whereObject);
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
export async function getProjectById(
  projectId: string,
): Promise<Project | null> {
  return _fetchProjectById(projectId);
}

/**
 * Internal helper to fetch multiple projects from Prisma.
 *
 * @param whereObject - Prisma filter criteria
 * @returns Array of matching Project records
 *
 * @private
 */
async function _fetchProjects(
  whereObject: Prisma.ProjectWhereInput,
): Promise<Project[]> {
  return db.project.findMany({
    where: whereObject,
    orderBy: [{ organization: "asc" }, { name: "asc" }],
  });
}

/**
 * Internal helper to fetch a single project by ID from Prisma.
 *
 * @param projectId - The project ID
 * @returns A matching Project or null
 *
 * @private
 */
async function _fetchProjectById(projectId: string): Promise<Project | null> {
  return db.project.findUnique({
    where: { id: projectId },
  });
}
