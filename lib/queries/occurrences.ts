import { prisma } from '@/lib/db';
import type { Notice } from '@prisma/client';
import { Occurrence, Project } from '@prisma/client';
import { cache } from 'react';

export type SortAttribute = 'seen_count' | 'updated_at' | undefined;
export type SortDirection = 'asc' | 'desc' | undefined;

export type OccurrenceSearchParams = {
  sortDir?: SortDirection;
  sortAttr?: SortAttribute;
  searchQuery?: string | undefined;
  limit?: number | undefined;
};

interface OccurrenceWithNotice extends Occurrence {
  notice: Notice;
}

interface OccurrenceWithNoticeAndProject extends Occurrence {
  notice: Notice & { project: Project };
}

// Cached function to fetch occurrences from the database
const fetchOccurrences = cache(async (whereObject?: any, orderByObject?: any, limit?: number): Promise<OccurrenceWithNotice[]> => {
  const results: OccurrenceWithNotice[] = await prisma.occurrence.findMany({
    where: whereObject,
    orderBy: orderByObject,
    take: limit,
    include: {
      notice: true,
    },
  });
  return results;
});

// Function to get occurrences based on provided search parameters
export async function getOccurrences(noticeId: string, params: OccurrenceSearchParams): Promise<OccurrenceWithNotice[]> {
  const { sortDir, sortAttr, searchQuery, limit } = params;

  const whereObject = {
    notice_id: noticeId,
    ...(searchQuery && {
      message: {
        contains: searchQuery,
        mode: 'insensitive'
      }
    })
  };

  const orderByObject = {
    [sortAttr || 'updated_at']: sortDir || 'desc',
  };

  const occurrences = await fetchOccurrences(whereObject, orderByObject, limit);

  return occurrences;
}

// Cached function to fetch a single occurrence by ID
const fetchOccurrenceById = cache(async (occurrenceId: string): Promise<OccurrenceWithNoticeAndProject | null> => {
  const occurrence = await prisma.occurrence.findUnique({
    where: { id: occurrenceId },
    include: {
      notice: {
        include: {
          project: true,
        },
      },
    },
  });
  return occurrence;
});

// Function to fetch a single occurrence by ID
export const getOccurrenceById = async (occurrenceId: string): Promise<OccurrenceWithNoticeAndProject | null> => {
  return fetchOccurrenceById(occurrenceId);
};
