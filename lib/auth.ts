// lib/auth.ts

import Apple from "@auth/core/providers/apple";
import Atlassian from "@auth/core/providers/atlassian";
import Auth0 from "@auth/core/providers/auth0";
import Authentik from "@auth/core/providers/authentik";
import Bitbucket from "@auth/core/providers/bitbucket";
import BoxyHQSAML from "@auth/core/providers/boxyhq-saml";
import Cognito from "@auth/core/providers/cognito";
import Github from "@auth/core/providers/github";
import Gitlab from "@auth/core/providers/gitlab";
import Google from "@auth/core/providers/google";
import Keycloak from "@auth/core/providers/keycloak";
import MicrosoftEntraID from "@auth/core/providers/microsoft-entra-id";
import Okta from "@auth/core/providers/okta";
import Slack from "@auth/core/providers/slack";
import NextAuth from "next-auth";
import { PrismaAdapter } from "@/lib/auth/prismaAdapter";
import { db } from "@/lib/db";
import type { Profile } from "next-auth";
import type { Adapter, AdapterAccount } from "next-auth/adapters";

type ExtendedProfile = Profile & { [key: string]: unknown };

const CustomPrismaAdapter = (): Adapter => {
  const baseAdapter = PrismaAdapter(db);

  return {
    ...baseAdapter,
    linkAccount(account: AdapterAccount) {
      // Next-auth passes through all options gotten from keycloak, excessive ones must be removed.
      delete account["not-before-policy"];
      delete (account as Record<string, unknown>).refresh_expires_in;

      // Call the original linkAccount method
      if (baseAdapter.linkAccount) {
        return baseAdapter.linkAccount(account);
      }

      return null;
    },
    // You can override other methods here if needed
  };
};

const getProviders = () => {
  const providers = [];

  if (process.env.AIRBROKE_GITHUB_ID && process.env.AIRBROKE_GITHUB_SECRET) {
    providers.push(
      Github({
        clientId: process.env.AIRBROKE_GITHUB_ID,
        clientSecret: process.env.AIRBROKE_GITHUB_SECRET,
        authorization: {
          url: "https://github.com/login/oauth/authorize",
          params: { scope: "read:user user:email read:org" },
        },
      }),
    );
  }

  if (
    process.env.AIRBROKE_ATLASSIAN_ID &&
    process.env.AIRBROKE_ATLASSIAN_SECRET
  ) {
    providers.push(
      Atlassian({
        clientId: process.env.AIRBROKE_ATLASSIAN_ID,
        clientSecret: process.env.AIRBROKE_ATLASSIAN_SECRET,
      }),
    );
  }

  if (process.env.AIRBROKE_GOOGLE_ID && process.env.AIRBROKE_GOOGLE_SECRET) {
    providers.push(
      Google({
        clientId: process.env.AIRBROKE_GOOGLE_ID,
        clientSecret: process.env.AIRBROKE_GOOGLE_SECRET,
      }),
    );
  }

  if (process.env.AIRBROKE_APPLE_ID && process.env.AIRBROKE_APPLE_SECRET) {
    providers.push(
      Apple({
        clientId: process.env.AIRBROKE_APPLE_ID,
        clientSecret: process.env.AIRBROKE_APPLE_SECRET,
      }),
    );
  }

  if (process.env.AIRBROKE_SLACK_ID && process.env.AIRBROKE_SLACK_SECRET) {
    providers.push(
      Slack({
        clientId: process.env.AIRBROKE_SLACK_ID,
        clientSecret: process.env.AIRBROKE_SLACK_SECRET,
      }),
    );
  }

  if (
    process.env.AIRBROKE_AUTHENTIK_ID &&
    process.env.AIRBROKE_AUTHENTIK_SECRET &&
    process.env.AIRBROKE_AUTHENTIK_ISSUER
  ) {
    providers.push(
      Authentik({
        clientId: process.env.AIRBROKE_AUTHENTIK_ID,
        clientSecret: process.env.AIRBROKE_AUTHENTIK_SECRET,
        issuer: process.env.AIRBROKE_AUTHENTIK_ISSUER,
      }),
    );
  }

  if (
    process.env.AIRBROKE_OKTA_ID &&
    process.env.AIRBROKE_OKTA_SECRET &&
    process.env.AIRBROKE_OKTA_ISSUER
  ) {
    providers.push(
      Okta({
        clientId: process.env.AIRBROKE_OKTA_ID,
        clientSecret: process.env.AIRBROKE_OKTA_SECRET,
        issuer: process.env.AIRBROKE_OKTA_ISSUER,
      }),
    );
  }

  if (
    process.env.AIRBROKE_COGNITO_ID &&
    process.env.AIRBROKE_COGNITO_SECRET &&
    process.env.AIRBROKE_COGNITO_ISSUER
  ) {
    providers.push(
      Cognito({
        clientId: process.env.AIRBROKE_COGNITO_ID,
        clientSecret: process.env.AIRBROKE_COGNITO_SECRET,
        issuer: process.env.AIRBROKE_COGNITO_ISSUER,
      }),
    );
  }

  if (process.env.AIRBROKE_GITLAB_ID && process.env.AIRBROKE_GITLAB_SECRET) {
    providers.push(
      Gitlab({
        clientId: process.env.AIRBROKE_GITLAB_ID,
        clientSecret: process.env.AIRBROKE_GITLAB_SECRET,
        ...(process.env.AIRBROKE_GITLAB_GROUPS && {
          authorization: {
            params: { scope: "read_user read_api" },
          },
        }),
      }),
    );
  }

  if (
    process.env.AIRBROKE_KEYCLOAK_ID &&
    process.env.AIRBROKE_KEYCLOAK_SECRET &&
    process.env.AIRBROKE_KEYCLOAK_ISSUER
  ) {
    providers.push(
      Keycloak({
        clientId: process.env.AIRBROKE_KEYCLOAK_ID,
        clientSecret: process.env.AIRBROKE_KEYCLOAK_SECRET,
        issuer: process.env.AIRBROKE_KEYCLOAK_ISSUER,
      }),
    );
  }

  if (
    process.env.AIRBROKE_MICROSOFT_ENTRA_ID_CLIENT_ID &&
    process.env.AIRBROKE_MICROSOFT_ENTRA_ID_CLIENT_SECRET &&
    process.env.AIRBROKE_MICROSOFT_ENTRA_ID_ISSUER
  ) {
    providers.push(
      MicrosoftEntraID({
        clientId: process.env.AIRBROKE_MICROSOFT_ENTRA_ID_CLIENT_ID,
        clientSecret: process.env.AIRBROKE_MICROSOFT_ENTRA_ID_CLIENT_SECRET,
        issuer: process.env.AIRBROKE_MICROSOFT_ENTRA_ID_ISSUER,
      }),
    );
  }

  if (
    process.env.AIRBROKE_AUTH0_ID &&
    process.env.AIRBROKE_AUTH0_SECRET &&
    process.env.AIRBROKE_AUTH0_ISSUER
  ) {
    providers.push(
      Auth0({
        clientId: process.env.AIRBROKE_AUTH0_ID,
        clientSecret: process.env.AIRBROKE_AUTH0_SECRET,
        issuer: process.env.AIRBROKE_AUTH0_ISSUER,
      }),
    );
  }

  if (
    process.env.AIRBROKE_BOXYHQ_SAML_ID &&
    process.env.AIRBROKE_BOXYHQ_SAML_SECRET &&
    process.env.AIRBROKE_BOXYHQ_SAML_ISSUER
  ) {
    const authorizationParams: Record<string, string> = {};
    if (process.env.AIRBROKE_BOXYHQ_SAML_TENANT) {
      authorizationParams.tenant = process.env.AIRBROKE_BOXYHQ_SAML_TENANT;
    }
    if (process.env.AIRBROKE_BOXYHQ_SAML_PRODUCT) {
      authorizationParams.product = process.env.AIRBROKE_BOXYHQ_SAML_PRODUCT;
    }

    providers.push(
      BoxyHQSAML({
        clientId: process.env.AIRBROKE_BOXYHQ_SAML_ID,
        clientSecret: process.env.AIRBROKE_BOXYHQ_SAML_SECRET,
        issuer: process.env.AIRBROKE_BOXYHQ_SAML_ISSUER,
        ...(Object.keys(authorizationParams).length > 0 && {
          authorization: { params: authorizationParams },
        }),
      }),
    );
  }

  if (
    process.env.AIRBROKE_BITBUCKET_ID &&
    process.env.AIRBROKE_BITBUCKET_SECRET
  ) {
    providers.push(
      Bitbucket({
        clientId: process.env.AIRBROKE_BITBUCKET_ID,
        clientSecret: process.env.AIRBROKE_BITBUCKET_SECRET,
      }),
    );
  }

  return providers;
};

export async function getSerializedProviders() {
  const providers = getProviders().map((provider) => ({
    id: provider.id,
    name: provider.name,
  }));
  return providers;
}

const trustHost =
  process.env.AUTH_TRUST_HOST == null
    ? true
    : process.env.AUTH_TRUST_HOST === "true";

export const { handlers, auth } = NextAuth({
  session: {
    strategy: "jwt",
  },
  debug: process.env.AUTH_DEBUG === "true",
  providers: getProviders(),
  trustHost,
  adapter: CustomPrismaAdapter(),
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    jwt({ token, user }) {
      // Persist the user id to the token right after signin
      if (user?.id) {
        token.id = user.id;
      }
      return token;
    },
    authorized: async ({ auth }) => {
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
    async signIn({ account, profile }): Promise<boolean | string> {
      const extendedProfile = profile as ExtendedProfile;

      if (
        account?.provider === "google" &&
        process.env.AIRBROKE_GOOGLE_DOMAINS
      ) {
        const domains = process.env.AIRBROKE_GOOGLE_DOMAINS.split(",");
        const emailDomain = extendedProfile?.email?.split("@")[1];
        // Coerce to boolean explicitly
        return !!(
          extendedProfile?.email_verified &&
          emailDomain &&
          domains.includes(emailDomain)
        );
      }

      if (account?.provider === "github" && process.env.AIRBROKE_GITHUB_ORGS) {
        const allowedOrgs = process.env.AIRBROKE_GITHUB_ORGS.split(",");
        const token = account.access_token;

        try {
          const response = await fetch("https://api.github.com/user/orgs", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/vnd.github.v3+json",
              "User-Agent": "airbroke",
            },
          });

          if (!response.ok) {
            console.error(
              "Failed to fetch user organizations:",
              response.status,
              response.statusText,
            );
            return false;
          }

          const orgsResponse = await response.json();
          const userOrgs = orgsResponse.map(
            (org: { login: string }) => org.login,
          );

          // Ensure the return value is strictly boolean
          return userOrgs.some((org: string) => allowedOrgs.includes(org));
        } catch (error) {
          console.error("Error fetching user organizations:", error);
          return false;
        }
      }

      if (account?.provider === "auth0" && process.env.AIRBROKE_AUTH0_DOMAINS) {
        const domains = process.env.AIRBROKE_AUTH0_DOMAINS.split(",");
        const emailDomain = extendedProfile?.email?.split("@")[1];
        return !!(
          extendedProfile?.email_verified &&
          emailDomain &&
          domains.includes(emailDomain)
        );
      }

      if (
        account?.provider === "boxyhq-saml" &&
        process.env.AIRBROKE_BOXYHQ_SAML_DOMAINS
      ) {
        const domains = process.env.AIRBROKE_BOXYHQ_SAML_DOMAINS.split(",");
        const emailDomain = extendedProfile?.email?.split("@")[1];
        return !!(emailDomain && domains.includes(emailDomain));
      }

      if (
        account?.provider === "bitbucket" &&
        process.env.AIRBROKE_BITBUCKET_WORKSPACES
      ) {
        const allowedWorkspaces =
          process.env.AIRBROKE_BITBUCKET_WORKSPACES.split(",");
        const token = account.access_token;

        try {
          const response = await fetch(
            "https://api.bitbucket.org/2.0/workspaces?role=member",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          if (!response.ok) {
            console.error(
              "Failed to fetch user workspaces:",
              response.status,
              response.statusText,
            );
            return false;
          }

          const data = await response.json();
          const userWorkspaces = data.values.map(
            (ws: { slug: string }) => ws.slug,
          );

          return userWorkspaces.some((ws: string) =>
            allowedWorkspaces.includes(ws),
          );
        } catch (error) {
          console.error("Error fetching user workspaces:", error);
          return false;
        }
      }

      if (
        account?.provider === "gitlab" &&
        process.env.AIRBROKE_GITLAB_GROUPS
      ) {
        const allowedGroups = process.env.AIRBROKE_GITLAB_GROUPS.split(",");
        const token = account.access_token;

        try {
          const gitlabUrl = (
            process.env.AIRBROKE_GITLAB_URL ?? "https://gitlab.com"
          ).replace(/\/+$/, "");
          const response = await fetch(
            `${gitlabUrl}/api/v4/groups?min_access_level=10`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          if (!response.ok) {
            console.error(
              "Failed to fetch user groups:",
              response.status,
              response.statusText,
            );
            return false;
          }

          const groups = await response.json();
          const userGroups = groups.map(
            (group: { full_path: string }) => group.full_path,
          );

          return userGroups.some((group: string) =>
            allowedGroups.includes(group),
          );
        } catch (error) {
          console.error("Error fetching user groups:", error);
          return false;
        }
      }

      if (
        account?.provider === "atlassian" &&
        process.env.AIRBROKE_ATLASSIAN_SITES
      ) {
        const allowedSites = process.env.AIRBROKE_ATLASSIAN_SITES.split(",");
        const token = account.access_token;

        try {
          const response = await fetch(
            "https://api.atlassian.com/oauth/token/accessible-resources",
            {
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
              },
            },
          );

          if (!response.ok) {
            console.error(
              "Failed to fetch accessible resources:",
              response.status,
              response.statusText,
            );
            return false;
          }

          const resources = await response.json();
          const userSites = resources.map(
            (resource: { name: string }) => resource.name,
          );

          return userSites.some((site: string) => allowedSites.includes(site));
        } catch (error) {
          console.error("Error fetching accessible resources:", error);
          return false;
        }
      }

      if (
        account?.provider === "slack" &&
        process.env.AIRBROKE_SLACK_WORKSPACES
      ) {
        const allowedWorkspaces =
          process.env.AIRBROKE_SLACK_WORKSPACES.split(",");
        const teamId = extendedProfile?.["https://slack.com/team_id"] as
          | string
          | undefined;

        if (!teamId) {
          console.error("Slack profile missing team_id claim");
          return false;
        }

        return allowedWorkspaces.includes(teamId);
      }

      if (
        account?.provider === "microsoft-entra-id" &&
        process.env.AIRBROKE_MICROSOFT_ENTRA_ID_TENANTS
      ) {
        const allowedTenants =
          process.env.AIRBROKE_MICROSOFT_ENTRA_ID_TENANTS.split(",");
        const tid = (extendedProfile as Record<string, unknown>)?.tid as
          | string
          | undefined;

        if (!tid) {
          console.error("Microsoft Entra ID profile missing tenant ID");
          return false;
        }

        return allowedTenants.includes(tid);
      }

      // Default return value
      return true;
    },
  },
  theme: {
    colorScheme: "dark", // "auto" | "dark" | "light"
    brandColor: "#192231", // Hex color code
    logo: "https://i.imgur.com/dPL9YEz.png", // Absolute URL to image
    buttonText: "", // Hex color code
  },
});
