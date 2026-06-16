"use server";

import { revalidatePath } from "next/cache";
import { requireAuth, requireUserId } from "@/lib/actions/requireAuth";
import {
  revalidateProjectShellPaths,
  revalidateProjectsSidebarPaths,
} from "@/lib/actions/revalidateProjectShellPaths";
import { db } from "@/lib/db";
import type { Context } from "@/types/airbroke";

export type ReplayResult =
  | {
      readonly ok: true;
      readonly status: number;
    }
  | {
      readonly ok: false;
      readonly error: string;
      readonly status?: number;
      readonly body?: string;
    };

function revalidateOccurrenceMutationPaths(
  occurrenceId: string,
  noticeId: string,
  projectId: string,
) {
  revalidatePath(`/occurrences/${occurrenceId}`);
  revalidatePath(`/notices/${noticeId}`);
  revalidateProjectShellPaths(projectId);
}

function revalidateOccurrenceBookmarkPaths(occurrenceId: string) {
  revalidatePath(`/occurrences/${occurrenceId}`);
  revalidateProjectsSidebarPaths();
}

export async function performReplay(context: Context): Promise<ReplayResult> {
  await requireAuth();

  const { headers: contextHeaders, httpMethod, url } = context;
  if (!url) {
    return {
      ok: false,
      error: "Invalid HTTP request for replay. The URL property is missing.",
    };
  }

  const requestOptions: RequestInit = {
    method: httpMethod ?? "GET",
    cache: "no-store",
    ...(contextHeaders ? { headers: contextHeaders } : {}),
  };

  try {
    const response = await fetch(url, requestOptions);
    const responseBody = await response.text();

    if (response.ok) {
      return { ok: true, status: response.status };
    }

    return {
      ok: false,
      status: response.status,
      error: `HTTP request failed with status ${response.status}.`,
      body: responseBody,
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Creates an occurrence bookmark for the currently logged-in user.
 */
export async function createOccurrenceBookmark(occurrenceId: string) {
  const userId = await requireUserId();

  await db.occurrenceBookmark.create({
    data: {
      user_id: userId,
      occurrence_id: occurrenceId,
    },
  });

  revalidateOccurrenceBookmarkPaths(occurrenceId);
}

/**
 * Removes an occurrence bookmark for the currently logged-in user.
 */
export async function removeOccurrenceBookmark(occurrenceId: string) {
  const userId = await requireUserId();

  await db.occurrenceBookmark.delete({
    where: {
      user_id_occurrence_id: {
        user_id: userId,
        occurrence_id: occurrenceId,
      },
    },
  });

  revalidateOccurrenceBookmarkPaths(occurrenceId);
}

/**
 * Sets the `resolved_at` timestamp for an occurrence.
 * The PostgreSQL trigger syncs the parent notice resolved_at.
 */
export async function resolveOccurrence(occurrenceId: string) {
  await requireAuth();

  const occurrence = await db.occurrence.update({
    where: { id: occurrenceId },
    data: { resolved_at: new Date() },
    select: {
      notice: {
        select: { id: true, project_id: true },
      },
    },
  });

  revalidateOccurrenceMutationPaths(
    occurrenceId,
    occurrence.notice.id,
    occurrence.notice.project_id,
  );
}

/**
 * Clears the `resolved_at` timestamp for an occurrence (reinstate).
 * The PostgreSQL trigger syncs the parent notice resolved_at.
 */
export async function reinstateOccurrence(occurrenceId: string) {
  await requireAuth();

  const occurrence = await db.occurrence.update({
    where: { id: occurrenceId },
    data: { resolved_at: null },
    select: {
      notice: {
        select: { id: true, project_id: true },
      },
    },
  });

  revalidateOccurrenceMutationPaths(
    occurrenceId,
    occurrence.notice.id,
    occurrence.notice.project_id,
  );
}
