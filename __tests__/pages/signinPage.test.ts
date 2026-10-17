// @vitest-environment node

import { describe, expect, it, vi } from "vitest";

const connectionMock = vi.hoisted(() => vi.fn());
const getSerializedProvidersMock = vi.hoisted(() => vi.fn(() => []));
const cookiesMock = vi.hoisted(() =>
  vi.fn(() => ({
    get: vi.fn(),
  })),
);

vi.mock("next/server", () => ({
  connection: connectionMock,
}));

vi.mock("next/headers", () => ({
  cookies: cookiesMock,
}));

vi.mock("@/lib/auth/providers", () => ({
  getSerializedProviders: getSerializedProvidersMock,
}));

describe("signin page runtime behavior", () => {
  it("waits for a request before reading provider envs", async () => {
    const pageModule = await import("@/app/signin/page");
    await pageModule.default({
      params: Promise.resolve({}),
      searchParams: Promise.resolve({}),
    });

    expect(connectionMock).toHaveBeenCalledTimes(1);
    expect(getSerializedProvidersMock).toHaveBeenCalledTimes(1);
    expect(cookiesMock).toHaveBeenCalledTimes(1);
  });

  it.each([
    ["/favicon.ico", "/projects"],
    ["/manifest.webmanifest", "/projects"],
    [
      "/occurrences/abc?tab=session&q=foo%20bar",
      "/occurrences/abc?tab=session&q=foo%20bar",
    ],
    ["/", "/"],
  ])(
    "passes a safe destination to OAuth when the return cookie is %s",
    async (value, expected) => {
      // Given the return cookie from an earlier unauthenticated request.
      cookiesMock.mockReturnValue({ get: vi.fn(() => ({ value })) });
      const pageModule = await import("@/app/signin/page");

      // When the sign-in page builds its OAuth client props.
      const page = await pageModule.default({
        params: Promise.resolve({}),
        searchParams: Promise.resolve({}),
      });

      // Then stale asset cookies are repaired and real page links are retained.
      expect(page.props.callbackUrl).toBe(expected);
    },
  );
});
