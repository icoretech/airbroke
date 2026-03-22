// lib/auth.ts
//
// Lazy Better Auth initialization — the betterAuth() instance is constructed
// on first call to getAuth(), NOT at module import time. This prevents
// "missing BETTER_AUTH_SECRET / BETTER_AUTH_URL" warnings during `next build`
// where the auth runtime is not needed.

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { APIError } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { genericOAuth } from "better-auth/plugins";
import {
  buildGenericOAuthConfig,
  buildSocialProviders,
  envList,
} from "@/lib/auth-providers";
import { db } from "@/lib/db";

// Re-export for call sites that need these utilities
export { envList, getSerializedProviders } from "@/lib/auth-providers";

// ---------------------------------------------------------------------------
// Access-control helpers
// ---------------------------------------------------------------------------

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
  if (!envKey) return;
  const allowedDomains = envList(envKey);
  if (!allowedDomains) return;
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
// Lazy Better Auth instance
// ---------------------------------------------------------------------------
// NOTE: Better Auth's default prismaAdapter does not wrap user + account
// creation in a transaction. If account.create.before or session.create.before
// rejects a login (wrong org, wrong domain, etc.), the user row may already be
// persisted. This is acceptable — the user exists but cannot create a session,
// so they cannot access any protected resources. A cleanup job could remove
// orphaned users if desired.
// ---------------------------------------------------------------------------

function createAuth() {
  return betterAuth({
    database: prismaAdapter(db, { provider: "postgresql" }),
    baseURL: process.env.BETTER_AUTH_URL,
    secret: process.env.BETTER_AUTH_SECRET,
    socialProviders: buildSocialProviders(),
    plugins: [
      nextCookies(),
      genericOAuth({ config: buildGenericOAuthConfig() }),
    ],
    databaseHooks: {
      session: {
        create: {
          before: async (session) => {
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
}

let _auth: ReturnType<typeof createAuth> | null = null;

/** Lazy getter — constructs Better Auth on first call, fails loudly if env is missing. */
export function getAuth() {
  if (!_auth) {
    _auth = createAuth();
  }
  return _auth;
}
