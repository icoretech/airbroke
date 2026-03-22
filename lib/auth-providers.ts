// lib/auth-providers.ts
//
// Pure provider configuration — no Better Auth runtime dependency.
// Safe to import at build time (e.g. the signin page) without triggering
// betterAuth() construction or requiring BETTER_AUTH_URL / BETTER_AUTH_SECRET.

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

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type SocialProviderConfig = {
  clientId: string;
  clientSecret: string;
  [key: string]: unknown;
};

export type SerializedProvider = {
  id: string;
  name: string;
  type: "social" | "oauth2";
};

// ---------------------------------------------------------------------------
// Provider display names for the sign-in page
// ---------------------------------------------------------------------------

export const PROVIDER_NAMES: Record<string, string> = {
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
// Built-in social providers (only added when env vars are set)
// ---------------------------------------------------------------------------

export function buildSocialProviders(): Record<string, SocialProviderConfig> {
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

export function buildGenericOAuthConfig(): GenericOAuthConfig[] {
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

  // Auth0
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
// Serialized provider list for the sign-in page
// ---------------------------------------------------------------------------

/** Returns provider info for the sign-in page — no auth runtime needed. */
export function getSerializedProviders(): SerializedProvider[] {
  const social = buildSocialProviders();
  const generic = buildGenericOAuthConfig();

  const providers: SerializedProvider[] = [];

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
