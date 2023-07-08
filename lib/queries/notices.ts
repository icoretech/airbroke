import prisma from '@/lib/db';
import type { Project } from '@prisma/client';
import { Notice } from '@prisma/client';
import { unstable_cache } from 'next/cache';

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

// Function to get notices based on provided projectId and search parameters
export async function getNotices(projectId: string, params: NoticeSearchParams, limit?: number): Promise<Notice[]> {
  const { sortDir, sortAttr, filterByEnv, searchQuery } = params;

  const whereObject = {
    project_id: projectId,
    env: filterByEnv,
    ...(searchQuery && {
      kind: {
        contains: searchQuery,
        mode: 'insensitive',
      },
    }),
  };

  const orderByObject = {
    [sortAttr || 'updated_at']: sortDir || 'desc',
  };

  const cachedFetchNotices = unstable_cache(
    () => _fetchNotices(whereObject, orderByObject, limit),
    [projectId, JSON.stringify(whereObject), JSON.stringify(orderByObject), JSON.stringify(limit)],
    { revalidate: 60, tags: [`project_${projectId}_notices`] }
  );
  const cachedData = await cachedFetchNotices();

  return cachedData;
}

// Function to fetch a single notice by ID
export async function getNoticeById(noticeId: string): Promise<NoticeWithProject | null> {
  const cachedFetchNotice = unstable_cache(() => _fetchNoticeById(noticeId), [noticeId], {
    revalidate: 60,
    tags: [`notice_${noticeId}`],
  });
  const cachedData = await cachedFetchNotice();

  return cachedData;
}

// Function to get all notice IDs for a given projectId
export async function getNoticeIdsByProjectId(projectId: string): Promise<string[]> {
  const notices = await prisma.notice.findMany({
    where: { project_id: projectId },
    select: { id: true },
  });

  return notices.map((notice) => notice.id);
}

export async function getNoticeEnvs(projectId: string): Promise<string[]> {
  const notices = await prisma.notice.findMany({
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

  return notices.map((notice) => notice.env);
}

async function _fetchNotices(whereObject?: any, orderByObject?: any, limit?: number): Promise<Notice[]> {
  return prisma.notice.findMany({
    where: whereObject,
    orderBy: orderByObject,
    take: limit,
  });
}

async function _fetchNoticeById(noticeId: string): Promise<NoticeWithProject | null> {
  return prisma.notice.findUnique({
    where: { id: noticeId },
    include: { project: true },
  });
}
