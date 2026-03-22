// @vitest-environment node

import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/db", () => ({
  db: {},
}));

describe("auth configuration", () => {
  it("exports auth instance and getSerializedProviders", async () => {
    const authModule = await import("@/lib/auth");

    expect(authModule.auth).toBeDefined();
    expect(authModule.getSerializedProviders).toBeDefined();
    expect(typeof authModule.getSerializedProviders).toBe("function");
  });

  it("getSerializedProviders returns provider list with type field", async () => {
    const { getSerializedProviders } = await import("@/lib/auth");
    const providers = await getSerializedProviders();

    expect(Array.isArray(providers)).toBe(true);
    for (const provider of providers) {
      expect(provider).toHaveProperty("id");
      expect(provider).toHaveProperty("name");
      expect(provider).toHaveProperty("type");
      expect(["social", "oauth2"]).toContain(provider.type);
    }
  });
});
