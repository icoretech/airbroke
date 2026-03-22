// @vitest-environment node

import { describe, expect, it, vi } from "vitest";

const getSessionMock = vi.hoisted(() => vi.fn());
const headersMock = vi.hoisted(() => vi.fn());
const redirectMock = vi.hoisted(() =>
  vi.fn(() => {
    throw new Error("NEXT_REDIRECT");
  }),
);

vi.mock("@/lib/auth", () => ({
  auth: { api: { getSession: getSessionMock } },
}));

vi.mock("next/headers", () => ({
  headers: headersMock,
}));

vi.mock("next/navigation", () => ({
  redirect: redirectMock,
}));

import { requireSession } from "../../lib/requireSession";

function mockHeaders(entries: Record<string, string> = {}) {
  const map = new Map(Object.entries(entries));
  headersMock.mockResolvedValue({
    get: (key: string) => map.get(key) ?? null,
  });
}

describe("requireSession", () => {
  it("returns session when authenticated", async () => {
    const session = { user: { id: "u1", name: "Test" } };
    getSessionMock.mockResolvedValue(session);
    mockHeaders();

    const result = await requireSession();
    expect(result).toBe(session);
    expect(redirectMock).not.toHaveBeenCalled();
  });

  it("redirects to /signin when no session", async () => {
    getSessionMock.mockResolvedValue(null);
    mockHeaders();

    await expect(requireSession()).rejects.toThrow("NEXT_REDIRECT");
    expect(redirectMock).toHaveBeenCalledWith("/signin");
  });

  it("preserves callbackUrl from x-invoke-path header", async () => {
    getSessionMock.mockResolvedValue(null);
    mockHeaders({ "x-invoke-path": "/projects/abc123" });

    await expect(requireSession()).rejects.toThrow("NEXT_REDIRECT");
    expect(redirectMock).toHaveBeenCalledWith(
      expect.stringContaining("/signin?callbackUrl=%2Fprojects%2Fabc123"),
    );
  });

  it("falls back to referer for callbackUrl", async () => {
    getSessionMock.mockResolvedValue(null);
    mockHeaders({ referer: "https://example.com/bookmarks" });

    await expect(requireSession()).rejects.toThrow("NEXT_REDIRECT");
    expect(redirectMock).toHaveBeenCalledWith(
      expect.stringContaining("/signin?callbackUrl=%2Fbookmarks"),
    );
  });

  it("does not add callbackUrl for root path", async () => {
    getSessionMock.mockResolvedValue(null);
    mockHeaders({ "x-invoke-path": "/" });

    await expect(requireSession()).rejects.toThrow("NEXT_REDIRECT");
    expect(redirectMock).toHaveBeenCalledWith("/signin");
  });
});
