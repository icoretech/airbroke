// @vitest-environment node

import { describe, expect, it, vi } from "vitest";

const connectionMock = vi.hoisted(() => vi.fn());
const getSerializedProvidersMock = vi.hoisted(() => vi.fn(() => []));

vi.mock("next/server", () => ({
  connection: connectionMock,
}));

vi.mock("@/lib/auth-providers", () => ({
  getSerializedProviders: getSerializedProvidersMock,
}));

describe("signin page runtime behavior", () => {
  it("waits for a request before reading provider envs", async () => {
    const pageModule = await import("@/app/signin/page");
    await pageModule.default();

    expect(connectionMock).toHaveBeenCalledTimes(1);
    expect(getSerializedProvidersMock).toHaveBeenCalledTimes(1);
  });
});
