// lib/auth.ts

import prisma from '@/lib/db';
import AtlassianProvider from '@auth/core/providers/atlassian';
import CognitoProvider from '@auth/core/providers/cognito';
import GithubProvider from '@auth/core/providers/github';
import GitlabProvider from '@auth/core/providers/gitlab';
import GoogleProvider from '@auth/core/providers/google';
import KeycloakProvider from '@auth/core/providers/keycloak';
import MicrosoftEntraID from '@auth/core/providers/microsoft-entra-id';
import { PrismaAdapter } from '@auth/prisma-adapter';
import type { Account, Profile } from 'next-auth';
import NextAuth from 'next-auth';
import type { Adapter, AdapterAccount } from 'next-auth/adapters';

type ExtendedProfile = Profile & { [key: string]: any };

const CustomPrismaAdapter = (): Adapter => {
  const baseAdapter = PrismaAdapter(prisma);

  return {
    ...baseAdapter,
    linkAccount(account: AdapterAccount) {
      // Next-auth passes through all options gotten from keycloak, excessive ones must be removed.
      delete account['not-before-policy'];
      delete account['refresh_expires_in'];

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
  let providers = [];

  if (process.env.AIRBROKE_GITHUB_ID && process.env.AIRBROKE_GITHUB_SECRET) {
    providers.push(
      GithubProvider({
        clientId: process.env.AIRBROKE_GITHUB_ID,
        clientSecret: process.env.AIRBROKE_GITHUB_SECRET,
        authorization: {
          url: 'https://github.com/login/oauth/authorize',
          params: { scope: 'read:user user:email read:org' },
        },
      })
    );
  }

  if (process.env.AIRBROKE_ATLASSIAN_ID && process.env.AIRBROKE_ATLASSIAN_SECRET) {
    providers.push(
      AtlassianProvider({
        clientId: process.env.AIRBROKE_ATLASSIAN_ID,
        clientSecret: process.env.AIRBROKE_ATLASSIAN_SECRET,
      })
    );
  }

  if (process.env.AIRBROKE_GOOGLE_ID && process.env.AIRBROKE_GOOGLE_SECRET) {
    providers.push(
      GoogleProvider({
        clientId: process.env.AIRBROKE_GOOGLE_ID,
        clientSecret: process.env.AIRBROKE_GOOGLE_SECRET,
      })
    );
  }

  if (process.env.AIRBROKE_COGNITO_ID && process.env.AIRBROKE_COGNITO_SECRET) {
    providers.push(
      CognitoProvider({
        clientId: process.env.AIRBROKE_COGNITO_ID,
        clientSecret: process.env.AIRBROKE_COGNITO_SECRET,
        issuer: process.env.AIRBROKE_COGNITO_ISSUER,
      })
    );
  }

  if (process.env.AIRBROKE_GITLAB_ID && process.env.AIRBROKE_GITLAB_SECRET) {
    providers.push(
      GitlabProvider({
        clientId: process.env.AIRBROKE_GITLAB_ID,
        clientSecret: process.env.AIRBROKE_GITLAB_SECRET,
      })
    );
  }

  if (process.env.AIRBROKE_KEYCLOAK_ID && process.env.AIRBROKE_KEYCLOAK_SECRET) {
    providers.push(
      KeycloakProvider({
        clientId: process.env.AIRBROKE_KEYCLOAK_ID,
        clientSecret: process.env.AIRBROKE_KEYCLOAK_SECRET,
        issuer: process.env.AIRBROKE_KEYCLOAK_ISSUER,
      })
    );
  }

  if (process.env.AIRBROKE_MICROSOFT_ENTRA_ID_CLIENT_ID && process.env.AIRBROKE_MICROSOFT_ENTRA_ID_CLIENT_SECRET) {
    providers.push(
      MicrosoftEntraID({
        clientId: process.env.AIRBROKE_MICROSOFT_ENTRA_ID_CLIENT_ID,
        clientSecret: process.env.AIRBROKE_MICROSOFT_ENTRA_ID_CLIENT_SECRET,
        issuer: process.env.AIRBROKE_MICROSOFT_ENTRA_ID_ISSUER,
      })
    );
  }

  return providers;
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: 'jwt',
  },
  debug: process.env.AUTH_DEBUG === 'true',
  providers: getProviders(),
  trustHost: true,
  adapter: CustomPrismaAdapter(),
  callbacks: {
    jwt({ token, account, user }) {
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
    async signIn({ account, profile }: { account: Account | null; profile?: Profile }): Promise<boolean | string> {
      const extendedProfile = profile as ExtendedProfile;

      if (account?.provider === 'google' && process.env.AIRBROKE_GOOGLE_DOMAINS) {
        const domains = process.env.AIRBROKE_GOOGLE_DOMAINS.split(',');
        const emailDomain = extendedProfile?.email?.split('@')[1];
        // Coerce to boolean explicitly
        return !!(extendedProfile?.email_verified && emailDomain && domains.includes(emailDomain));
      }

      if (account?.provider === 'github' && process.env.AIRBROKE_GITHUB_ORGS) {
        const allowedOrgs = process.env.AIRBROKE_GITHUB_ORGS.split(',');
        const token = account.access_token;

        try {
          const response = await fetch('https://api.github.com/user/orgs', {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/vnd.github.v3+json',
              'User-Agent': 'airbroke',
            },
          });

          if (!response.ok) {
            console.error('Failed to fetch user organizations:', response.status, response.statusText);
            return false;
          }

          const orgsResponse = await response.json();
          const userOrgs = orgsResponse.map((org: { login: string }) => org.login);

          // Ensure the return value is strictly boolean
          return userOrgs.some((org: string) => allowedOrgs.includes(org));
        } catch (error) {
          console.error('Error fetching user organizations:', error);
          return false;
        }
      }

      // Default return value
      return true;
    },
  },
  theme: {
    colorScheme: 'dark', // "auto" | "dark" | "light"
    brandColor: '#192231', // Hex color code
    logo: 'https://i.imgur.com/dPL9YEz.png', // Absolute URL to image
    buttonText: '', // Hex color code
  },
});
