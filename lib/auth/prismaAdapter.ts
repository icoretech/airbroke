// lib/auth/prismaAdapter.ts

import type {
  Adapter,
  AdapterAccount,
  AdapterAccountType,
  AdapterUser,
  VerificationToken,
} from "next-auth/adapters";
import type {
  Account,
  Prisma,
  PrismaClient,
  User,
} from "@/prisma/generated/client";

/**
 * Local Prisma adapter for Auth.js / NextAuth.
 *
 * We generate Prisma Client to `prisma/generated`, not `@prisma/client`,
 * so we implement the adapter against our generated types.
 */
export function PrismaAdapter(prisma: PrismaClient): Adapter {
  return {
    async createUser(user) {
      const data: Prisma.UserCreateInput = {
        email: user.email,
        emailVerified: user.emailVerified,
        name: user.name ?? null,
        image: user.image ?? null,
      };
      const created = await prisma.user.create({ data });
      return coerceAdapterUser(created);
    },

    async getUser(id) {
      const user = await prisma.user.findUnique({ where: { id } });
      return user ? coerceAdapterUser(user) : null;
    },

    async getUserByEmail(email) {
      const user = await prisma.user.findUnique({ where: { email } });
      return user ? coerceAdapterUser(user) : null;
    },

    async getUserByAccount({ provider, providerAccountId }) {
      const account = await prisma.account.findUnique({
        where: { provider_providerAccountId: { provider, providerAccountId } },
        include: { user: true },
      });
      if (!account?.user) return null;
      return coerceAdapterUser(account.user);
    },

    async updateUser(user) {
      const data: Prisma.UserUpdateInput = removeUndefined({
        email: user.email,
        emailVerified: user.emailVerified,
        name: user.name,
        image: user.image,
      });
      const updated = await prisma.user.update({
        where: { id: user.id },
        data,
      });
      return coerceAdapterUser(updated);
    },

    async deleteUser(userId) {
      await prisma.user.delete({ where: { id: userId } });
    },

    async linkAccount(account) {
      const data: Prisma.AccountUncheckedCreateInput = removeUndefined({
        userId: account.userId,
        type: account.type,
        provider: account.provider,
        providerAccountId: account.providerAccountId,
        refresh_token: pickString(account.refresh_token),
        access_token: pickString(account.access_token),
        expires_at: pickNumber(account.expires_at),
        token_type: pickString(account.token_type)?.toLowerCase() ?? null,
        scope: pickString(account.scope),
        id_token: pickString(account.id_token),
        session_state: pickString(account.session_state),
      });
      await prisma.account.create({ data });
    },

    async unlinkAccount({ provider, providerAccountId }) {
      await prisma.account.delete({
        where: { provider_providerAccountId: { provider, providerAccountId } },
      });
    },

    async createSession(session) {
      const data: Prisma.SessionUncheckedCreateInput = {
        sessionToken: session.sessionToken,
        userId: session.userId,
        expires: session.expires,
      };
      return prisma.session.create({ data });
    },

    async getSessionAndUser(sessionToken) {
      const userAndSession = await prisma.session.findUnique({
        where: { sessionToken },
        include: { user: true },
      });
      if (!userAndSession) return null;

      const user = coerceAdapterUserOrNull(userAndSession.user);
      if (!user) return null;

      const { user: _user, ...session } = userAndSession;
      return { user, session };
    },

    async updateSession(session) {
      const data: Prisma.SessionUncheckedUpdateInput = removeUndefined({
        userId: session.userId,
        expires: session.expires,
      });
      try {
        return await prisma.session.update({
          where: { sessionToken: session.sessionToken },
          data,
        });
      } catch {
        return null;
      }
    },

    async deleteSession(sessionToken) {
      try {
        await prisma.session.delete({ where: { sessionToken } });
      } catch {
        // Session may have been deleted already.
      }
    },

    async createVerificationToken(verificationToken: VerificationToken) {
      const data: Prisma.VerificationTokenCreateInput = {
        identifier: verificationToken.identifier,
        token: verificationToken.token,
        expires: verificationToken.expires,
      };
      return prisma.verificationToken.create({ data });
    },

    async useVerificationToken({ identifier, token }) {
      try {
        return await prisma.verificationToken.delete({
          where: { identifier_token: { identifier, token } },
        });
      } catch (error) {
        // If token already used/deleted, just return null
        // https://www.prisma.io/docs/reference/api-reference/error-reference#p2025
        if (
          error &&
          typeof error === "object" &&
          "code" in error &&
          error.code === "P2025"
        ) {
          return null;
        }
        throw error;
      }
    },

    async getAccount(providerAccountId, provider) {
      const account = await prisma.account.findFirst({
        where: { providerAccountId, provider },
      });
      return account ? coerceAdapterAccount(account) : null;
    },
  };
}

function coerceAdapterUserOrNull(user: User): AdapterUser | null {
  // Our schema allows `email` to be NULL, but Auth.js expects it to exist.
  // If it ever happens, treat it as missing user.
  if (!user.email) return null;
  return { ...user, email: user.email };
}

function coerceAdapterUser(user: User): AdapterUser {
  const coerced = coerceAdapterUserOrNull(user);
  if (!coerced) {
    throw new Error("Auth adapter: user.email is missing");
  }
  return coerced;
}

function coerceAdapterAccountType(type: string): AdapterAccountType | null {
  const allowed: AdapterAccountType[] = ["oauth", "oidc", "email", "webauthn"];
  return (allowed as readonly string[]).includes(type)
    ? (type as AdapterAccountType)
    : null;
}

function coerceAdapterAccount(account: Account): AdapterAccount {
  const type = coerceAdapterAccountType(account.type);
  if (!type) {
    throw new Error(`Auth adapter: unsupported account type "${account.type}"`);
  }
  return {
    ...account,
    type,
    access_token: account.access_token ?? undefined,
    refresh_token: account.refresh_token ?? undefined,
    id_token: account.id_token ?? undefined,
    token_type:
      account.token_type !== null
        ? (account.token_type.toLowerCase() as Lowercase<string>)
        : undefined,
    scope: account.scope ?? undefined,
    session_state: account.session_state ?? undefined,
    expires_at: account.expires_at ?? undefined,
  };
}

function removeUndefined<T extends object>(obj: T): T {
  const result: Record<string, unknown> = {};
  for (const key in obj) {
    const value = (obj as Record<string, unknown>)[key];
    if (value !== undefined) result[key] = value;
  }
  return result as T;
}

function pickString(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function pickNumber(value: unknown): number | null {
  return typeof value === "number" ? value : null;
}
