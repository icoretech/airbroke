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

vi.mock("@/lib/auth-providers", () => ({
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
});
