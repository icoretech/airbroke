'use server';

import { auth } from '@/lib/auth';
import prisma from '@/lib/db';
import { Context } from '@/types/airbroke';
import { revalidatePath } from 'next/cache';

export async function performReplay(context: Context): Promise<string> {
  const { headers, httpMethod, url } = context;
  if (!url) return 'Invalid HTTP request for replay. The URL property is missing.';

  const requestOptions: RequestInit = {
    method: httpMethod,
    headers: headers,
    cache: 'no-store',
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
export async function createOccurrenceBookmark(occurrenceId: string) {
  const session = await auth();
  if (!session) {
    throw new Error('Session not found');
  }

  await prisma.occurrenceBookmark.create({
    data: {
      user_id: session.user?.id!,
      occurrence_id: occurrenceId,
    },
  });

  revalidatePath(`/occurrences/${occurrenceId}`);
  revalidatePath('/bookmarks');
}

export async function removeOccurrenceBookmark(occurrenceId: string) {
  const session = await auth();
  if (!session) {
    throw new Error('Session not found');
  }

  await prisma.occurrenceBookmark.delete({
    where: {
      user_id_occurrence_id: {
        user_id: session.user?.id!,
        occurrence_id: occurrenceId,
      },
    },
  });

  revalidatePath(`/occurrences/${occurrenceId}`);
  revalidatePath('/bookmarks');
}

export async function resolveOccurrence(occurrenceId: string) {
  await prisma.occurrence.update({
    where: { id: occurrenceId },
    data: { resolved_at: new Date() },
  });

  revalidatePath(`/occurrences/${occurrenceId}`);
}

export async function reinstateOccurrence(occurrenceId: string) {
  await prisma.occurrence.update({
    where: { id: occurrenceId },
    data: { resolved_at: null },
  });

  revalidatePath(`/occurrences/${occurrenceId}`);
}
