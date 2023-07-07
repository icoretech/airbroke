import prisma from "@/lib/db";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
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

  if (process.env.AIRBROKE_GITHUB_ID && process.env.AIRBROKE_GITHUB_SECRET) {
    providers.push(GithubProvider({
      clientId: process.env.AIRBROKE_GITHUB_ID,
      clientSecret: process.env.AIRBROKE_GITHUB_SECRET,
      authorization: {
        url: "https://github.com/login/oauth/authorize",
        params: { scope: "read:user user:email read:org" },
      },
    }));
  }

  if (process.env.AIRBROKE_ATLASSIAN_ID && process.env.AIRBROKE_ATLASSIAN_SECRET) {
    providers.push(AtlassianProvider({
      clientId: process.env.AIRBROKE_ATLASSIAN_ID,
      clientSecret: process.env.AIRBROKE_ATLASSIAN_SECRET,
    }));
  }

  if (process.env.AIRBROKE_GOOGLE_ID && process.env.AIRBROKE_GOOGLE_SECRET) {
    providers.push(GoogleProvider({
      clientId: process.env.AIRBROKE_GOOGLE_ID,
      clientSecret: process.env.AIRBROKE_GOOGLE_SECRET,
    }));
  }

  if (process.env.AIRBROKE_COGNITO_ID && process.env.AIRBROKE_COGNITO_SECRET) {
    providers.push(CognitoProvider({
      clientId: process.env.AIRBROKE_COGNITO_ID,
      clientSecret: process.env.AIRBROKE_COGNITO_SECRET,
      issuer: process.env.AIRBROKE_COGNITO_ISSUER,
    }));
  }

  if (process.env.AIRBROKE_GITLAB_ID && process.env.AIRBROKE_GITLAB_SECRET) {
    providers.push(GitlabProvider({
      clientId: process.env.AIRBROKE_GITLAB_ID,
      clientSecret: process.env.AIRBROKE_GITLAB_SECRET,
    }));
  }

  if (process.env.AIRBROKE_KEYCLOAK_ID && process.env.AIRBROKE_KEYCLOAK_SECRET) {
    providers.push(KeycloakProvider({
      clientId: process.env.AIRBROKE_KEYCLOAK_ID,
      clientSecret: process.env.AIRBROKE_KEYCLOAK_SECRET,
      issuer: process.env.AIRBROKE_KEYCLOAK_ISSUER,
    }));
  }

  if (process.env.AIRBROKE_AZURE_AD_CLIENT_ID && process.env.AIRBROKE_AZURE_AD_CLIENT_SECRET) {
    providers.push(AzureADProvider({
      clientId: process.env.AIRBROKE_AZURE_AD_CLIENT_ID,
      clientSecret: process.env.AIRBROKE_AZURE_AD_CLIENT_SECRET,
      tenantId: process.env.AIRBROKE_AZURE_AD_TENANT_ID,
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
  adapter: PrismaAdapter(prisma),

  callbacks: {
    async jwt({ token, account, user }) {
      // Persist the user id to the token right after signin
      if (user?.id) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session;
    },
    async signIn({ account, profile }) {
      const extendedProfile = profile as ExtendedProfile;

      if (account?.provider === "google" && process.env.AIRBROKE_GOOGLE_DOMAINS) {
        const domains = process.env.AIRBROKE_GOOGLE_DOMAINS.split(",");
        const emailDomain = extendedProfile?.email?.split("@")[1];
        return extendedProfile?.email_verified && emailDomain && domains.includes(emailDomain);
      }

      if (account?.provider === "github" && process.env.AIRBROKE_GITHUB_ORGS) {
        const allowedOrgs = process.env.AIRBROKE_GITHUB_ORGS.split(",");
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
    logo: "https://i.imgur.com/dPL9YEz.png", // Absolute URL to image
    buttonText: "" // Hex color code
  }
};
