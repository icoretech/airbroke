import prisma from '@/lib/db';
import type { Notice, Occurrence, OccurrenceBookmark, Project } from '@prisma/client';
import { cache } from 'react';

export interface OccurrenceBookmarkWithAssociations extends OccurrenceBookmark {
  occurrence: Occurrence & { notice: Notice & { project: Project } };
}

// Cached function to fetch occurrence bookmarks from the database
const fetchOccurrenceBookmarks = cache(async (whereObject?: any): Promise<OccurrenceBookmarkWithAssociations[]> => {
  const results: OccurrenceBookmarkWithAssociations[] = await prisma.occurrenceBookmark.findMany({
    where: whereObject,
    include: {
      occurrence: {
        include: {
          notice: {
            include: {
              project: true
            }
          }
        }
      }
    }
  });
  return results;
});

// Function to get occurrence bookmarks based on provided search parameters
export async function getOccurrenceBookmarks(userId?: string, searchQuery?: string): Promise<OccurrenceBookmarkWithAssociations[]> {
  if (!userId) {
    return [];
  }

  const whereObject = {
    user_id: userId,
    ...(searchQuery && {
      OR: [
        {
          occurrence: {
            message: {
              contains: searchQuery,
              mode: 'insensitive'
            }
          }
        },
        {
          occurrence: {
            notice: {
              kind: {
                contains: searchQuery,
                mode: 'insensitive'
              }
            }
          }
        }
      ]
    })
  };

  const occurrenceBookmarks = await fetchOccurrenceBookmarks(whereObject);

  return occurrenceBookmarks;
}

// Function to get a single occurrence bookmark by user ID and occurrence ID
export const checkOccurrenceBookmarkExistence = async (
  userId: string | undefined,
  occurrenceId: string
): Promise<boolean> => {
  if (!userId || !occurrenceId) {
    return false;
  }

  const bookmark = await prisma.occurrenceBookmark.findFirst({
    where: { user_id: userId, occurrence_id: occurrenceId },
  });

  return Boolean(bookmark);
};
