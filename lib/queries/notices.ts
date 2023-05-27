import { prisma } from '@/lib/db';
import { Notice } from '@prisma/client';
import { cache } from 'react';
import 'server-only';

export type SortAttribute = 'env' | 'kind' | 'updated_at' | 'seen_count' | undefined;
export type SortDirection = 'asc' | 'desc' | undefined;

export type NoticeSearchParams = {
  sortDir?: SortDirection;
  sortAttr?: SortAttribute;
  filterByEnv?: string | undefined;
  searchQuery?: string | undefined;
};

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
const fetchNoticeById = cache(async (noticeId: string) => {
  const notice = await prisma.notice.findUnique({
    where: { id: noticeId },
  });
  return notice;
});

// Function to fetch a single notice by ID
export const getNoticeById = async (noticeId: string): Promise<Notice | null> => {
  return fetchNoticeById(noticeId);
};
