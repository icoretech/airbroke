// @vitest-environment node

import { gzipSync } from "node:zlib";
import { createEnvelope, serializeEnvelope } from "@sentry/core";
import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

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
const { OPTIONS, POST } = await import(
  "@/app/api/sentry/[project_id]/envelope/route"
);

const envelope = (() => {
  const event = {
    event_id: "abc123",
    environment: "test-env",
    release: "airbroke-test@1.0.0",
    platform: "node",
    exception: { values: [{ type: "Error", value: "boom" }] },
  };

  const serialized = serializeEnvelope(
    createEnvelope(
      {
        sdk: { name: "sentry.javascript.node", version: "10.30.0" },
        sent_at: "2025-01-01T00:00:00.000Z",
      },
      [[{ type: "event" }, event]],
    ),
  );

  return typeof serialized === "string"
    ? serialized
    : Buffer.from(serialized).toString("utf8");
})();
const compressedEnvelope = gzipSync(envelope);

describe("POST /api/sentry/[project_id]/envelope", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("accepts envelope and processes errors", async () => {
    vi.mocked(db.project.findFirst).mockResolvedValue({
      id: "p1",
      api_key: "k1",
      paused: false,
    } as unknown as Awaited<ReturnType<typeof db.project.findFirst>>);

    const req = new NextRequest(
      new URL("http://localhost/api/sentry/p1/envelope?sentry_key=k1"),
      {
        method: "POST",
        body: envelope,
        headers: {
          "content-type": "application/x-sentry-envelope",
        },
      },
    );

    const res = await POST(req, {
      params: Promise.resolve({ project_id: "p1" }),
    });
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json.id).toBe("abc123");
    expect(processError).toHaveBeenCalledTimes(1);
    expect(vi.mocked(db.project.findFirst)).toHaveBeenCalledWith({
      where: { id: "p1", api_key: "k1", paused: false },
    });
  });

  it("returns 404 when project missing", async () => {
    vi.mocked(db.project.findFirst).mockResolvedValue(null);
    const req = new NextRequest(
      new URL("http://localhost/api/sentry/p1/envelope?sentry_key=k1"),
      { method: "POST", body: envelope },
    );
    const res = await POST(req, {
      params: Promise.resolve({ project_id: "p1" }),
    });
    expect(res.status).toBe(404);
  });

  it("accepts gzip encoded envelope", async () => {
    vi.mocked(db.project.findFirst).mockResolvedValue({
      id: "p1",
      api_key: "k1",
      paused: false,
    } as unknown as Awaited<ReturnType<typeof db.project.findFirst>>);

    const req = new NextRequest(
      new URL("http://localhost/api/sentry/p1/envelope?sentry_key=k1"),
      {
        method: "POST",
        body: compressedEnvelope,
        headers: {
          "content-encoding": "gzip",
          "content-type": "application/x-sentry-envelope",
        },
      },
    );

    const res = await POST(req, {
      params: Promise.resolve({ project_id: "p1" }),
    });

    expect(res.status).toBe(201);
    expect(processError).toHaveBeenCalledTimes(1);
  });
});

describe("OPTIONS /api/sentry/[project_id]/envelope", () => {
  const previousOrigins = process.env.AIRBROKE_CORS_ORIGINS;

  afterEach(() => {
    vi.clearAllMocks();
    if (previousOrigins === undefined) {
      delete process.env.AIRBROKE_CORS_ORIGINS;
    } else {
      process.env.AIRBROKE_CORS_ORIGINS = previousOrigins;
    }
  });

  it("handles OPTIONS preflight with CORS headers", async () => {
    process.env.AIRBROKE_CORS_ORIGINS = "http://localhost:3000";

    const req = new NextRequest(
      new URL("http://localhost/api/sentry/p1/envelope"),
      {
        method: "OPTIONS",
        headers: {
          origin: "http://localhost:3000",
          "access-control-request-headers": "x-sentry-auth, content-type",
        },
      },
    );

    const res = await OPTIONS(req);
    expect(res.status).toBe(200);
    expect(res.headers.get("Access-Control-Allow-Methods")).toBe(
      "POST, OPTIONS",
    );
    expect(res.headers.get("Access-Control-Allow-Origin")).toBe(
      "http://localhost:3000",
    );
    expect(res.headers.get("Access-Control-Allow-Headers")).toBe(
      "x-sentry-auth, content-type",
    );
  });
});
