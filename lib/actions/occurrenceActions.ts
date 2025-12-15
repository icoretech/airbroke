// lib/actions/occurrenceActions.ts

"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import type { Context } from "@/types/airbroke";

/**
 * Replays an HTTP request based on captured context data.
 */
export async function performReplay(context: Context): Promise<string> {
  const { headers, httpMethod, url } = context;
  if (!url) {
    return "Invalid HTTP request for replay. The URL property is missing.";
  }

  const requestOptions: RequestInit = {
    method: httpMethod ?? "GET",
    cache: "no-store",
    ...(headers ? { headers } : {}),
  };

  try {
    const response = await fetch(url, requestOptions);
    const responseBody = await response.text();

    if (response.ok) {
      return `HTTP Status Code: ${response.status}\nBody hidden`;
    } else {
      return `HTTP Status Code: ${response.status}\n${responseBody}`;
    }
  } catch (error) {
    return `Error occurred during fetch: ${String(error)}`;
  }
}

/**
 * Creates an occurrence bookmark for the currently logged-in user.
 */
export async function createOccurrenceBookmark(occurrenceId: string) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("No user session or user ID found");
  }

  await db.occurrenceBookmark.create({
    data: {
      user_id: session.user.id,
      occurrence_id: occurrenceId,
    },
  });

  revalidatePath(`/occurrences/${occurrenceId}`);
  revalidatePath("/bookmarks");
}

/**
 * Removes an occurrence bookmark for the currently logged-in user.
 */
export async function removeOccurrenceBookmark(occurrenceId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("No user session or user ID found");
  }

  await db.occurrenceBookmark.delete({
    where: {
      user_id_occurrence_id: {
        user_id: session.user.id,
        occurrence_id: occurrenceId,
      },
    },
  });

  revalidatePath(`/occurrences/${occurrenceId}`);
  revalidatePath("/bookmarks");
}

/**
 * Sets the `resolved_at` timestamp for an occurrence.
 */
export async function resolveOccurrence(occurrenceId: string) {
  await db.occurrence.update({
    where: { id: occurrenceId },
    data: { resolved_at: new Date() },
  });

  revalidatePath(`/occurrences/${occurrenceId}`);
}

/**
 * Clears the `resolved_at` timestamp for an occurrence (reinstate).
 */
export async function reinstateOccurrence(occurrenceId: string) {
  await db.occurrence.update({
    where: { id: occurrenceId },
    data: { resolved_at: null },
  });

  revalidatePath(`/occurrences/${occurrenceId}`);
}
