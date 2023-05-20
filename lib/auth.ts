import type { NextAuthOptions, Profile } from "next-auth";
import AtlassianProvider from "next-auth/providers/atlassian";
import AzureADProvider from "next-auth/providers/azure-ad";
import CognitoProvider from "next-auth/providers/cognito";
import GithubProvider from "next-auth/providers/github";
import GitlabProvider from "next-auth/providers/gitlab";
import GoogleProvider from "next-auth/providers/google";
import KeycloakProvider from "next-auth/providers/keycloak";
import { Octokit } from "octokit";

type ExtendedProfile = Profile & { [key: string]: any; };

const getProviders = () => {
  let providers = [];

  if (process.env.GITHUB_ID && process.env.GITHUB_SECRET) {
    providers.push(GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      authorization: {
        url: "https://github.com/login/oauth/authorize",
        params: { scope: "read:user user:email user read:org" },
      },
    }));
  }

  if (process.env.ATLASSIAN_ID && process.env.ATLASSIAN_SECRET) {
    providers.push(AtlassianProvider({
      clientId: process.env.ATLASSIAN_ID,
      clientSecret: process.env.ATLASSIAN_SECRET,
    }));
  }

  if (process.env.GOOGLE_ID && process.env.GOOGLE_SECRET) {
    providers.push(GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }));
  }

  if (process.env.COGNITO_ID && process.env.COGNITO_SECRET) {
    providers.push(CognitoProvider({
      clientId: process.env.COGNITO_ID,
      clientSecret: process.env.COGNITO_SECRET,
      issuer: process.env.COGNITO_ISSUER,
    }));
  }

  if (process.env.GITLAB_ID && process.env.GITLAB_SECRET) {
    providers.push(GitlabProvider({
      clientId: process.env.GITLAB_ID,
      clientSecret: process.env.GITLAB_SECRET,
    }));
  }

  if (process.env.KEYCLOAK_ID && process.env.KEYCLOAK_SECRET) {
    providers.push(KeycloakProvider({
      clientId: process.env.KEYCLOAK_ID,
      clientSecret: process.env.KEYCLOAK_SECRET,
      issuer: process.env.KEYCLOAK_ISSUER,
    }));
  }

  if (process.env.AZURE_AD_CLIENT_ID && process.env.AZURE_AD_CLIENT_SECRET) {
    providers.push(AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
      tenantId: process.env.AZURE_AD_TENANT_ID,
    }));
  }

  return providers;
};

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  debug: process.env.NEXTAUTH_DEBUG === "true",
  providers: getProviders(),
  callbacks: {
    async signIn({ account, profile }) {
      const extendedProfile = profile as ExtendedProfile;

      if (account?.provider === "google" && process.env.GOOGLE_DOMAINS) {
        const domains = process.env.GOOGLE_DOMAINS.split(",");
        const emailDomain = extendedProfile?.email?.split("@")[1];
        return extendedProfile?.email_verified && emailDomain && domains.includes(emailDomain);
      }

      if (account?.provider === "github" && process.env.GITHUB_ORGS) {
        const allowedOrgs = process.env.GITHUB_ORGS.split(",");
        const token = account.access_token;
        const octokit = new Octokit({ auth: token, userAgent: "airbroke" });
        const orgsResponse = await octokit.rest.orgs.listForAuthenticatedUser();
        const userOrgs = orgsResponse.data.map(org => org.login);

        // Check if the user is part of at least one of the allowed organizations
        return userOrgs.some(org => allowedOrgs.includes(org));
      }
      return true;
    },
  },
  theme: {
    colorScheme: "dark", // "auto" | "dark" | "light"
    brandColor: "#192231", // Hex color code
    logo: "", // Absolute URL to image
    buttonText: "" // Hex color code
  }
};
