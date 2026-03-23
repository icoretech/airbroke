// @vitest-environment node

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/db", () => ({ db: {} }));

describe("getSerializedProviders", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
    // Clear all provider env vars but keep BETTER_AUTH_* for auth init
    for (const key of Object.keys(process.env)) {
      if (key.startsWith("AIRBROKE_")) {
        delete process.env[key];
      }
    }
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("returns empty list when no providers are configured", async () => {
    const { getSerializedProviders } = await import("@/lib/auth");
    const providers = await getSerializedProviders();
    expect(providers).toEqual([]);
  });

  it("includes GitHub when env vars are set", async () => {
    process.env.AIRBROKE_GITHUB_ID = "test-id";
    process.env.AIRBROKE_GITHUB_SECRET = "test-secret";
    const { getSerializedProviders } = await import("@/lib/auth");
    const providers = await getSerializedProviders();
    const github = providers.find((p) => p.id === "github");
    expect(github).toEqual({
      id: "github",
      name: "GitHub",
      type: "social",
    });
  });

  it("includes Google when env vars are set", async () => {
    process.env.AIRBROKE_GOOGLE_ID = "test-id";
    process.env.AIRBROKE_GOOGLE_SECRET = "test-secret";
    const { getSerializedProviders } = await import("@/lib/auth");
    const providers = await getSerializedProviders();
    expect(providers.find((p) => p.id === "google")).toBeDefined();
  });

  it("classifies Atlassian as oauth2 type", async () => {
    process.env.AIRBROKE_ATLASSIAN_ID = "test-id";
    process.env.AIRBROKE_ATLASSIAN_SECRET = "test-secret";
    const { getSerializedProviders } = await import("@/lib/auth");
    const providers = await getSerializedProviders();
    const atlassian = providers.find((p) => p.id === "atlassian");
    expect(atlassian?.type).toBe("oauth2");
  });

  it("shows OIDC providers with credentials even without valid issuer", async () => {
    // Auth0 with credentials but no issuer should still appear on sign-in page
    // so admins notice misconfiguration rather than a silently missing provider
    process.env.AIRBROKE_AUTH0_ID = "test-id";
    process.env.AIRBROKE_AUTH0_SECRET = "test-secret";
    const { getSerializedProviders } = await import("@/lib/auth");
    const providers = getSerializedProviders();
    expect(providers.find((p) => p.id === "auth0")).toBeDefined();
  });

  it("excludes OIDC providers from OAuth config without valid issuer", async () => {
    process.env.AIRBROKE_AUTH0_ID = "test-id";
    process.env.AIRBROKE_AUTH0_SECRET = "test-secret";
    delete process.env.AIRBROKE_AUTH0_ISSUER;
    const { buildGenericOAuthConfig } = await import("@/lib/auth-providers");
    const configs = buildGenericOAuthConfig();
    expect(configs.find((c) => c.providerId === "auth0")).toBeUndefined();
  });

  it("includes Auth0 when all three env vars are set", async () => {
    process.env.AIRBROKE_AUTH0_ID = "test-id";
    process.env.AIRBROKE_AUTH0_SECRET = "test-secret";
    process.env.AIRBROKE_AUTH0_ISSUER = "https://test.auth0.com";
    const { getSerializedProviders } = await import("@/lib/auth");
    const providers = await getSerializedProviders();
    expect(providers.find((p) => p.id === "auth0")).toBeDefined();
  });

  it("includes multiple providers simultaneously", async () => {
    process.env.AIRBROKE_GITHUB_ID = "gh-id";
    process.env.AIRBROKE_GITHUB_SECRET = "gh-secret";
    process.env.AIRBROKE_GOOGLE_ID = "g-id";
    process.env.AIRBROKE_GOOGLE_SECRET = "g-secret";
    process.env.AIRBROKE_SLACK_ID = "sl-id";
    process.env.AIRBROKE_SLACK_SECRET = "sl-secret";
    const { getSerializedProviders } = await import("@/lib/auth");
    const providers = await getSerializedProviders();
    expect(providers.length).toBe(3);
    expect(providers.map((p) => p.id).sort()).toEqual([
      "github",
      "google",
      "slack",
    ]);
  });

  it("uses correct display names", async () => {
    process.env.AIRBROKE_MICROSOFT_ENTRA_ID_CLIENT_ID = "ms-id";
    process.env.AIRBROKE_MICROSOFT_ENTRA_ID_CLIENT_SECRET = "ms-secret";
    const { getSerializedProviders } = await import("@/lib/auth");
    const providers = await getSerializedProviders();
    expect(providers.find((p) => p.id === "microsoft")?.name).toBe("Microsoft");
  });

  it("includes Bitbucket as oauth2 type", async () => {
    process.env.AIRBROKE_BITBUCKET_ID = "bb-id";
    process.env.AIRBROKE_BITBUCKET_SECRET = "bb-secret";
    const { getSerializedProviders } = await import("@/lib/auth");
    const providers = await getSerializedProviders();
    const bb = providers.find((p) => p.id === "bitbucket");
    expect(bb?.type).toBe("oauth2");
    expect(bb?.name).toBe("Bitbucket");
  });
});
