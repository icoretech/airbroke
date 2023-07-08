import { customCache } from '@/lib/cache';
import prisma from '@/lib/db';
import type { Notice, Occurrence, Project } from '@prisma/client';

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

// Function to get occurrences based on provided search parameters
export async function getOccurrences(
  noticeId: string,
  params: OccurrenceSearchParams
): Promise<OccurrenceWithNotice[]> {
  const { sortDir, sortAttr, searchQuery, limit } = params;

  const whereObject = {
    notice_id: noticeId,
    ...(searchQuery && {
      message: {
        contains: searchQuery,
        mode: 'insensitive',
      },
    }),
  };

  const orderByObject = {
    [sortAttr || 'updated_at']: sortDir || 'desc',
  };

  const cachedData = await customCache(
    () => _fetchOccurrences(whereObject, orderByObject, limit),
    ['occurrences', JSON.stringify(whereObject), JSON.stringify(orderByObject), limit ? limit.toString() : '100'],
    {
      revalidate: 60,
      tags: [`occurrences_${noticeId}`, 'occurrences'],
    }
  );

  return cachedData;
}

// Function to fetch a single occurrence by ID
export async function getOccurrenceById(occurrenceId: string): Promise<OccurrenceWithNoticeAndProject | null> {
  const cachedData = await customCache(() => _fetchOccurrenceById(occurrenceId), ['occurrence', occurrenceId], {
    revalidate: 60,
    tags: [`occurrence_${occurrenceId}`],
  });

  return cachedData;
}

// Function to extract all occurrence IDs for an array of notice IDs
export async function getOccurrenceIdsByNoticeIds(noticeIds: string[]): Promise<string[]> {
  const result = await prisma.occurrence.findMany({
    where: { notice_id: { in: noticeIds } },
    select: { id: true },
  });
  return result.map((occurrence) => occurrence.id);
}

export async function getHourlyOccurrenceRateForLast14Days(projectId: string): Promise<number> {
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
}

async function _fetchOccurrences(
  whereObject?: any,
  orderByObject?: any,
  limit?: number
): Promise<OccurrenceWithNotice[]> {
  const result = await prisma.occurrence.findMany({
    where: whereObject,
    orderBy: orderByObject,
    take: limit || 100,
    include: {
      notice: true,
    },
  });
  return result;
}

async function _fetchOccurrenceById(occurrenceId: string): Promise<OccurrenceWithNoticeAndProject | null> {
  const result = await prisma.occurrence.findUnique({
    where: { id: occurrenceId },
    include: {
      notice: {
        include: {
          project: true,
        },
      },
    },
  });
  return result;
}
