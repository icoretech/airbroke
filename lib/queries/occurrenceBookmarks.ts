import { prisma } from '@/lib/db';
import type { Notice, Occurrence, OccurrenceBookmark, Project } from '@prisma/client';
import { cache } from 'react';

interface OccurrenceBookmarkWithOccurrenceAndProject extends OccurrenceBookmark {
  occurrence: Occurrence & { notice: Notice & { project: Project } };
}
// Cached function to fetch occurrence bookmarks from the database
const fetchOccurrenceBookmarks = cache(async (whereObject?: any, orderByObject?: any): Promise<OccurrenceBookmarkWithOccurrenceAndProject[]> => {
  const results: OccurrenceBookmarkWithOccurrenceAndProject[] = await prisma.occurrenceBookmark.findMany({
    where: whereObject,
    orderBy: orderByObject,
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
export async function getOccurrenceBookmarks(userId?: string, searchQuery?: string): Promise<OccurrenceBookmarkWithOccurrenceAndProject[]> {
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

  const orderByObject = { created_at: 'asc' };

  const occurrenceBookmarks = await fetchOccurrenceBookmarks(whereObject, orderByObject);

  return occurrenceBookmarks;
}
