// @vitest-environment node

import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

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
const { OPTIONS, POST } = await import("@/app/api/v3/notices/route");

const noticePayload = {
  errors: [
    {
      type: "Error",
      message: "boom",
      backtrace: [
        {
          file: "app.ts",
          line: 123,
          function: "explode",
        },
      ],
    },
  ],
  context: {
    environment: "test",
  },
  environment: {},
  session: {},
  params: {},
};

describe("POST /api/v3/notices", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("accepts notice with key query param", async () => {
    vi.mocked(db.project.findFirst).mockResolvedValue({
      id: "p1",
      api_key: "k1",
      paused: false,
    } as unknown as Awaited<ReturnType<typeof db.project.findFirst>>);

    const req = new NextRequest(
      new URL("http://localhost/api/v3/notices?key=k1"),
      {
        method: "POST",
        body: JSON.stringify(noticePayload),
        headers: {
          "content-type": "application/json",
        },
      },
    );

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(typeof json.id).toBe("string");
    expect(typeof json.url).toBe("string");
    expect(processError).toHaveBeenCalledTimes(1);
    expect(vi.mocked(db.project.findFirst)).toHaveBeenCalledWith({
      where: { api_key: "k1" },
    });
  });

  it("accepts notice when content-type is text/plain with charset (airbrake-js default)", async () => {
    vi.mocked(db.project.findFirst).mockResolvedValue({
      id: "p1",
      api_key: "k1",
      paused: false,
    } as unknown as Awaited<ReturnType<typeof db.project.findFirst>>);

    const req = new NextRequest(
      new URL("http://localhost/api/v3/notices?key=k1"),
      {
        method: "POST",
        body: JSON.stringify(noticePayload),
        headers: {
          "content-type": "text/plain;charset=UTF-8",
        },
      },
    );

    const res = await POST(req);
    expect(res.status).toBe(201);
    expect(processError).toHaveBeenCalledTimes(1);
  });

  it("returns 404 + WWW-Authenticate when key provided via Authorization header and project missing", async () => {
    vi.mocked(db.project.findFirst).mockResolvedValue(null);
    const req = new NextRequest(new URL("http://localhost/api/v3/notices"), {
      method: "POST",
      body: JSON.stringify(noticePayload),
      headers: {
        Authorization: "Bearer k1",
        "content-type": "application/json",
      },
    });

    const res = await POST(req);
    expect(res.status).toBe(404);
    expect(res.headers.get("WWW-Authenticate")).toBe('Bearer realm="Airbroke"');
  });

  it("handles OPTIONS preflight with CORS headers", async () => {
    const req = new NextRequest(new URL("http://localhost/api/v3/notices"), {
      method: "OPTIONS",
      headers: { origin: "http://localhost:3000" },
    });
    const res = await OPTIONS(req);
    expect(res.status).toBe(200);
    expect(res.headers.get("Access-Control-Allow-Methods")).toBe(
      "POST, OPTIONS",
    );
  });
});
