// lib/auth.ts

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { APIError } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { genericOAuth } from "better-auth/plugins";
import { db } from "@/lib/db";
import type { GenericOAuthConfig } from "better-auth/plugins/generic-oauth";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Resolve a comma-separated env var to an array, or undefined if unset. */
export function envList(key: string): string[] | undefined {
  const value = process.env[key];
  if (!value) return undefined;
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Decode a JWT payload without verification (for reading claims only). */
export function decodeJwtPayload(token: string): Record<string, unknown> {
  const parts = token.split(".");
  if (parts.length !== 3) return {};
  try {
    const segment = parts[1] ?? "";
    const payload = Buffer.from(segment, "base64url").toString("utf-8");
    return JSON.parse(payload) as Record<string, unknown>;
  } catch {
    return {};
  }
}

/** Check email domain against an allowlist. Throws APIError to reject. */
export function assertEmailDomain(
  email: string | undefined,
  emailVerified: boolean | undefined,
  allowedDomains: string[],
  providerLabel: string,
) {
  if (!emailVerified) {
    throw new APIError("FORBIDDEN", {
      message: `${providerLabel}: email not verified`,
    });
  }
  const domain = email?.split("@")[1];
  if (!domain || !allowedDomains.includes(domain)) {
    throw new APIError("FORBIDDEN", {
      message: `${providerLabel}: email domain not allowed`,
    });
  }
}

// ---------------------------------------------------------------------------
// Built-in social providers (only added when env vars are set)
// ---------------------------------------------------------------------------

type SocialProviderConfig = {
  clientId: string;
  clientSecret: string;
  [key: string]: unknown;
};

function buildSocialProviders() {
  const social: Record<string, SocialProviderConfig> = {};

  if (process.env.AIRBROKE_GITHUB_ID && process.env.AIRBROKE_GITHUB_SECRET) {
    social.github = {
      clientId: process.env.AIRBROKE_GITHUB_ID,
      clientSecret: process.env.AIRBROKE_GITHUB_SECRET,
      scope: ["read:user", "user:email", "read:org"],
    };
  }

  if (process.env.AIRBROKE_GOOGLE_ID && process.env.AIRBROKE_GOOGLE_SECRET) {
    social.google = {
      clientId: process.env.AIRBROKE_GOOGLE_ID,
      clientSecret: process.env.AIRBROKE_GOOGLE_SECRET,
    };
  }

  if (process.env.AIRBROKE_APPLE_ID && process.env.AIRBROKE_APPLE_SECRET) {
    social.apple = {
      clientId: process.env.AIRBROKE_APPLE_ID,
      clientSecret: process.env.AIRBROKE_APPLE_SECRET,
    };
  }

  if (process.env.AIRBROKE_GITLAB_ID && process.env.AIRBROKE_GITLAB_SECRET) {
    social.gitlab = {
      clientId: process.env.AIRBROKE_GITLAB_ID,
      clientSecret: process.env.AIRBROKE_GITLAB_SECRET,
      scope: ["read_user", "read_api"],
    };
  }

  if (process.env.AIRBROKE_SLACK_ID && process.env.AIRBROKE_SLACK_SECRET) {
    social.slack = {
      clientId: process.env.AIRBROKE_SLACK_ID,
      clientSecret: process.env.AIRBROKE_SLACK_SECRET,
    };
  }

  if (
    process.env.AIRBROKE_SALESFORCE_ID &&
    process.env.AIRBROKE_SALESFORCE_SECRET
  ) {
    social.salesforce = {
      clientId: process.env.AIRBROKE_SALESFORCE_ID,
      clientSecret: process.env.AIRBROKE_SALESFORCE_SECRET,
    };
  }

  // Microsoft Entra ID: use built-in provider unless a custom issuer is set.
  // Custom issuers (B2C, CIAM, non-default authorities) are handled as
  // generic OAuth in buildGenericOAuthConfig() instead.
  if (
    process.env.AIRBROKE_MICROSOFT_ENTRA_ID_CLIENT_ID &&
    process.env.AIRBROKE_MICROSOFT_ENTRA_ID_CLIENT_SECRET &&
    !process.env.AIRBROKE_MICROSOFT_ENTRA_ID_ISSUER
  ) {
    social.microsoft = {
      clientId: process.env.AIRBROKE_MICROSOFT_ENTRA_ID_CLIENT_ID,
      clientSecret: process.env.AIRBROKE_MICROSOFT_ENTRA_ID_CLIENT_SECRET,
      ...(process.env.AIRBROKE_MICROSOFT_ENTRA_ID_TENANT_ID && {
        tenantId: process.env.AIRBROKE_MICROSOFT_ENTRA_ID_TENANT_ID,
      }),
    };
  }

  return social;
}

// ---------------------------------------------------------------------------
// Generic OAuth providers (via plugin)
// ---------------------------------------------------------------------------

function buildGenericOAuthConfig(): GenericOAuthConfig[] {
  const configs: GenericOAuthConfig[] = [];

  // Atlassian
  if (
    process.env.AIRBROKE_ATLASSIAN_ID &&
    process.env.AIRBROKE_ATLASSIAN_SECRET
  ) {
    configs.push({
      providerId: "atlassian",
      clientId: process.env.AIRBROKE_ATLASSIAN_ID,
      clientSecret: process.env.AIRBROKE_ATLASSIAN_SECRET,
      authorizationUrl:
        "https://auth.atlassian.com/authorize?audience=api.atlassian.com",
      tokenUrl: "https://auth.atlassian.com/oauth/token",
      scopes: ["read:me", "read:account"],
      async getUserInfo(tokens) {
        const res = await fetch("https://api.atlassian.com/me", {
          headers: { Authorization: `Bearer ${tokens.accessToken}` },
        });
        const profile = (await res.json()) as {
          account_id: string;
          name: string;
          email: string;
          picture?: string;
        };
        return {
          id: profile.account_id,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          emailVerified: true,
        };
      },
    });
  }

  // Auth0 (pre-configured helper available but we use generic for issuer control)
  if (
    process.env.AIRBROKE_AUTH0_ID &&
    process.env.AIRBROKE_AUTH0_SECRET &&
    process.env.AIRBROKE_AUTH0_ISSUER
  ) {
    const issuer = process.env.AIRBROKE_AUTH0_ISSUER.replace(/\/+$/, "");
    configs.push({
      providerId: "auth0",
      clientId: process.env.AIRBROKE_AUTH0_ID,
      clientSecret: process.env.AIRBROKE_AUTH0_SECRET,
      discoveryUrl: `${issuer}/.well-known/openid-configuration`,
    });
  }

  // Authentik
  if (
    process.env.AIRBROKE_AUTHENTIK_ID &&
    process.env.AIRBROKE_AUTHENTIK_SECRET &&
    process.env.AIRBROKE_AUTHENTIK_ISSUER
  ) {
    const issuer = process.env.AIRBROKE_AUTHENTIK_ISSUER.replace(/\/+$/, "");
    configs.push({
      providerId: "authentik",
      clientId: process.env.AIRBROKE_AUTHENTIK_ID,
      clientSecret: process.env.AIRBROKE_AUTHENTIK_SECRET,
      discoveryUrl: `${issuer}/.well-known/openid-configuration`,
    });
  }

  // Cognito
  if (
    process.env.AIRBROKE_COGNITO_ID &&
    process.env.AIRBROKE_COGNITO_SECRET &&
    process.env.AIRBROKE_COGNITO_ISSUER
  ) {
    const issuer = process.env.AIRBROKE_COGNITO_ISSUER.replace(/\/+$/, "");
    configs.push({
      providerId: "cognito",
      clientId: process.env.AIRBROKE_COGNITO_ID,
      clientSecret: process.env.AIRBROKE_COGNITO_SECRET,
      discoveryUrl: `${issuer}/.well-known/openid-configuration`,
    });
  }

  // Keycloak
  if (
    process.env.AIRBROKE_KEYCLOAK_ID &&
    process.env.AIRBROKE_KEYCLOAK_SECRET &&
    process.env.AIRBROKE_KEYCLOAK_ISSUER
  ) {
    const issuer = process.env.AIRBROKE_KEYCLOAK_ISSUER.replace(/\/+$/, "");
    configs.push({
      providerId: "keycloak",
      clientId: process.env.AIRBROKE_KEYCLOAK_ID,
      clientSecret: process.env.AIRBROKE_KEYCLOAK_SECRET,
      discoveryUrl: `${issuer}/.well-known/openid-configuration`,
    });
  }

  // Okta
  if (
    process.env.AIRBROKE_OKTA_ID &&
    process.env.AIRBROKE_OKTA_SECRET &&
    process.env.AIRBROKE_OKTA_ISSUER
  ) {
    const issuer = process.env.AIRBROKE_OKTA_ISSUER.replace(/\/+$/, "");
    configs.push({
      providerId: "okta",
      clientId: process.env.AIRBROKE_OKTA_ID,
      clientSecret: process.env.AIRBROKE_OKTA_SECRET,
      discoveryUrl: `${issuer}/.well-known/openid-configuration`,
    });
  }

  // BoxyHQ SAML
  if (
    process.env.AIRBROKE_BOXYHQ_SAML_ID &&
    process.env.AIRBROKE_BOXYHQ_SAML_SECRET &&
    process.env.AIRBROKE_BOXYHQ_SAML_ISSUER
  ) {
    const issuer = process.env.AIRBROKE_BOXYHQ_SAML_ISSUER.replace(/\/+$/, "");
    const extraParams: Record<string, string> = {};
    if (process.env.AIRBROKE_BOXYHQ_SAML_TENANT) {
      extraParams.tenant = process.env.AIRBROKE_BOXYHQ_SAML_TENANT;
    }
    if (process.env.AIRBROKE_BOXYHQ_SAML_PRODUCT) {
      extraParams.product = process.env.AIRBROKE_BOXYHQ_SAML_PRODUCT;
    }

    configs.push({
      providerId: "boxyhq-saml",
      clientId: process.env.AIRBROKE_BOXYHQ_SAML_ID,
      clientSecret: process.env.AIRBROKE_BOXYHQ_SAML_SECRET,
      authorizationUrl: `${issuer}/api/oauth/authorize`,
      tokenUrl: `${issuer}/api/oauth/token`,
      userInfoUrl: `${issuer}/api/oauth/userinfo`,
      ...(Object.keys(extraParams).length > 0 && {
        authorizationUrlParams: extraParams,
      }),
    });
  }

  // Bitbucket
  if (
    process.env.AIRBROKE_BITBUCKET_ID &&
    process.env.AIRBROKE_BITBUCKET_SECRET
  ) {
    configs.push({
      providerId: "bitbucket",
      clientId: process.env.AIRBROKE_BITBUCKET_ID,
      clientSecret: process.env.AIRBROKE_BITBUCKET_SECRET,
      authorizationUrl: "https://bitbucket.org/site/oauth2/authorize",
      tokenUrl: "https://bitbucket.org/site/oauth2/access_token",
      scopes: ["account", "email"],
      async getUserInfo(tokens) {
        const headers = { Authorization: `Bearer ${tokens.accessToken}` };
        const [userRes, emailsRes] = await Promise.all([
          fetch("https://api.bitbucket.org/2.0/user", { headers }),
          fetch("https://api.bitbucket.org/2.0/user/emails", { headers }),
        ]);
        const user = (await userRes.json()) as {
          uuid: string;
          display_name: string;
          links?: { avatar?: { href?: string } };
        };
        const emails = (await emailsRes.json()) as {
          values: Array<{
            email: string;
            is_primary: boolean;
            is_confirmed: boolean;
          }>;
        };
        const primary = emails.values.find((e) => e.is_primary);
        return {
          id: user.uuid,
          name: user.display_name,
          email: primary?.email ?? "",
          image: user.links?.avatar?.href,
          emailVerified: primary?.is_confirmed ?? false,
        };
      },
    });
  }

  // FusionAuth
  if (
    process.env.AIRBROKE_FUSIONAUTH_ID &&
    process.env.AIRBROKE_FUSIONAUTH_SECRET &&
    process.env.AIRBROKE_FUSIONAUTH_ISSUER
  ) {
    const issuer = process.env.AIRBROKE_FUSIONAUTH_ISSUER.replace(/\/+$/, "");
    configs.push({
      providerId: "fusionauth",
      clientId: process.env.AIRBROKE_FUSIONAUTH_ID,
      clientSecret: process.env.AIRBROKE_FUSIONAUTH_SECRET,
      discoveryUrl: `${issuer}/.well-known/openid-configuration`,
      ...(process.env.AIRBROKE_FUSIONAUTH_TENANT_ID && {
        authorizationUrlParams: {
          tenantId: process.env.AIRBROKE_FUSIONAUTH_TENANT_ID,
        },
      }),
    });
  }

  // Microsoft Entra ID with custom issuer (B2C, CIAM, non-default authority).
  // When AIRBROKE_MICROSOFT_ENTRA_ID_ISSUER is set, use generic OAuth with
  // OIDC discovery instead of the built-in microsoft social provider.
  if (
    process.env.AIRBROKE_MICROSOFT_ENTRA_ID_CLIENT_ID &&
    process.env.AIRBROKE_MICROSOFT_ENTRA_ID_CLIENT_SECRET &&
    process.env.AIRBROKE_MICROSOFT_ENTRA_ID_ISSUER
  ) {
    const issuer = process.env.AIRBROKE_MICROSOFT_ENTRA_ID_ISSUER.replace(
      /\/+$/,
      "",
    );
    configs.push({
      providerId: "microsoft",
      clientId: process.env.AIRBROKE_MICROSOFT_ENTRA_ID_CLIENT_ID,
      clientSecret: process.env.AIRBROKE_MICROSOFT_ENTRA_ID_CLIENT_SECRET,
      discoveryUrl: `${issuer}/.well-known/openid-configuration`,
    });
  }

  return configs;
}

// ---------------------------------------------------------------------------
// Collect all provider IDs for the serialization helper
// ---------------------------------------------------------------------------

/** Provider display names for the sign-in page. */
const PROVIDER_NAMES: Record<string, string> = {
  github: "GitHub",
  google: "Google",
  apple: "Apple",
  gitlab: "GitLab",
  slack: "Slack",
  salesforce: "Salesforce",
  microsoft: "Microsoft",
  atlassian: "Atlassian",
  auth0: "Auth0",
  authentik: "Authentik",
  cognito: "Cognito",
  keycloak: "Keycloak",
  okta: "Okta",
  "boxyhq-saml": "SAML (BoxyHQ)",
  bitbucket: "Bitbucket",
  fusionauth: "FusionAuth",
};

// ---------------------------------------------------------------------------
// Access-control helpers (called on EVERY login, not just first-time)
// ---------------------------------------------------------------------------

/** Map of provider ID → env var for email domain restrictions. */
const PROVIDER_DOMAIN_ENV: Record<string, string> = {
  google: "AIRBROKE_GOOGLE_DOMAINS",
  auth0: "AIRBROKE_AUTH0_DOMAINS",
  "boxyhq-saml": "AIRBROKE_BOXYHQ_SAML_DOMAINS",
  fusionauth: "AIRBROKE_FUSIONAUTH_DOMAINS",
};

/** Enforce email domain allowlist for a specific provider. */
export function enforceEmailDomainForProvider(
  email: string | undefined,
  emailVerified: boolean | undefined,
  providerId: string,
) {
  const envKey = PROVIDER_DOMAIN_ENV[providerId];
  if (!envKey) return; // provider has no domain restriction support
  const allowedDomains = envList(envKey);
  if (!allowedDomains) return; // env var not set, no restriction
  assertEmailDomain(
    email,
    emailVerified,
    allowedDomains,
    `${providerId} domain check`,
  );
}

/** Fetch with a 5-second timeout. */
export async function fetchWithTimeout(
  url: string,
  init: RequestInit,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

/** Enforce provider-specific API-based restrictions (org, group, workspace, tenant). */
async function enforceProviderRestrictions(
  providerId: string,
  accessToken: string | null | undefined,
  idToken?: string | null,
) {
  if (!accessToken) return;

  // GitHub organization restriction
  if (providerId === "github" && process.env.AIRBROKE_GITHUB_ORGS) {
    const allowedOrgs = envList("AIRBROKE_GITHUB_ORGS") ?? [];
    const response = await fetchWithTimeout(
      "https://api.github.com/user/orgs",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "airbroke",
        },
      },
    );
    if (!response.ok) {
      throw new APIError("FORBIDDEN", {
        message: "GitHub: failed to fetch organizations",
      });
    }
    const orgs = (await response.json()) as Array<{ login: string }>;
    if (!orgs.some((o) => allowedOrgs.includes(o.login))) {
      throw new APIError("FORBIDDEN", {
        message: "GitHub: organization not allowed",
      });
    }
  }

  // GitLab group restriction
  if (providerId === "gitlab" && process.env.AIRBROKE_GITLAB_GROUPS) {
    const allowedGroups = envList("AIRBROKE_GITLAB_GROUPS") ?? [];
    const gitlabUrl = (
      process.env.AIRBROKE_GITLAB_URL ?? "https://gitlab.com"
    ).replace(/\/+$/, "");
    const response = await fetchWithTimeout(
      `${gitlabUrl}/api/v4/groups?min_access_level=10`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
    if (!response.ok) {
      throw new APIError("FORBIDDEN", {
        message: "GitLab: failed to fetch groups",
      });
    }
    const groups = (await response.json()) as Array<{ full_path: string }>;
    if (!groups.some((g) => allowedGroups.includes(g.full_path))) {
      throw new APIError("FORBIDDEN", {
        message: "GitLab: group not allowed",
      });
    }
  }

  // Bitbucket workspace restriction
  if (providerId === "bitbucket" && process.env.AIRBROKE_BITBUCKET_WORKSPACES) {
    const allowedWorkspaces = envList("AIRBROKE_BITBUCKET_WORKSPACES") ?? [];
    const response = await fetchWithTimeout(
      "https://api.bitbucket.org/2.0/workspaces?role=member",
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
    if (!response.ok) {
      throw new APIError("FORBIDDEN", {
        message: "Bitbucket: failed to fetch workspaces",
      });
    }
    const data = (await response.json()) as {
      values: Array<{ slug: string }>;
    };
    if (!data.values.some((ws) => allowedWorkspaces.includes(ws.slug))) {
      throw new APIError("FORBIDDEN", {
        message: "Bitbucket: workspace not allowed",
      });
    }
  }

  // Atlassian site restriction
  if (providerId === "atlassian" && process.env.AIRBROKE_ATLASSIAN_SITES) {
    const allowedSites = envList("AIRBROKE_ATLASSIAN_SITES") ?? [];
    const response = await fetchWithTimeout(
      "https://api.atlassian.com/oauth/token/accessible-resources",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
      },
    );
    if (!response.ok) {
      throw new APIError("FORBIDDEN", {
        message: "Atlassian: failed to fetch accessible resources",
      });
    }
    const resources = (await response.json()) as Array<{ name: string }>;
    if (!resources.some((r) => allowedSites.includes(r.name))) {
      throw new APIError("FORBIDDEN", {
        message: "Atlassian: site not allowed",
      });
    }
  }

  // Slack workspace restriction
  if (providerId === "slack" && process.env.AIRBROKE_SLACK_WORKSPACES) {
    const allowedTeams = envList("AIRBROKE_SLACK_WORKSPACES") ?? [];
    const response = await fetchWithTimeout("https://slack.com/api/auth.test", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!response.ok) {
      throw new APIError("FORBIDDEN", {
        message: "Slack: failed to call auth.test",
      });
    }
    const data = (await response.json()) as {
      ok: boolean;
      team_id?: string;
    };
    if (!data.ok || !data.team_id || !allowedTeams.includes(data.team_id)) {
      throw new APIError("FORBIDDEN", {
        message: "Slack: workspace not allowed",
      });
    }
  }

  // Microsoft Entra ID tenant restriction.
  // Reads `tid` from the ID token (preferred) or access token (fallback).
  // NOTE: This is a best-effort check — the JWT payload is decoded without
  // signature verification. The token itself was obtained from a verified
  // OAuth flow, so tampering would require compromising the OAuth callback.
  // For stronger guarantees, replace with a MS Graph API call to
  // /v1.0/organization and verify the tenant ID from the API response.
  if (
    providerId === "microsoft" &&
    process.env.AIRBROKE_MICROSOFT_ENTRA_ID_TENANTS
  ) {
    const allowedTenants = envList("AIRBROKE_MICROSOFT_ENTRA_ID_TENANTS") ?? [];
    const claims = decodeJwtPayload(idToken ?? accessToken);
    const tid = claims.tid as string | undefined;
    if (!tid || !allowedTenants.includes(tid)) {
      throw new APIError("FORBIDDEN", {
        message: "Microsoft Entra ID: tenant not allowed",
      });
    }
  }

  // Salesforce organization restriction
  if (providerId === "salesforce" && process.env.AIRBROKE_SALESFORCE_ORGS) {
    const allowedOrgs = envList("AIRBROKE_SALESFORCE_ORGS") ?? [];
    const response = await fetchWithTimeout(
      "https://login.salesforce.com/services/oauth2/userinfo",
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
    if (!response.ok) {
      throw new APIError("FORBIDDEN", {
        message: "Salesforce: failed to fetch userinfo",
      });
    }
    const data = (await response.json()) as { organizationId?: string };
    if (!data.organizationId || !allowedOrgs.includes(data.organizationId)) {
      throw new APIError("FORBIDDEN", {
        message: "Salesforce: organization not allowed",
      });
    }
  }
}

// ---------------------------------------------------------------------------
// Better Auth instance
// ---------------------------------------------------------------------------
// NOTE: Better Auth's default prismaAdapter does not wrap user + account
// creation in a transaction. If account.create.before or session.create.before
// rejects a login (wrong org, wrong domain, etc.), the user row may already be
// persisted. This is acceptable — the user exists but cannot create a session,
// so they cannot access any protected resources. A cleanup job could remove
// orphaned users if desired.
// ---------------------------------------------------------------------------

export const auth = betterAuth({
  database: prismaAdapter(db, { provider: "postgresql" }),
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  socialProviders: buildSocialProviders(),
  plugins: [nextCookies(), genericOAuth({ config: buildGenericOAuthConfig() })],
  databaseHooks: {
    session: {
      create: {
        before: async (session) => {
          // Fires on EVERY login. Check only the most recently updated
          // account (the one whose token was just refreshed by the OAuth
          // callback) to avoid false positives from stale tokens on
          // other linked providers.
          const user = await db.user.findUnique({
            where: { id: session.userId },
            select: { email: true, emailVerified: true },
          });

          const currentAccount = await db.account.findFirst({
            where: { userId: session.userId },
            orderBy: { updatedAt: "desc" },
            select: {
              providerId: true,
              accessToken: true,
              idToken: true,
            },
          });

          if (currentAccount) {
            enforceEmailDomainForProvider(
              user?.email,
              user?.emailVerified,
              currentAccount.providerId,
            );
            await enforceProviderRestrictions(
              currentAccount.providerId,
              currentAccount.accessToken,
              currentAccount.idToken,
            );
          }

          return { data: session };
        },
      },
    },
    account: {
      create: {
        before: async (account) => {
          // First-time account creation — enforce domain + provider checks.
          const user = await db.user.findUnique({
            where: { id: account.userId },
            select: { email: true, emailVerified: true },
          });
          enforceEmailDomainForProvider(
            user?.email,
            user?.emailVerified,
            account.providerId,
          );
          await enforceProviderRestrictions(
            account.providerId,
            account.accessToken,
            account.idToken,
          );
          return { data: account };
        },
      },
    },
  },
  account: {
    accountLinking: {
      enabled: true,
    },
  },
});

// ---------------------------------------------------------------------------
// Public helpers
// ---------------------------------------------------------------------------

/** Returns serialized provider info for the sign-in page. */
export async function getSerializedProviders() {
  const social = buildSocialProviders();
  const generic = buildGenericOAuthConfig();

  const providers: { id: string; name: string; type: "social" | "oauth2" }[] =
    [];

  for (const id of Object.keys(social)) {
    providers.push({
      id,
      name: PROVIDER_NAMES[id] ?? id,
      type: "social",
    });
  }

  for (const cfg of generic) {
    const id = cfg.providerId as string;
    providers.push({
      id,
      name: PROVIDER_NAMES[id] ?? id,
      type: "oauth2",
    });
  }

  return providers;
}
