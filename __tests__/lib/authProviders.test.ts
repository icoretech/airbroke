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
    vi.unstubAllGlobals();
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
    const { buildSocialProviders } = await import("@/lib/auth-providers");
    const social = buildSocialProviders();
    expect(social.google?.clientId).toBe("test-id");
    const { getSerializedProviders } = await import("@/lib/auth");
    const providers = await getSerializedProviders();
    expect(providers.find((p) => p.id === "google")).toBeDefined();
  });

  it("keeps a single Google client id as a string at the provider builder level", async () => {
    process.env.AIRBROKE_GOOGLE_ID = "  google-client-id  ";
    process.env.AIRBROKE_GOOGLE_SECRET = "test-secret";

    const { buildSocialProviders } = await import("@/lib/auth-providers");
    expect(buildSocialProviders().google?.clientId).toBe("google-client-id");
  });

  it("normalizes comma-separated Google client ids into an ordered array at the provider builder level", async () => {
    process.env.AIRBROKE_GOOGLE_ID = " google-1 , , google-2 , google-3 ";
    process.env.AIRBROKE_GOOGLE_SECRET = "test-secret";

    const { buildSocialProviders } = await import("@/lib/auth-providers");
    expect(buildSocialProviders().google?.clientId).toEqual([
      "google-1",
      "google-2",
      "google-3",
    ]);
  });

  it("keeps Apple and Microsoft social client ids normalized through the builder", async () => {
    process.env.AIRBROKE_APPLE_ID = " apple-1 , apple-2 ";
    process.env.AIRBROKE_APPLE_SECRET = "apple-secret";
    process.env.AIRBROKE_MICROSOFT_ENTRA_ID_CLIENT_ID =
      " ms-1 , , ms-2 , ms-3 ";
    process.env.AIRBROKE_MICROSOFT_ENTRA_ID_CLIENT_SECRET = "ms-secret";

    const { buildSocialProviders } = await import("@/lib/auth-providers");
    const social = buildSocialProviders();

    expect(social.apple?.clientId).toEqual(["apple-1", "apple-2"]);
    expect(social.microsoft?.clientId).toEqual(["ms-1", "ms-2", "ms-3"]);
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

  it("uses correct display name for Microsoft social provider", async () => {
    process.env.AIRBROKE_MICROSOFT_ENTRA_ID_CLIENT_ID = "ms-id";
    process.env.AIRBROKE_MICROSOFT_ENTRA_ID_CLIENT_SECRET = "ms-secret";
    const { getSerializedProviders } = await import("@/lib/auth");
    const providers = await getSerializedProviders();
    expect(providers.find((p) => p.id === "microsoft")?.name).toBe("Microsoft");
  });

  it("keeps unsupported and generic OAuth providers string-only", async () => {
    process.env.AIRBROKE_GITHUB_ID = " gh-1 , gh-2 ";
    process.env.AIRBROKE_GITHUB_SECRET = "gh-secret";
    process.env.AIRBROKE_SLACK_ID = " slack-1 , slack-2 ";
    process.env.AIRBROKE_SLACK_SECRET = "slack-secret";
    process.env.AIRBROKE_COGNITO_ID = " cog-1 , cog-2 ";
    process.env.AIRBROKE_COGNITO_SECRET = "cog-secret";
    process.env.AIRBROKE_COGNITO_ISSUER = "https://example.com/issuer";
    process.env.AIRBROKE_MICROSOFT_ENTRA_ID_CLIENT_ID = " ms-1 , ms-2 ";
    process.env.AIRBROKE_MICROSOFT_ENTRA_ID_CLIENT_SECRET = "ms-secret";
    process.env.AIRBROKE_MICROSOFT_ENTRA_ID_ISSUER =
      "https://example.com/issuer";

    const { buildSocialProviders } = await import("@/lib/auth-providers");
    const { buildGenericOAuthConfig } = await import("@/lib/auth-providers");
    const social = buildSocialProviders();
    const genericOAuth = buildGenericOAuthConfig();

    expect(social.github?.clientId).toBe(" gh-1 , gh-2 ");
    expect(social.slack?.clientId).toBe(" slack-1 , slack-2 ");
    expect(genericOAuth.find((c) => c.providerId === "cognito")?.clientId).toBe(
      " cog-1 , cog-2 ",
    );
    expect(
      genericOAuth.find((c) => c.providerId === "microsoft")?.clientId,
    ).toBe(" ms-1 , ms-2 ");
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

  it("preserves missing email for Bitbucket when no primary address is returned", async () => {
    process.env.AIRBROKE_BITBUCKET_ID = "bb-id";
    process.env.AIRBROKE_BITBUCKET_SECRET = "bb-secret";

    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL) => {
        const url = String(input);

        if (url.endsWith("/2.0/user")) {
          return Response.json({
            uuid: "bitbucket-user-uuid",
            display_name: "Bitbucket User",
            links: { avatar: { href: "https://example.com/avatar.png" } },
          });
        }

        if (url.endsWith("/2.0/user/emails")) {
          return Response.json({
            values: [
              {
                email: "secondary@example.com",
                is_primary: false,
                is_confirmed: true,
              },
            ],
          });
        }

        throw new Error(`unexpected fetch url: ${url}`);
      }),
    );

    const { buildGenericOAuthConfig } = await import("@/lib/auth-providers");
    const bitbucket = buildGenericOAuthConfig().find(
      (config) => config.providerId === "bitbucket",
    );

    await expect(
      bitbucket?.getUserInfo?.({
        accessToken: "token",
        refreshToken: undefined,
        idToken: undefined,
        accessTokenExpiresAt: undefined,
        refreshTokenExpiresAt: undefined,
        scopes: [],
      }),
    ).resolves.toEqual({
      id: "bitbucket-user-uuid",
      name: "Bitbucket User",
      email: undefined,
      image: "https://example.com/avatar.png",
      emailVerified: false,
    });
  });
});

describe("normalizeClientIdEnvValue", () => {
  it("returns undefined for unset and all-empty input", async () => {
    const { normalizeClientIdEnvValue } = await import("@/lib/auth-providers");

    expect(normalizeClientIdEnvValue(undefined)).toBeUndefined();
    expect(normalizeClientIdEnvValue("")).toBeUndefined();
    expect(normalizeClientIdEnvValue(" , , ")).toBeUndefined();
  });

  it("normalizes one non-empty client id as a string", async () => {
    const { normalizeClientIdEnvValue } = await import("@/lib/auth-providers");

    expect(normalizeClientIdEnvValue("  client-1  ")).toBe("client-1");
  });

  it("normalizes comma-separated client ids into an ordered array", async () => {
    const { normalizeClientIdEnvValue } = await import("@/lib/auth-providers");

    expect(
      normalizeClientIdEnvValue(" client-1 , , client-2 , client-3 "),
    ).toEqual(["client-1", "client-2", "client-3"]);
  });
});
