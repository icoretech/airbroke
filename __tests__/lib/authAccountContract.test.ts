// @vitest-environment node

import { randomUUID } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getAuth } from "@/lib/auth";
import { db } from "@/lib/db";

describe("Better Auth account persistence contract", () => {
  const emails: string[] = [];

  beforeEach(() => {
    for (const key of Object.keys(process.env)) {
      if (key.startsWith("AIRBROKE_")) vi.stubEnv(key, "");
    }
  });

  afterEach(async () => {
    await db.user.deleteMany({ where: { email: { in: emails } } });
    emails.length = 0;
    vi.unstubAllEnvs();
  });

  it("persists an expiring GitHub account and session when OAuth creates a user without issuer", async () => {
    // Given the real configured auth instance and synthetic OAuth credentials.
    const { internalAdapter } = await getAuth().$context;
    const email = `account-${randomUUID()}@example.com`;
    emails.push(email);
    const accountId = randomUUID();
    const accessTokenExpiresAt = new Date(Date.now() + 3600000);
    const refreshTokenExpiresAt = new Date(Date.now() + 86400000);

    // When Better Auth creates the user and account through its Prisma adapter.
    const created = await internalAdapter.createOAuthUser(
      { email, name: "Example User", emailVerified: true },
      {
        providerId: "github",
        accountId,
        accessToken: "synthetic-access-token",
        refreshToken: "synthetic-refresh-token",
        accessTokenExpiresAt,
        refreshTokenExpiresAt,
        scope: "read:user user:email",
      },
    );
    const session = await internalAdapter.createSession(created.user.id);

    // Then the actual database row and subsequent account lookup agree.
    expect(session?.userId).toBe(created.user.id);
    expect(
      await db.account.findUnique({ where: { id: created.account.id } }),
    ).toMatchObject({
      providerId: "github",
      accountId,
      issuer: null,
      accessTokenExpiresAt,
      refreshTokenExpiresAt,
    });
    expect(
      await internalAdapter.findAccountByKey({
        providerId: "github",
        accountId,
      }),
    ).toMatchObject({ id: created.account.id, userId: created.user.id });
  });

  it("keeps providers isolated when their external account IDs match", async () => {
    // Given one existing user and a shared external identifier.
    const { internalAdapter } = await getAuth().$context;
    const email = `account-${randomUUID()}@example.com`;
    emails.push(email);
    const user = await db.user.create({
      data: { email, name: "Example User" },
    });
    const accountId = randomUUID();

    // When two independently configured providers issue the same subject.
    const first = await internalAdapter.createAccount({
      userId: user.id,
      providerId: "example-oidc-a",
      accountId,
    });
    const second = await internalAdapter.createAccount({
      userId: user.id,
      providerId: "example-oidc-b",
      accountId,
    });

    // Then both remain individually addressable and duplicate identities fail closed.
    expect(first.id).not.toBe(second.id);
    expect(
      await internalAdapter.findAccountByKey({
        providerId: "example-oidc-a",
        accountId,
      }),
    ).toMatchObject({ id: first.id });
    expect(
      await internalAdapter.findAccountByKey({
        providerId: "example-oidc-b",
        accountId,
      }),
    ).toMatchObject({ id: second.id });
    await expect(
      internalAdapter.createAccount({
        userId: user.id,
        providerId: "example-oidc-a",
        accountId,
      }),
    ).rejects.toMatchObject({ code: "P2002" });
  });

  it("finds a migrated account when its legacy issuer is still stored", async () => {
    // Given a pre-upgrade account retaining its original issuer metadata.
    const { internalAdapter } = await getAuth().$context;
    const email = `account-${randomUUID()}@example.com`;
    emails.push(email);
    const user = await db.user.create({
      data: { email, name: "Example User" },
    });
    const accountId = randomUUID();
    const account = await db.account.create({
      data: {
        userId: user.id,
        providerId: "github",
        accountId,
        issuer: "local:oauth:github",
      },
    });

    // When the current library resolves the returning user's provider key.
    const found = await internalAdapter.findAccountByKey({
      providerId: "github",
      accountId,
    });

    // Then it selects the existing row without rewriting its identity.
    expect(found).toMatchObject({ id: account.id, userId: user.id });
  });
});
