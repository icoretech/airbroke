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

describe("performReplay", () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
    getSessionMock.mockReset();
    getSessionMock.mockResolvedValue({ user: { id: "user1" } });
  });

  it("throws before replaying when the user is unauthorized", async () => {
    getSessionMock.mockResolvedValueOnce(null);
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const { performReplay } = await import("@/lib/actions/occurrenceActions");

    await expect(performReplay({ url: "https://example.com" })).rejects.toThrow(
      "Unauthorized",
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns a typed failure when replay context has no URL", async () => {
    const { performReplay } = await import("@/lib/actions/occurrenceActions");

    const result = await performReplay({});

    expect(result).toEqual({
      ok: false,
      error: "Invalid HTTP request for replay. The URL property is missing.",
    });
  });

  it("returns a typed failure when fetch rejects", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new TypeError("connection refused")),
    );
    const { performReplay } = await import("@/lib/actions/occurrenceActions");

    const result = await performReplay({ url: "https://example.com" });

    expect(result).toEqual({
      ok: false,
      error: "connection refused",
    });
  });

  it("returns a typed success when replay receives a 2xx response", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        new Response("visible body should stay hidden", { status: 200 }),
      );
    vi.stubGlobal("fetch", fetchMock);
    const { performReplay } = await import("@/lib/actions/occurrenceActions");

    const result = await performReplay({
      url: "https://example.com",
      httpMethod: "POST",
      headers: { "x-replay": "yes" },
    });

    expect(result).toEqual({
      ok: true,
      status: 200,
    });
    expect(fetchMock).toHaveBeenCalledWith("https://example.com", {
      cache: "no-store",
      headers: { "x-replay": "yes" },
      method: "POST",
    });
  });

  it("returns response status and body when replay receives a non-2xx response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response("invalid", { status: 422 })),
    );
    const { performReplay } = await import("@/lib/actions/occurrenceActions");

    const result = await performReplay({ url: "https://example.com" });

    expect(result).toEqual({
      ok: false,
      status: 422,
      error: "HTTP request failed with status 422.",
      body: "invalid",
    });
  });
});

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
