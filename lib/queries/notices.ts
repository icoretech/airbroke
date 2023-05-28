import { prisma } from '@/lib/db';
import type { Project } from '@prisma/client';
import { Notice } from '@prisma/client';
import { cache } from 'react';

export type SortAttribute = 'env' | 'kind' | 'updated_at' | 'seen_count' | undefined;
export type SortDirection = 'asc' | 'desc' | undefined;

export type NoticeSearchParams = {
  sortDir?: SortDirection;
  sortAttr?: SortAttribute;
  filterByEnv?: string | undefined;
  searchQuery?: string | undefined;
};

interface NoticeWithProject extends Notice {
  project: Project;
}

// Cached function to fetch notices from the database
const fetchNotices = cache(async (whereObject?: any, orderByObject?: any) => {
  const results = await prisma.notice.findMany({
    where: whereObject,
    orderBy: orderByObject,
  });
  return results;
});

// Function to get notices based on provided search parameters
export async function getNotices(projectId: string, params: NoticeSearchParams): Promise<Notice[]> {
  const { sortDir, sortAttr, filterByEnv, searchQuery } = params;

  const whereObject = {
    project_id: projectId,
    env: filterByEnv,
    ...(searchQuery && {
      kind: {
        contains: searchQuery,
        mode: 'insensitive'
      }
    })
  };

  const orderByObject = {
    [sortAttr || 'updated_at']: sortDir || 'desc',
  };

  const notices = await fetchNotices(whereObject, orderByObject);

  return notices;
}

// Cached function to fetch a single notice by ID
const fetchNoticeById = cache(async (noticeId: string): Promise<NoticeWithProject | null> => {
  const notice = await prisma.notice.findUnique({
    where: { id: noticeId },
    include: { project: true },
  });
  return notice;
});

// Function to fetch a single notice by ID
export const getNoticeById = async (noticeId: string): Promise<NoticeWithProject | null> => {
  return fetchNoticeById(noticeId);
};

// Function to get all notice IDs for a given projectId
export const getNoticeIdsByProjectId = async (projectId: string): Promise<string[]> => {
  const notices = await prisma.notice.findMany({
    where: { project_id: projectId },
    select: { id: true },
  });
  return notices.map((notice) => notice.id);
};
