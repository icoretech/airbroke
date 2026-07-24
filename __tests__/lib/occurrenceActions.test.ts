// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

const getSessionMock = vi.fn();
const occurrenceBookmarkCreateMock = vi.fn();
const occurrenceBookmarkDeleteMock = vi.fn();
const occurrenceUpdateMock = vi.fn();
const revalidatePathMock = vi.fn();

vi.mock("@/lib/auth", () => ({
  getAuth: () => ({
    api: {
      getSession: getSessionMock,
    },
  }),
}));

vi.mock("next/headers", () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}));

vi.mock("next/cache", () => ({
  revalidatePath: revalidatePathMock,
}));

vi.mock("@/lib/db", () => ({
  db: {
    occurrence: {
      update: (...args: unknown[]) => occurrenceUpdateMock(...args),
    },
    occurrenceBookmark: {
      create: (...args: unknown[]) => occurrenceBookmarkCreateMock(...args),
      delete: (...args: unknown[]) => occurrenceBookmarkDeleteMock(...args),
    },
  },
}));

describe("occurrence mutations", () => {
  beforeEach(() => {
    getSessionMock.mockReset();
    getSessionMock.mockResolvedValue({ user: { id: "user1" } });
    occurrenceBookmarkCreateMock.mockReset();
    occurrenceBookmarkCreateMock.mockResolvedValue({});
    occurrenceBookmarkDeleteMock.mockReset();
    occurrenceBookmarkDeleteMock.mockResolvedValue({});
    occurrenceUpdateMock.mockReset();
    revalidatePathMock.mockReset();
  });

  it("rejects bookmark creation when the user is unauthorized", async () => {
    getSessionMock.mockResolvedValueOnce(null);
    const { createOccurrenceBookmark } = await import(
      "@/lib/actions/occurrenceActions"
    );

    await expect(createOccurrenceBookmark("occurrence-1")).rejects.toThrow(
      "Unauthorized",
    );
    expect(occurrenceBookmarkCreateMock).not.toHaveBeenCalled();
    expect(revalidatePathMock).not.toHaveBeenCalled();
  });

  it("bookmarks an occurrence and revalidates occurrence plus shared bookmark shell paths", async () => {
    const { createOccurrenceBookmark } = await import(
      "@/lib/actions/occurrenceActions"
    );

    await createOccurrenceBookmark("occurrence-1");

    expect(occurrenceBookmarkCreateMock).toHaveBeenCalledWith({
      data: {
        user_id: "user1",
        occurrence_id: "occurrence-1",
      },
    });
    expect(revalidatePathMock).toHaveBeenCalledWith(
      "/occurrences/occurrence-1",
    );
    expect(revalidatePathMock).toHaveBeenCalledWith("/projects");
    expect(revalidatePathMock).toHaveBeenCalledWith("/bookmarks");
  });

  it("rejects bookmark removal when the user is unauthorized", async () => {
    getSessionMock.mockResolvedValueOnce(null);
    const { removeOccurrenceBookmark } = await import(
      "@/lib/actions/occurrenceActions"
    );

    await expect(removeOccurrenceBookmark("occurrence-1")).rejects.toThrow(
      "Unauthorized",
    );
    expect(occurrenceBookmarkDeleteMock).not.toHaveBeenCalled();
    expect(revalidatePathMock).not.toHaveBeenCalled();
  });

  it("removes a bookmark and revalidates occurrence plus shared bookmark shell paths", async () => {
    const { removeOccurrenceBookmark } = await import(
      "@/lib/actions/occurrenceActions"
    );

    await removeOccurrenceBookmark("occurrence-1");

    expect(occurrenceBookmarkDeleteMock).toHaveBeenCalledWith({
      where: {
        user_id_occurrence_id: {
          occurrence_id: "occurrence-1",
          user_id: "user1",
        },
      },
    });
    expect(revalidatePathMock).toHaveBeenCalledWith(
      "/occurrences/occurrence-1",
    );
    expect(revalidatePathMock).toHaveBeenCalledWith("/projects");
    expect(revalidatePathMock).toHaveBeenCalledWith("/bookmarks");
  });

  it("rejects occurrence resolution when the user is unauthorized", async () => {
    getSessionMock.mockResolvedValueOnce(null);
    const { resolveOccurrence } = await import(
      "@/lib/actions/occurrenceActions"
    );

    await expect(resolveOccurrence("occurrence-1")).rejects.toThrow(
      "Unauthorized",
    );
    expect(occurrenceUpdateMock).not.toHaveBeenCalled();
    expect(revalidatePathMock).not.toHaveBeenCalled();
  });

  it("resolves an occurrence and revalidates occurrence, notice, and project shell paths", async () => {
    occurrenceUpdateMock.mockResolvedValue({
      notice: {
        id: "notice-1",
        project_id: "project-1",
      },
    });
    const { resolveOccurrence } = await import(
      "@/lib/actions/occurrenceActions"
    );

    await resolveOccurrence("occurrence-1");

    expect(occurrenceUpdateMock).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "occurrence-1" },
        data: { resolved_at: expect.any(Date) },
      }),
    );
    expect(revalidatePathMock).toHaveBeenCalledWith(
      "/occurrences/occurrence-1",
    );
    expect(revalidatePathMock).toHaveBeenCalledWith("/notices/notice-1");
    expect(revalidatePathMock).toHaveBeenCalledWith("/projects");
    expect(revalidatePathMock).toHaveBeenCalledWith("/bookmarks");
    expect(revalidatePathMock).toHaveBeenCalledWith(
      "/projects/project-1",
      "layout",
    );
    expect(revalidatePathMock).toHaveBeenCalledWith("/projects/project-1");
    expect(revalidatePathMock).toHaveBeenCalledWith("/projects/project-1/edit");
  });

  it("rejects occurrence reinstatement when the user is unauthorized", async () => {
    getSessionMock.mockResolvedValueOnce(null);
    const { reinstateOccurrence } = await import(
      "@/lib/actions/occurrenceActions"
    );

    await expect(reinstateOccurrence("occurrence-1")).rejects.toThrow(
      "Unauthorized",
    );
    expect(occurrenceUpdateMock).not.toHaveBeenCalled();
    expect(revalidatePathMock).not.toHaveBeenCalled();
  });

  it("reinstates an occurrence and revalidates occurrence, notice, and project shell paths", async () => {
    occurrenceUpdateMock.mockResolvedValue({
      notice: {
        id: "notice-1",
        project_id: "project-1",
      },
    });
    const { reinstateOccurrence } = await import(
      "@/lib/actions/occurrenceActions"
    );

    await reinstateOccurrence("occurrence-1");

    expect(occurrenceUpdateMock).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "occurrence-1" },
        data: { resolved_at: null },
      }),
    );
    expect(revalidatePathMock).toHaveBeenCalledWith(
      "/occurrences/occurrence-1",
    );
    expect(revalidatePathMock).toHaveBeenCalledWith("/notices/notice-1");
    expect(revalidatePathMock).toHaveBeenCalledWith("/projects");
    expect(revalidatePathMock).toHaveBeenCalledWith("/bookmarks");
    expect(revalidatePathMock).toHaveBeenCalledWith(
      "/projects/project-1",
      "layout",
    );
    expect(revalidatePathMock).toHaveBeenCalledWith("/projects/project-1");
    expect(revalidatePathMock).toHaveBeenCalledWith("/projects/project-1/edit");
  });
});
