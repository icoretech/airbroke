// @vitest-environment node

import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/db", () => ({
  db: {
    project: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
    notice: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
    occurrence: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}));

const { db } = await import("@/lib/db");
const { POST } = await import("@/app/api/mcp/route");

function buildRpcRequest(body: unknown, authorized = true): NextRequest {
  const headers = new Headers({ "content-type": "application/json" });
  if (authorized) {
    headers.set("Authorization", "Bearer test-mcp-key");
  }

  return new NextRequest(new URL("http://localhost/api/mcp"), {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
}

describe("POST /api/mcp", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.AIRBROKE_MCP_API_KEY = "test-mcp-key";
  });

  it("returns 401 when authorization is missing", async () => {
    const req = buildRpcRequest(
      { jsonrpc: "2.0", id: 1, method: "initialize" },
      false,
    );

    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("handles initialize", async () => {
    const req = buildRpcRequest({
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: { protocolVersion: "2025-11-25" },
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.result.protocolVersion).toBe("2025-11-25");
    expect(json.result.serverInfo.name).toBe("airbroke");
    expect(json.result.capabilities.tools.listChanged).toBe(false);
  });

  it("handles notifications/initialized", async () => {
    const req = buildRpcRequest({
      jsonrpc: "2.0",
      method: "notifications/initialized",
    });

    const res = await POST(req);
    expect(res.status).toBe(202);
  });

  it("lists tools", async () => {
    const req = buildRpcRequest({
      jsonrpc: "2.0",
      id: "tools",
      method: "tools/list",
    });

    const res = await POST(req);
    const json = await res.json();
    const toolNames = json.result.tools.map(
      (tool: { name: string }) => tool.name,
    );

    expect(res.status).toBe(200);
    expect(toolNames).toContain("airbroke_list_projects");
    expect(toolNames).toContain("airbroke_get_occurrence");
    expect(toolNames).toContain("airbroke_get_notice");
    expect(toolNames).toContain("airbroke_search");
  });

  it("calls airbroke_list_projects", async () => {
    vi.mocked(db.project.findMany).mockResolvedValue([
      {
        id: "p1",
        name: "api",
        organization: "icoretech",
        paused: false,
        notices_count: 7,
        updated_at: new Date("2026-02-21T10:00:00.000Z"),
      },
    ] as unknown as Awaited<ReturnType<typeof db.project.findMany>>);

    const req = buildRpcRequest({
      jsonrpc: "2.0",
      id: 2,
      method: "tools/call",
      params: {
        name: "airbroke_list_projects",
        arguments: {
          search: "api",
          limit: 5,
          offset: 2,
        },
      },
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(vi.mocked(db.project.findMany)).toHaveBeenCalledTimes(1);
    expect(vi.mocked(db.project.findMany).mock.calls[0]?.[0]).toMatchObject({
      where: { name: { contains: "api", mode: "insensitive" } },
      take: 5,
      skip: 2,
    });
    expect(json.result.structuredContent.projects[0].notices_count).toBe(7);
  });

  it("calls airbroke_list_notices with include_project and offset", async () => {
    vi.mocked(db.notice.findMany).mockResolvedValue([
      {
        id: "n1",
        project_id: "p1",
        env: "production",
        kind: "TypeError",
        seen_count: 3,
        created_at: new Date("2026-02-21T10:00:00.000Z"),
        updated_at: new Date("2026-02-21T10:01:00.000Z"),
        project: {
          id: "p1",
          name: "api",
          organization: "icoretech",
        },
      },
    ] as unknown as Awaited<ReturnType<typeof db.notice.findMany>>);

    const req = buildRpcRequest({
      jsonrpc: "2.0",
      id: 21,
      method: "tools/call",
      params: {
        name: "airbroke_list_notices",
        arguments: {
          project_id: "p1",
          include_project: true,
          limit: 10,
          offset: 1,
        },
      },
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(vi.mocked(db.notice.findMany).mock.calls[0]?.[0]).toMatchObject({
      where: { project_id: "p1" },
      take: 10,
      skip: 1,
    });
    expect(json.result.structuredContent.notices[0].project.name).toBe("api");
  });

  it("calls airbroke_list_occurrences with include_details and expansions", async () => {
    vi.mocked(db.occurrence.findMany).mockResolvedValue([
      {
        id: "o1",
        notice_id: "n1",
        message: "boom",
        seen_count: 4,
        resolved_at: null,
        created_at: new Date("2026-02-21T10:00:00.000Z"),
        updated_at: new Date("2026-02-21T10:02:00.000Z"),
        backtrace: [
          { file: "app.ts", line: 10, function: "run" },
          { file: "lib.ts", line: 20, function: "inner" },
        ],
        context: { severity: "error", language: "javascript" },
        environment: { app_version: "1.2.3" },
        params: { foo: "bar" },
        notice: {
          id: "n1",
          project_id: "p1",
          env: "production",
          kind: "TypeError",
          seen_count: 12,
          updated_at: new Date("2026-02-21T10:03:00.000Z"),
          project: {
            id: "p1",
            name: "api",
            organization: "icoretech",
          },
        },
      },
    ] as unknown as Awaited<ReturnType<typeof db.occurrence.findMany>>);

    const req = buildRpcRequest({
      jsonrpc: "2.0",
      id: 22,
      method: "tools/call",
      params: {
        name: "airbroke_list_occurrences",
        arguments: {
          notice_id: "n1",
          include_details: true,
          backtrace_frames: 1,
          include_notice: true,
          include_project: true,
          limit: 5,
          offset: 3,
        },
      },
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(vi.mocked(db.occurrence.findMany).mock.calls[0]?.[0]).toMatchObject({
      where: { notice_id: "n1" },
      take: 5,
      skip: 3,
    });
    expect(
      json.result.structuredContent.occurrences[0].backtrace_preview,
    ).toHaveLength(1);
    expect(
      json.result.structuredContent.occurrences[0].notice.project.name,
    ).toBe("api");
  });

  it("calls airbroke_get_notice and returns latest/top occurrences", async () => {
    vi.mocked(db.notice.findUnique).mockResolvedValue({
      id: "n1",
      project_id: "p1",
      env: "production",
      kind: "TypeError",
      seen_count: 12,
      created_at: new Date("2026-02-21T10:00:00.000Z"),
      updated_at: new Date("2026-02-21T10:10:00.000Z"),
      project: {
        id: "p1",
        name: "api",
        organization: "icoretech",
      },
    } as unknown as Awaited<ReturnType<typeof db.notice.findUnique>>);
    vi.mocked(db.occurrence.findMany)
      .mockResolvedValueOnce([
        {
          id: "o-latest",
          notice_id: "n1",
          message: "latest",
          seen_count: 1,
          resolved_at: null,
          created_at: new Date("2026-02-21T10:05:00.000Z"),
          updated_at: new Date("2026-02-21T10:11:00.000Z"),
          backtrace: [{ file: "a.ts", line: 1 }],
          context: {},
          environment: {},
          params: {},
        },
      ] as unknown as Awaited<ReturnType<typeof db.occurrence.findMany>>)
      .mockResolvedValueOnce([
        {
          id: "o-top",
          notice_id: "n1",
          message: "top",
          seen_count: 10,
          resolved_at: null,
          created_at: new Date("2026-02-21T10:01:00.000Z"),
          updated_at: new Date("2026-02-21T10:09:00.000Z"),
          backtrace: [{ file: "b.ts", line: 2 }],
          context: {},
          environment: {},
          params: {},
        },
      ] as unknown as Awaited<ReturnType<typeof db.occurrence.findMany>>);

    const req = buildRpcRequest({
      jsonrpc: "2.0",
      id: 23,
      method: "tools/call",
      params: {
        name: "airbroke_get_notice",
        arguments: {
          notice_id: "n1",
          latest_limit: 1,
          top_limit: 1,
          include_occurrence_details: true,
          backtrace_frames: 1,
          include_project: true,
        },
      },
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(vi.mocked(db.notice.findUnique)).toHaveBeenCalledTimes(1);
    expect(vi.mocked(db.occurrence.findMany)).toHaveBeenCalledTimes(2);
    expect(json.result.structuredContent.notice.id).toBe("n1");
    expect(json.result.structuredContent.latest_occurrences[0].id).toBe(
      "o-latest",
    );
    expect(json.result.structuredContent.top_occurrences[0].id).toBe("o-top");
    expect(
      json.result.structuredContent.latest_occurrences[0].backtrace_preview,
    ).toHaveLength(1);
  });

  it("returns not found for airbroke_get_notice", async () => {
    vi.mocked(db.notice.findUnique).mockResolvedValue(null);

    const req = buildRpcRequest({
      jsonrpc: "2.0",
      id: 24,
      method: "tools/call",
      params: {
        name: "airbroke_get_notice",
        arguments: { notice_id: "missing" },
      },
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.result.isError).toBe(true);
    expect(json.result.structuredContent.error).toBe("Notice not found");
  });

  it("calls airbroke_get_occurrence with include_notice false", async () => {
    vi.mocked(db.occurrence.findUnique).mockResolvedValue({
      id: "o1",
      notice_id: "n1",
      message: "boom",
      seen_count: 4,
      backtrace: [],
      context: {},
      environment: {},
      session: {},
      params: {},
      created_at: new Date("2026-02-21T10:00:00.000Z"),
      updated_at: new Date("2026-02-21T10:01:00.000Z"),
      resolved_at: null,
      notice: {
        id: "n1",
        project_id: "p1",
        env: "production",
        kind: "TypeError",
        seen_count: 7,
        created_at: new Date("2026-02-21T09:00:00.000Z"),
        updated_at: new Date("2026-02-21T09:01:00.000Z"),
        project: {
          id: "p1",
          name: "api",
          organization: "icoretech",
        },
      },
    } as unknown as Awaited<ReturnType<typeof db.occurrence.findUnique>>);

    const req = buildRpcRequest({
      jsonrpc: "2.0",
      id: 25,
      method: "tools/call",
      params: {
        name: "airbroke_get_occurrence",
        arguments: { occurrence_id: "o1", include_notice: false },
      },
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.result.structuredContent.occurrence.notice).toBeUndefined();
  });

  it("calls airbroke_search with filters and details", async () => {
    vi.mocked(db.occurrence.findMany).mockResolvedValue([
      {
        id: "o1",
        notice_id: "n1",
        message: "Network request failed",
        seen_count: 9,
        resolved_at: null,
        created_at: new Date("2026-02-21T10:00:00.000Z"),
        updated_at: new Date("2026-02-21T10:01:00.000Z"),
        backtrace: [{ file: "app.ts", line: 11 }],
        context: { severity: "error" },
        environment: { app_version: "1.0.0" },
        params: {},
        notice: {
          id: "n1",
          project_id: "p1",
          env: "android-production",
          kind: "TypeError",
          seen_count: 12,
          updated_at: new Date("2026-02-21T10:02:00.000Z"),
          project: {
            id: "p1",
            name: "AR-arplus",
            organization: "AR",
          },
        },
      },
    ] as unknown as Awaited<ReturnType<typeof db.occurrence.findMany>>);

    const req = buildRpcRequest({
      jsonrpc: "2.0",
      id: 26,
      method: "tools/call",
      params: {
        name: "airbroke_search",
        arguments: {
          query: "network",
          organization: "AR",
          env: "android-production",
          include_resolved: false,
          include_details: true,
          backtrace_frames: 1,
          limit: 20,
          offset: 2,
        },
      },
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(vi.mocked(db.occurrence.findMany).mock.calls[0]?.[0]).toMatchObject({
      take: 20,
      skip: 2,
      where: {
        resolved_at: null,
        notice: {
          env: "android-production",
          project: {
            organization: "AR",
          },
        },
      },
    });
    expect(json.result.structuredContent.matches[0].notice.project.name).toBe(
      "AR-arplus",
    );
    expect(
      json.result.structuredContent.matches[0].backtrace_preview,
    ).toHaveLength(1);
  });

  it("returns validation error for airbroke_search without query", async () => {
    const req = buildRpcRequest({
      jsonrpc: "2.0",
      id: 27,
      method: "tools/call",
      params: {
        name: "airbroke_search",
        arguments: {
          organization: "AR",
        },
      },
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.result.isError).toBe(true);
    expect(json.result.structuredContent.error).toBe(
      "Invalid arguments for airbroke_search",
    );
  });

  it("returns tool error for unknown tool", async () => {
    const req = buildRpcRequest({
      jsonrpc: "2.0",
      id: 3,
      method: "tools/call",
      params: {
        name: "airbroke_unknown_tool",
      },
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.result.isError).toBe(true);
  });
});
