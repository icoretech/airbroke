// lib/queries/occurrences.ts

import { db } from "@/lib/db";
import type {
  Notice,
  Occurrence,
  Prisma,
  Project,
} from "@/prisma/generated/client";

type SortAttribute = "seen_count" | "updated_at" | undefined;
type SortDirection = "asc" | "desc" | undefined;

export type OccurrenceSearchParams = {
  sortDir?: SortDirection;
  sortAttr?: SortAttribute;
  searchQuery?: string;
  limit?: number;
};

/**
 * An Occurrence that also includes its parent Notice.
 */
interface OccurrenceWithNotice extends Occurrence {
  notice: Notice;
}

/**
 * An Occurrence that includes its parent Notice,
 * and that Notice's associated Project.
 */
interface OccurrenceWithNoticeAndProject extends Occurrence {
  notice: Notice & { project: Project };
}

/**
 * Retrieves a list of Occurrences belonging to a specific Notice,
 * optionally filtered and sorted by params.
 *
 * @param noticeId - The ID of the notice
 * @param params - Search and sorting options
 * @returns Promise resolving to a list of Occurrences (with included Notice)
 */
export async function getOccurrences(
  noticeId: string,
  params: OccurrenceSearchParams,
): Promise<OccurrenceWithNotice[]> {
  const {
    sortDir = "desc",
    sortAttr = "updated_at",
    searchQuery,
    limit,
  } = params;

  const whereObject: Prisma.OccurrenceWhereInput = {
    notice_id: noticeId,
    ...(searchQuery
      ? {
          message: {
            contains: searchQuery,
            mode: "insensitive",
          },
        }
      : {}),
  };

  const orderByObject: Prisma.OccurrenceOrderByWithRelationInput = {
    [sortAttr]: sortDir,
  };

  return _fetchOccurrences(whereObject, orderByObject, limit);
}

/**
 * Returns the total number of Occurrences for a given Project ID, based on related Notice records.
 *
 * @param projectId - The ID of the project
 * @returns Promise resolving to the count of matching occurrences
 */
export async function getOccurrencesCountByProjectId(
  projectId: string,
): Promise<number> {
  return db.occurrence.count({
    where: {
      notice: {
        project_id: projectId,
      },
    },
  });
}

/**
 * Retrieves a single Occurrence by ID, including its parent Notice and Project.
 *
 * @param occurrenceId - The ID of the occurrence
 * @returns Promise resolving to the Occurrence (with Notice & Project) or null if not found
 */
export async function getOccurrenceById(
  occurrenceId: string,
): Promise<OccurrenceWithNoticeAndProject | null> {
  return _fetchOccurrenceById(occurrenceId);
}

/**
 * Returns the average hourly occurrence rate over the last 14 days
 * for a given Project.
 *
 * @param projectId - The ID of the project
 * @returns Promise resolving to an integer (rounded) of occurrences per hour
 */
export async function getHourlyOccurrenceRateForLast14Days(
  projectId: string,
): Promise<number> {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 14);

  const occurrences = await db.hourlyOccurrence.aggregate({
    _sum: {
      count: true,
    },
    where: {
      occurrence: {
        notice: {
          project_id: projectId,
        },
      },
      interval_start: {
        gte: startDate,
      },
      interval_end: {
        lte: endDate,
      },
    },
  });

  const totalOccurrences = occurrences._sum.count ?? 0;
  const totalHours = 14 * 24; // 14 days
  const rate = Number(totalOccurrences) / totalHours;

  return Math.round(rate);
}

/**
 * Internal helper to fetch multiple Occurrences with Notice included.
 *
 * @private
 */
async function _fetchOccurrences(
  whereObject: Prisma.OccurrenceWhereInput,
  orderByObject: Prisma.OccurrenceOrderByWithRelationInput,
  limit?: number,
): Promise<OccurrenceWithNotice[]> {
  return db.occurrence.findMany({
    where: whereObject,
    orderBy: orderByObject,
    take: limit ?? 100,
    include: {
      notice: true,
    },
  });
}

/**
 * Internal helper to fetch a single Occurrence by ID, including Notice and Project.
 *
 * @private
 */
async function _fetchOccurrenceById(
  occurrenceId: string,
): Promise<OccurrenceWithNoticeAndProject | null> {
  return db.occurrence.findUnique({
    where: { id: occurrenceId },
    include: {
      notice: {
        include: {
          project: true,
        },
      },
    },
  });
}
