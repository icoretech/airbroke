// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from "vitest";

const getSessionMock = vi.fn();

vi.mock("@/lib/auth", () => ({
  getAuth: () => ({ api: { getSession: getSessionMock } }),
}));
vi.mock("next/headers", () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("@/lib/db", () => ({ db: {} }));

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

    await expect(performReplay({})).resolves.toEqual({
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

    await expect(
      performReplay({ url: "https://example.com" }),
    ).resolves.toEqual({ ok: false, error: "connection refused" });
  });

  it("returns success without consuming a 2xx response body", async () => {
    const response = new Response("visible body should stay hidden", {
      status: 200,
    });
    const responseTextSpy = vi.spyOn(response, "text");
    const fetchMock = vi.fn().mockResolvedValue(response);
    vi.stubGlobal("fetch", fetchMock);
    const { performReplay } = await import("@/lib/actions/occurrenceActions");

    await expect(
      performReplay({
        url: "https://example.com",
        httpMethod: "POST",
        headers: { "x-replay": "yes" },
      }),
    ).resolves.toEqual({ ok: true, status: 200 });
    expect(responseTextSpy).not.toHaveBeenCalled();
    expect(fetchMock).toHaveBeenCalledWith("https://example.com", {
      cache: "no-store",
      headers: { "x-replay": "yes" },
      method: "POST",
    });
  });

  it("returns response status and body for a non-2xx response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response("invalid", { status: 422 })),
    );
    const { performReplay } = await import("@/lib/actions/occurrenceActions");

    await expect(
      performReplay({ url: "https://example.com" }),
    ).resolves.toEqual({
      ok: false,
      status: 422,
      error: "HTTP request failed with status 422.",
      body: "invalid",
    });
  });
});
