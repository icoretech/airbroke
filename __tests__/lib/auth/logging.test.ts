// @vitest-environment node

import { createLogger } from "better-auth";
import { afterEach, describe, expect, it, vi } from "vitest";
import { authLogger, logPrismaEvent } from "@/lib/auth/logging";
import { Prisma } from "@/prisma/generated/client";

const accessToken = "synthetic-private-access-token-for-logging-test";
const refreshToken = "synthetic-private-refresh-token-for-logging-test";

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("authentication log boundary", () => {
  it("excludes forged stack frames embedded in an error message", () => {
    // Given an actual Error whose message contains a credential-shaped frame.
    const error = new Error(`Provider response\n    at ${accessToken}.js:1:1`);
    const output = vi.spyOn(console, "error").mockImplementation(() => {});

    // When Better Auth emits that error through the configured logger.
    createLogger(authLogger).error("Unable to link account", error);

    // Then only real source locations survive the summary boundary.
    expect(output).toHaveBeenCalledWith(
      expect.objectContaining({
        errors: [
          expect.objectContaining({
            stack: expect.arrayContaining([
              expect.objectContaining({ file: "logging.test.ts" }),
            ]),
          }),
        ],
      }),
    );
    expect(JSON.stringify(output.mock.calls)).not.toContain(accessToken);
  });

  it("keeps real Prisma validation and Better Auth errors visible without OAuth input", async () => {
    // Given production logging against the dedicated test database.
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("TESTING", "");
    const output = vi.spyOn(console, "error").mockImplementation(() => {});
    const { db } = await import("@/lib/db");
    const client = db();
    const logger = createLogger(authLogger);
    let failure: unknown;

    // When the real client rejects an invalid account containing credentials,
    // and Better Auth logs that same error through its actual logger factory.
    try {
      await Reflect.apply(client.account.create, client.account, [
        {
          data: {
            providerId: 42,
            accountId: "synthetic-account",
            userId: "synthetic-user",
            accessToken,
            refreshToken,
          },
        },
      ]);
    } catch (error) {
      failure = error;
      logger.error("Unable to create OAuth user", error);
    } finally {
      await client.$disconnect();
    }

    // Then both emit errors, retaining identity/location without the query data.
    expect(failure).toBeInstanceOf(Prisma.PrismaClientValidationError);
    expect(failure).toHaveProperty(
      "message",
      expect.stringContaining(accessToken),
    );
    expect(output.mock.calls).toEqual(
      expect.arrayContaining([
        [
          expect.objectContaining({
            source: "prisma",
            target: "account.create",
          }),
        ],
        [
          expect.objectContaining({
            source: "better-auth",
            errors: [
              expect.objectContaining({
                name: "PrismaClientValidationError",
                stack: expect.arrayContaining([
                  expect.objectContaining({ line: expect.any(Number) }),
                ]),
              }),
            ],
          }),
        ],
      ]),
    );
    const logged = JSON.stringify(output.mock.calls);
    expect(logged).not.toContain(accessToken);
    expect(logged).not.toContain(refreshToken);
  });

  it("retains Prisma error codes without serializing error metadata or causes", () => {
    // Given a real Prisma error carrying provider data in several properties.
    const error = new Prisma.PrismaClientKnownRequestError(accessToken, {
      code: "P2002",
      clientVersion: Prisma.prismaVersion.client,
      meta: { accessToken, refreshToken },
    });
    error.cause = new Error(refreshToken);
    const output = vi.spyOn(console, "error").mockImplementation(() => {});

    // When the library emits the error.
    createLogger(authLogger).error("Unable to link account", error);

    // Then the operational code survives and private payloads do not.
    expect(output).toHaveBeenCalledWith(
      expect.objectContaining({
        errors: [
          expect.objectContaining({
            name: "PrismaClientKnownRequestError",
            code: "P2002",
          }),
        ],
      }),
    );
    expect(JSON.stringify(output.mock.calls)).not.toContain(accessToken);
    expect(JSON.stringify(output.mock.calls)).not.toContain(refreshToken);
  });

  it("emits warnings without interpolated provider messages or object payloads", () => {
    // Given a provider-controlled warning message and arbitrary arguments.
    const output = vi.spyOn(console, "warn").mockImplementation(() => {});

    // When Better Auth publishes the warning through its real logger.
    createLogger(authLogger).warn(`Provider response: ${accessToken}`, {
      refreshToken,
    });

    // Then the warning remains observable with a stable event fingerprint.
    expect(output).toHaveBeenCalledWith(
      expect.objectContaining({
        source: "better-auth",
        fingerprint: expect.stringMatching(/^[a-f0-9]{64}$/),
        argumentCount: 1,
      }),
    );
    expect(JSON.stringify(output.mock.calls)).not.toContain(accessToken);
    expect(JSON.stringify(output.mock.calls)).not.toContain(refreshToken);
  });

  it("emits Prisma warnings without their message payload", () => {
    // Given a Prisma warning with sensitive content.
    const output = vi.spyOn(console, "warn").mockImplementation(() => {});

    // When the event handler receives the warning.
    logPrismaEvent("warn", {
      message: accessToken,
      timestamp: new Date(0),
      target: "prisma:client",
    });

    // Then severity and target remain available without the message content.
    expect(output).toHaveBeenCalledWith(
      expect.objectContaining({ source: "prisma", target: "prisma:client" }),
    );
    expect(JSON.stringify(output.mock.calls)).not.toContain(accessToken);
  });
});
