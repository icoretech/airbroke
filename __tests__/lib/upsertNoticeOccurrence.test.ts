import crypto from "node:crypto";
import { describe, expect, test, vi } from "vitest";
import { db } from "@/lib/db";
import { upsertNoticeOccurrence } from "@/lib/intake/upsertNoticeOccurrence";
import { Prisma } from "@/prisma/generated/client";
import { createProject } from "../factories/prismaFactories";
import type { NoticeError } from "@/lib/intake/normalizeNoticeData";

describe("upsertNoticeOccurrence", () => {
  test("updates", async () => {
    const project = await createProject();
    const errorData: NoticeError = {
      type: "Error",
      message: "Error: deadlock detected",
      backtrace: [],
    };

    const contextData = { environment: "test" };
    const environmentData = {};
    const sessionData = {};
    const requestParamsData = {};

    const sequentialRequests = 2;

    for (let i = 0; i < sequentialRequests; i++) {
      await expect(
        upsertNoticeOccurrence({
          project,
          error: errorData,
          context: contextData,
          environment: environmentData,
          session: sessionData,
          requestParams: requestParamsData,
        }),
      ).resolves.not.toThrow();
    }
  });

  test("stores a sha256 message hash for occurrence dedupe", async () => {
    const project = await createProject();
    const errorData: NoticeError = {
      type: "Error",
      message: "Error: message hash regression",
      backtrace: [],
    };

    await upsertNoticeOccurrence({
      project,
      error: errorData,
      context: { environment: "test" },
      environment: {},
      session: {},
      requestParams: {},
    });

    const occurrence = await db.occurrence.findFirst({
      where: {
        notice: {
          project_id: project.id,
          env: "test",
          kind: "Error",
        },
      },
      select: {
        message_hash: true,
      },
    });

    expect(occurrence?.message_hash).toBe(
      crypto
        .createHash("sha256")
        .update(errorData.message, "utf8")
        .digest("hex"),
    );
  });

  test("handles deadlocks", async () => {
    const project = await createProject();

    const errorData: NoticeError = {
      type: "Error",
      message: "Error: deadlock detected",
      backtrace: [],
    };

    const contextData = { environment: "test" };
    const environmentData = {};
    const sessionData = {};
    const requestParamsData = {};

    const parallelRequests = 5;
    const promises = [];

    for (let i = 0; i < parallelRequests; i++) {
      promises.push(
        upsertNoticeOccurrence({
          project,
          error: errorData,
          context: contextData,
          environment: environmentData,
          session: sessionData,
          requestParams: requestParamsData,
        }),
      );
    }

    await expect(Promise.all(promises)).resolves.not.toThrow();
  });

  test("throws after unique-conflict retries are exhausted", async () => {
    const project = await createProject();
    const errorData: NoticeError = {
      type: "Error",
      message: "Error: exhausted unique conflict",
      backtrace: [],
    };
    const conflict = new Prisma.PrismaClientKnownRequestError(
      "Unique constraint failed",
      {
        code: "P2002",
        clientVersion: "test",
      },
    );
    const debugSpy = vi
      .spyOn(console, "debug")
      .mockImplementation(() => undefined);
    const upsertSpy = vi.spyOn(db.notice, "upsert").mockRejectedValue(conflict);

    try {
      await expect(
        upsertNoticeOccurrence({
          project,
          error: errorData,
          context: { environment: "test" },
          environment: {},
          session: {},
          requestParams: {},
        }),
      ).rejects.toMatchObject({ code: "P2002" });
      expect(upsertSpy).toHaveBeenCalledTimes(3);
    } finally {
      upsertSpy.mockRestore();
      debugSpy.mockRestore();
    }
  });
});
