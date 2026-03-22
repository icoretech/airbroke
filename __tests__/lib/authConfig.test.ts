// @vitest-environment node

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { nextAuthMock, prismaAdapterMock } = vi.hoisted(() => ({
  nextAuthMock: vi.fn((config: unknown) => {
    return {
      auth: vi.fn(),
      handlers: {},
      config,
    };
  }),
  prismaAdapterMock: vi.fn(() => ({})),
}));

vi.mock("next-auth", () => ({
  default: nextAuthMock,
}));

vi.mock("@/lib/auth/prismaAdapter", () => ({
  PrismaAdapter: prismaAdapterMock,
}));

vi.mock("@/lib/db", () => ({
  db: {},
}));

const originalAuthTrustHost = process.env.AUTH_TRUST_HOST;

async function loadAuthConfig(authTrustHost?: string) {
  vi.resetModules();
  nextAuthMock.mockClear();
  prismaAdapterMock.mockClear();

  if (authTrustHost == null) {
    delete process.env.AUTH_TRUST_HOST;
  } else {
    process.env.AUTH_TRUST_HOST = authTrustHost;
  }

  await import("@/lib/auth");

  const [config] = nextAuthMock.mock.calls.at(-1) ?? [];

  return config as { trustHost: boolean };
}

describe("auth trustHost config", () => {
  beforeEach(() => {
    if (originalAuthTrustHost == null) {
      delete process.env.AUTH_TRUST_HOST;
    } else {
      process.env.AUTH_TRUST_HOST = originalAuthTrustHost;
    }
  });

  afterEach(() => {
    if (originalAuthTrustHost == null) {
      delete process.env.AUTH_TRUST_HOST;
    } else {
      process.env.AUTH_TRUST_HOST = originalAuthTrustHost;
    }
  });

  it("defaults to trusting the host when AUTH_TRUST_HOST is unset", async () => {
    const config = await loadAuthConfig();

    expect(config.trustHost).toBe(true);
  });

  it('allows disabling host trust with AUTH_TRUST_HOST="false"', async () => {
    const config = await loadAuthConfig("false");

    expect(config.trustHost).toBe(false);
  });

  it('keeps host trust enabled with AUTH_TRUST_HOST="true"', async () => {
    const config = await loadAuthConfig("true");

    expect(config.trustHost).toBe(true);
  });
});
