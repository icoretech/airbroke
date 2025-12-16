// @vitest-environment node

import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { startCaptureServer } from "@/__tests__/helpers/captureServer";

vi.mock("@/lib/db", () => ({
  db: {
    project: {
      findFirst: vi.fn(),
    },
  },
}));

vi.mock("@/lib/processError", () => ({
  processError: vi.fn(),
}));

const { db } = await import("@/lib/db");
const { processError } = await import("@/lib/processError");
const { POST } = await import("@/app/api/v3/notices/route");

describe("Airbrake SDK → Airbroke intake contract", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("accepts payload produced by @airbrake/node", async () => {
    const projectKey = "k1";
    const { baseUrl, requests, close } = await startCaptureServer();

    const { Notifier } = await import("@airbrake/node");
    type ProcessOn = typeof process.on;
    type ProcessEvent = Parameters<ProcessOn>[0];
    type ProcessListener = Parameters<ProcessOn>[1];

    const addedListeners: Array<{
      event: ProcessEvent;
      listener: ProcessListener;
    }> = [];
    const originalOn: ProcessOn = process.on.bind(process);
    const patchedOn = ((event: ProcessEvent, listener: ProcessListener) => {
      addedListeners.push({ event, listener });
      return originalOn(event, listener);
    }) as ProcessOn;

    process.on = patchedOn;

    const notifier = new Notifier({
      projectId: 1,
      projectKey,
      environment: "test",
      host: baseUrl,
      timeout: 2000,
      remoteConfig: false,
      performanceStats: false,
      queryStats: false,
      queueStats: false,
    });

    process.on = originalOn;

    await notifier.notify(new Error("[AirbrakeNode] SDK contract test"));
    await close();
    for (const { event, listener } of addedListeners) {
      process.removeListener(event, listener);
    }

    expect(requests).toHaveLength(1);
    const [captured] = requests;

    expect(captured?.method).toBe("POST");
    expect(captured?.url).toBe("/api/v3/projects/1/notices?key=k1");
    expect(typeof captured?.body).toBe("string");

    const body = captured.body;
    const parsedBody = JSON.parse(body) as {
      errors?: unknown[];
      context?: Record<string, unknown>;
    };

    expect(Array.isArray(parsedBody.errors)).toBe(true);
    expect(typeof parsedBody.context).toBe("object");

    vi.mocked(db.project.findFirst).mockResolvedValue({
      id: "p1",
      api_key: projectKey,
      paused: false,
    } as unknown as Awaited<ReturnType<typeof db.project.findFirst>>);

    const req = new NextRequest(
      new URL(`http://localhost/api/v3/notices?key=${projectKey}`),
      {
        method: "POST",
        body,
        headers: {
          "content-type":
            typeof captured.headers["content-type"] === "string"
              ? captured.headers["content-type"]
              : "text/plain;charset=UTF-8",
        },
      },
    );

    const res = await POST(req);
    expect(res.status).toBe(201);
    expect(processError).toHaveBeenCalledTimes(1);
  });

  it("accepts payload produced by @airbrake/browser", async () => {
    const projectKey = "k2";
    const { baseUrl, requests, close } = await startCaptureServer();

    const { Notifier } = await import("@airbrake/browser");
    const notifier = new Notifier({
      projectId: 1,
      projectKey,
      environment: "test",
      host: baseUrl,
      timeout: 2000,
      remoteConfig: false,
      performanceStats: false,
      queryStats: false,
      queueStats: false,
      instrumentation: {
        onerror: false,
        fetch: false,
        history: false,
        console: false,
        xhr: false,
        unhandledrejection: false,
      },
    });

    await notifier.notify(new Error("[AirbrakeJs] SDK contract test"));
    await close();

    expect(requests).toHaveLength(1);
    const [captured] = requests;
    expect(typeof captured?.body).toBe("string");

    vi.mocked(db.project.findFirst).mockResolvedValue({
      id: "p1",
      api_key: projectKey,
      paused: false,
    } as unknown as Awaited<ReturnType<typeof db.project.findFirst>>);

    const req = new NextRequest(
      new URL(`http://localhost/api/v3/notices?key=${projectKey}`),
      {
        method: "POST",
        body: captured.body,
        headers: {
          "content-type":
            typeof captured.headers["content-type"] === "string"
              ? captured.headers["content-type"]
              : "text/plain;charset=UTF-8",
        },
      },
    );

    const res = await POST(req);
    expect(res.status).toBe(201);
    expect(processError).toHaveBeenCalledTimes(1);
  });
});
