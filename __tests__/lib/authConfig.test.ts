// @vitest-environment node

import { describe, expect, it } from "vitest";

describe("auth configuration", () => {
  it("exports getAuth and getSerializedProviders", async () => {
    const authModule = await import("@/lib/auth");

    expect(authModule.getAuth).toBeDefined();
    expect(typeof authModule.getAuth).toBe("function");
    expect(authModule.getSerializedProviders).toBeDefined();
    expect(typeof authModule.getSerializedProviders).toBe("function");
  });

  it("getSerializedProviders returns provider list with type field", async () => {
    const { getSerializedProviders } = await import("@/lib/auth-providers");
    const providers = getSerializedProviders();

    expect(Array.isArray(providers)).toBe(true);
    for (const provider of providers) {
      expect(provider).toHaveProperty("id");
      expect(provider).toHaveProperty("name");
      expect(provider).toHaveProperty("type");
      expect(["social", "oauth2"]).toContain(provider.type);
    }
  });
});
