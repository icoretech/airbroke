// lib/queries/notices.ts

import { prisma } from '@/lib/db';
import type { Notice, Prisma, Project } from '@prisma/client';

export type SortAttribute = 'env' | 'kind' | 'updated_at' | 'seen_count' | undefined;
export type SortDirection = 'asc' | 'desc' | undefined;

export type NoticeSearchParams = {
  sortDir?: SortDirection;
  sortAttr?: SortAttribute;
  filterByEnv?: string;
  searchQuery?: string;
};

interface NoticeWithProject extends Notice {
  project: Project;
}

/**
 * Retrieves a list of Notice records for a given project,
 * optionally filtered by environment or a search query, and sorted by the specified field.
 *
 * @param projectId - The ID of the project
 * @param params - Search and sorting parameters
 * @param limit - Optional limit on number of records
 * @returns Promise resolving to a list of Notice objects
 */
export async function getNotices(projectId: string, params: NoticeSearchParams, limit?: number): Promise<Notice[]> {
  const { sortDir = 'desc', sortAttr = 'updated_at', filterByEnv, searchQuery } = params;

  // Conditionally build the where object
  const whereObject: Prisma.NoticeWhereInput = {
    project_id: projectId,
    ...(filterByEnv !== undefined && filterByEnv !== '' && { env: filterByEnv }),
    ...(searchQuery && {
      kind: { contains: searchQuery, mode: 'insensitive' },
    }),
  };

  const orderByObject: Prisma.NoticeOrderByWithRelationInput = {
    [sortAttr]: sortDir,
  };

  return _fetchNotices(whereObject, orderByObject, limit);
}

/**
 * Returns the total number of Notices for a given project.
 *
 * @param projectId - The ID of the project
 * @returns Promise resolving to the count of matching notices
 */
export async function getNoticesCountByProjectId(projectId: string): Promise<number> {
  return prisma.notice.count({
    where: {
      project_id: projectId,
    },
  });
}

/**
 * Retrieves a single Notice by its ID, including the associated Project.
 *
 * @param noticeId - The unique ID of the notice
 * @returns Promise resolving to the Notice record (with project) or null if not found
 */
export async function getNoticeById(noticeId: string): Promise<NoticeWithProject | null> {
  return _fetchNoticeById(noticeId);
}

/**
 * Retrieves all Notice IDs that belong to a given project.
 *
 * @param projectId - The ID of the project
 * @returns Promise resolving to an array of Notice IDs
 */
export async function getNoticeIdsByProjectId(projectId: string): Promise<string[]> {
  return _fetchNoticeIdsByProjectId(projectId);
}

/**
 * Retrieves all distinct environment names for Notices in a given project.
 *
 * @param projectId - The ID of the project
 * @returns Promise resolving to an array of distinct environment strings
 */
export async function getNoticeEnvs(projectId: string): Promise<string[]> {
  return _fetchNoticeEnvs(projectId);
}

// -- Private helper functions --

/**
 * Internal helper to fetch multiple Notice records.
 */
async function _fetchNotices(
  whereObject: Prisma.NoticeWhereInput,
  orderByObject: Prisma.NoticeOrderByWithRelationInput,
  limit?: number
): Promise<Notice[]> {
  return prisma.notice.findMany({
    where: whereObject,
    orderBy: orderByObject,
    ...(limit !== undefined && { take: limit }),
  });
}

/**
 * Internal helper to fetch one Notice by ID, including its Project.
 */
async function _fetchNoticeById(noticeId: string): Promise<NoticeWithProject | null> {
  return prisma.notice.findUnique({
    where: { id: noticeId },
    include: { project: true },
  });
}

/**
 * Internal helper to fetch all Notice IDs for a project.
 */
async function _fetchNoticeIdsByProjectId(projectId: string): Promise<string[]> {
  const notices = await prisma.notice.findMany({
    where: { project_id: projectId },
    select: { id: true },
  });
  return notices.map((notice) => notice.id);
}

/**
 * Internal helper to fetch distinct environment values for a project.
 */
async function _fetchNoticeEnvs(projectId: string): Promise<string[]> {
  const result = await prisma.notice.findMany({
    where: {
      project_id: projectId,
    },
    select: {
      env: true,
    },
    orderBy: {
      env: 'asc',
    },
    distinct: ['env'],
  });

  return result.map((n) => n.env);
}
