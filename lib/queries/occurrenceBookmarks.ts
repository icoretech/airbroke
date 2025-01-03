// lib/queries/occurrenceBookmarks.ts

import { prisma } from '@/lib/db';
import type { Notice, Occurrence, OccurrenceBookmark, Prisma, Project } from '@prisma/client';

export interface OccurrenceBookmarkWithAssociations extends OccurrenceBookmark {
  occurrence: Occurrence & { notice: Notice & { project: Project } };
}

/**
 * Retrieves a list of occurrence bookmarks for a given user,
 * optionally filtered by a search query that matches the occurrence message or notice kind.
 *
 * @param userId - The user ID
 * @param searchQuery - Optional partial string to match occurrence messages or notice kind
 * @returns Promise resolving to a list of bookmarks
 */
export async function getOccurrenceBookmarks(
  userId?: string,
  searchQuery?: string
): Promise<OccurrenceBookmarkWithAssociations[]> {
  if (!userId) {
    return [];
  }

  const whereObject: Prisma.OccurrenceBookmarkWhereInput = {
    user_id: userId,
    ...(searchQuery && {
      OR: [
        {
          occurrence: {
            message: {
              contains: searchQuery,
              mode: 'insensitive',
            },
          },
        },
        {
          occurrence: {
            notice: {
              kind: {
                contains: searchQuery,
                mode: 'insensitive',
              },
            },
          },
        },
      ],
    }),
  };

  return _fetchOccurrenceBookmarks(whereObject);
}

/**
 * Checks whether an occurrence bookmark exists for the given user and occurrence IDs.
 *
 * @param userId - The user's ID
 * @param occurrenceId - The occurrence's ID
 * @returns Promise resolving to a boolean indicating whether a bookmark exists
 */
export async function checkOccurrenceBookmarkExistence(
  userId: string | undefined,
  occurrenceId: string
): Promise<boolean> {
  if (!userId || !occurrenceId) {
    return false;
  }

  const bookmark = await prisma.occurrenceBookmark.findFirst({
    where: { user_id: userId, occurrence_id: occurrenceId },
  });

  return Boolean(bookmark);
}

/**
 * Internal helper to fetch occurrence bookmarks from Prisma,
 * optionally filtered by a Prisma.OccurrenceBookmarkWhereInput object.
 *
 * @private
 */
async function _fetchOccurrenceBookmarks(
  whereObject?: Prisma.OccurrenceBookmarkWhereInput
): Promise<OccurrenceBookmarkWithAssociations[]> {
  return prisma.occurrenceBookmark.findMany({
    ...(whereObject !== undefined && { where: whereObject }),
    include: {
      occurrence: {
        include: {
          notice: {
            include: {
              project: true,
            },
          },
        },
      },
    },
  });
}
