import { prisma } from '@/lib/db';
import type { Notice, Occurrence, Project } from '@prisma/client';
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

// Function to extract all occurrence IDs for an array of notice IDs
export const getOccurrenceIdsByNoticeIds = async (noticeIds: string[]): Promise<string[]> => {
  const occurrences = await prisma.occurrence.findMany({
    where: { notice_id: { in: noticeIds } },
    select: { id: true },
  });
  return occurrences.map((occurrence) => occurrence.id);
};

export const getHourlyOccurrenceRateForLast14Days = async (projectId: string): Promise<number> => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 14);

  const occurrences = await prisma.hourlyOccurrence.aggregate({
    _sum: {
      count: true,
    },
    where: {
      AND: [
        {
          occurrence: {
            notice: {
              project_id: projectId,
            },
          },
        },
        {
          interval_start: {
            gte: startDate,
          },
        },
        {
          interval_end: {
            lte: endDate,
          },
        },
      ],
    },
  });

  const totalOccurrences = occurrences._sum.count ?? 0;
  const totalHours = 14 * 24; // 14 days times 24 hours/day

  // Convert BigInt to Number before division operation
  const rate = Number(totalOccurrences) / totalHours;

  // Round to the nearest integer
  return Math.round(rate);
};
