// @vitest-environment node

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const originalEnv = process.env;

describe("Atlassian OAuth profile", () => {
  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
    process.env.AIRBROKE_ATLASSIAN_ID = "test-id";
    process.env.AIRBROKE_ATLASSIAN_SECRET = "test-secret";
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    process.env = originalEnv;
  });

  it("returns no profile when the user-info request fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(
          Response.json({ error: "unauthorized" }, { status: 401 }),
        ),
    );
    const { buildGenericOAuthConfig } = await import("@/lib/auth/providers");
    const atlassian = buildGenericOAuthConfig().find(
      (config) => config.providerId === "atlassian",
    );

    await expect(
      atlassian?.getUserInfo?.({
        accessToken: "invalid-token",
        refreshToken: undefined,
        idToken: undefined,
        accessTokenExpiresAt: undefined,
        refreshTokenExpiresAt: undefined,
        scopes: [],
      }),
    ).resolves.toBeNull();
  });
});
