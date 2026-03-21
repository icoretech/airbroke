// __tests__/lib/processError.test.ts

import crypto from "node:crypto";
import { describe, expect, test } from "vitest";
import { db } from "@/lib/db";
import { processError } from "@/lib/processError";
import { createProject } from "../factories/prismaFactories";
import type { NoticeError } from "@/lib/parseNotice";

describe("processError", () => {
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

    // run processError sequentially
    const sequentialRequests = 2;

    for (let i = 0; i < sequentialRequests; i++) {
      await expect(
        processError(
          project,
          errorData,
          contextData,
          environmentData,
          sessionData,
          requestParamsData,
        ),
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

    await processError(project, errorData, { environment: "test" }, {}, {}, {});

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

    // run processError in parallel
    const parallelRequests = 5;
    const promises = [];

    for (let i = 0; i < parallelRequests; i++) {
      promises.push(
        processError(
          project,
          errorData,
          contextData,
          environmentData,
          sessionData,
          requestParamsData,
        ),
      );
    }

    // With the new concurrency safe code, we shouldn't get P2025 or P2002
    await expect(Promise.all(promises)).resolves.not.toThrow();
  });
});
