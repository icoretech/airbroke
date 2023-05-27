'use server';

import { prisma } from '@/lib/db';
import { Context } from '@/types/airbroke';
import type { OccurrenceBookmark } from '@prisma/client';

export async function performReplay(context: Context): Promise<string> {
  const { headers, httpMethod, url } = context;
  if (!url) return 'Invalid HTTP request for replay. The URL property is missing.';

  const requestOptions: RequestInit = {
    method: httpMethod,
    headers: headers,
    cache: 'no-store'
  };

  let responseText: string;
  try {
    const response = await fetch(url, requestOptions);
    const responseBody = await response.text();

    if (response.ok) {
      responseText = `HTTP Status Code: ${response.status}\nBody hidden`;
    } else {
      responseText = `HTTP Status Code: ${response.status}\n${responseBody}`;
    }
  } catch (error) {
    responseText = `Error occurred during fetch: ${error}`;
  }

  return responseText;
}

// Function to create a bookmark for a user
export async function createOccurrenceBookmark(userId: string, occurrenceId: string): Promise<OccurrenceBookmark> {
  try {
    const bookmark = await prisma.occurrenceBookmark.create({
      data: {
        user_id: userId,
        occurrence_id: occurrenceId,
      },
    });

    return bookmark;
  } catch (error) {
    console.error(`Error occurred during OccurrenceBookmark creation: ${error}`);
    throw error;
  }
}

export async function removeOccurrenceBookmark(userId: string, occurrenceId: string): Promise<void> {
  try {
    await prisma.occurrenceBookmark.delete({
      where: {
        user_id_occurrence_id: {
          user_id: userId,
          occurrence_id: occurrenceId,
        },
      },
    });
  } catch (error) {
    console.error(`Error occurred during OccurrenceBookmark deletion: ${error}`);
    throw error;
  }
}
