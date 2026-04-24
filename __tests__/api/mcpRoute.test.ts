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
    remark: {
      count: vi.fn().mockResolvedValue(0),
      findMany: vi.fn().mockResolvedValue([]),
    },
  },
}));

const { db } = await import("@/lib/db");
const { POST } = await import("@/app/api/mcp/route");

function buildRpcRequest(
  body: unknown,
  authorized = true,
  extraHeaders?: Record<string, string>,
): NextRequest {
  const headers = new Headers({
    "content-type": "application/json",
    accept: "application/json, text/event-stream",
  });
  if (authorized) {
    headers.set("Authorization", "Bearer test-mcp-key");
  }
  for (const [name, value] of Object.entries(extraHeaders ?? {})) {
    headers.set(name, value);
  }

  return new NextRequest(new URL("http://localhost/api/mcp"), {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
}

type JsonObject = Record<string, unknown>;

type ParsedMcpResponse = JsonObject & {
  result?: JsonObject;
  error?: JsonObject;
};

function requireResult(json: ParsedMcpResponse): JsonObject {
  expect(json.result).toBeDefined();
  return json.result as JsonObject;
}

function requireStructuredContent(json: ParsedMcpResponse): JsonObject {
  const result = requireResult(json) as { structuredContent?: JsonObject };
  expect(result.structuredContent).toBeDefined();
  return result.structuredContent as JsonObject;
}

async function parseMcpResponse(res: Response): Promise<ParsedMcpResponse> {
  const payloadText = await res.text();
  if (!payloadText.trim()) {
    return {};
  }

  const contentType = (res.headers.get("content-type") ?? "").toLowerCase();
  const isEventStream =
    contentType.includes("text/event-stream") ||
    payloadText.includes("\nevent:") ||
    payloadText.startsWith("event:");

  if (!isEventStream) {
    return JSON.parse(payloadText) as ParsedMcpResponse;
  }

  const dataLines = payloadText
    .split(/\r?\n/)
    .filter((line) => line.startsWith("data: "));
  const lastDataLine = dataLines.at(-1);
  if (!lastDataLine) {
    throw new Error(`Missing SSE data line in response: ${payloadText}`);
  }

  return JSON.parse(lastDataLine.slice("data: ".length)) as ParsedMcpResponse;
}

function callTool(
  name: string,
  args: JsonObject,
  id: number | string = 1,
): NextRequest {
  return buildRpcRequest({
    jsonrpc: "2.0",
    id,
    method: "tools/call",
    params: { name, arguments: args },
  });
}

describe("POST /api/mcp", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.AIRBROKE_MCP_API_KEY = "test-mcp-key";
    delete process.env.AIRBROKE_MCP_ALLOWED_ORIGINS;
  });

  // ── Auth ──────────────────────────────────────────────────────────────

  describe("authentication", () => {
    it("returns 401 when authorization is missing", async () => {
      const req = buildRpcRequest(
        { jsonrpc: "2.0", id: 1, method: "initialize" },
        false,
      );

      const res = await POST(req);
      expect(res.status).toBe(401);
    });

    it("accepts X-Airbroke-Mcp-Key header", async () => {
      const req = buildRpcRequest(
        { jsonrpc: "2.0", id: 1, method: "initialize" },
        false,
        { "X-Airbroke-Mcp-Key": "test-mcp-key" },
      );

      const res = await POST(req);
      expect(res.status).toBe(200);
    });

    it("rejects invalid X-Airbroke-Mcp-Key header", async () => {
      const req = buildRpcRequest(
        { jsonrpc: "2.0", id: 1, method: "initialize" },
        false,
        { "X-Airbroke-Mcp-Key": "wrong-key" },
      );

      const res = await POST(req);
      expect(res.status).toBe(401);
    });
  });

  // ── Origin ────────────────────────────────────────────────────────────

  describe("origin policy", () => {
    it("rejects spoofed forwarded headers when same-origin fallback is active", async () => {
      const req = buildRpcRequest(
        { jsonrpc: "2.0", id: 1, method: "initialize" },
        true,
        {
          origin: "https://evil.example",
          "x-forwarded-host": "evil.example",
          "x-forwarded-proto": "https",
        },
      );

      const res = await POST(req);
      const json = await parseMcpResponse(res);

      expect(res.status).toBe(403);
      expect(json.error).toMatchObject({
        code: -32001,
        message: "Forbidden origin",
      });
    });

    it("allows same-origin browser requests when the allowlist is unset", async () => {
      const req = buildRpcRequest(
        { jsonrpc: "2.0", id: 1, method: "initialize" },
        true,
        { origin: "http://localhost" },
      );

      const res = await POST(req);
      expect(res.status).toBe(200);
    });
  });

  // ── Protocol ──────────────────────────────────────────────────────────

  describe("protocol", () => {
    it("handles initialize", async () => {
      const req = buildRpcRequest({
        jsonrpc: "2.0",
        id: 1,
        method: "initialize",
        params: {
          protocolVersion: "2025-11-25",
          capabilities: {},
          clientInfo: { name: "vitest-client", version: "0.0.0" },
        },
      });

      const res = await POST(req);
      const json = await parseMcpResponse(res);
      const result = (json.result ?? json) as {
        protocolVersion?: string;
        serverInfo?: { name?: string };
        capabilities?: { tools?: { listChanged?: boolean } };
      };
      const root = json as {
        serverInfo?: { name?: string };
        capabilities?: { tools?: { listChanged?: boolean } };
      };

      expect(res.status).toBe(200);
      const protocolVersion = result.protocolVersion;
      if (protocolVersion !== undefined) {
        expect(protocolVersion).toBe("2025-11-25");
      }
      const serverName = result.serverInfo?.name ?? root.serverInfo?.name;
      if (serverName !== undefined) {
        expect(serverName).toBe("airbroke");
      } else {
        expect(JSON.stringify(json)).toContain("airbroke");
      }
      const listChanged =
        result.capabilities?.tools?.listChanged ??
        root.capabilities?.tools?.listChanged;
      if (listChanged !== undefined) {
        expect(typeof listChanged).toBe("boolean");
      }
    });

    it("handles notifications/initialized", async () => {
      const req = buildRpcRequest({
        jsonrpc: "2.0",
        method: "notifications/initialized",
      });

      const res = await POST(req);
      expect(res.status).toBe(202);
    });

    it("lists all tools", async () => {
      const req = buildRpcRequest({
        jsonrpc: "2.0",
        id: "tools",
        method: "tools/list",
      });

      const res = await POST(req);
      const json = await parseMcpResponse(res);
      const result = requireResult(json) as {
        tools?: Array<{ name: string }>;
      };
      const toolNames = (result.tools ?? []).map((t) => t.name);

      expect(res.status).toBe(200);
      expect(toolNames).toContain("airbroke_list_projects");
      expect(toolNames).toContain("airbroke_get_project");
      expect(toolNames).toContain("airbroke_list_notices");
      expect(toolNames).toContain("airbroke_list_occurrences");
      expect(toolNames).toContain("airbroke_get_notice");
      expect(toolNames).toContain("airbroke_get_occurrence");
      expect(toolNames).toContain("airbroke_search");
      expect(toolNames).toContain("airbroke_get_setup_guide");
    });

    it("returns tool error for unknown tool", async () => {
      const req = callTool("airbroke_unknown_tool", {}, 99);

      const res = await POST(req);
      const json = await parseMcpResponse(res);
      const result = requireResult(json) as { isError?: boolean };

      expect(res.status).toBe(200);
      expect(result.isError).toBe(true);
    });
  });

  // ── airbroke_list_projects ────────────────────────────────────────────

  describe("airbroke_list_projects", () => {
    it("returns projects with search, limit, and offset", async () => {
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

      const res = await POST(
        callTool("airbroke_list_projects", {
          search: "api",
          limit: 5,
          offset: 2,
        }),
      );
      const json = await parseMcpResponse(res);
      const structured = requireStructuredContent(json) as {
        projects: Array<{ notices_count: number }>;
      };

      expect(res.status).toBe(200);
      expect(vi.mocked(db.project.findMany)).toHaveBeenCalledTimes(1);
      expect(vi.mocked(db.project.findMany).mock.calls[0]?.[0]).toMatchObject({
        where: {
          OR: [
            { name: { contains: "api", mode: "insensitive" } },
            { organization: { contains: "api", mode: "insensitive" } },
          ],
        },
        take: 5,
        skip: 2,
      });
      expect(structured.projects[0]?.notices_count).toBe(7);
    });

    it("matches organization text case-insensitively for discovery", async () => {
      vi.mocked(db.project.findMany).mockResolvedValue([]);

      const res = await POST(
        callTool("airbroke_list_projects", {
          search: "sample-app",
          organization: "example-org",
        }),
      );
      await parseMcpResponse(res);

      expect(res.status).toBe(200);
      expect(vi.mocked(db.project.findMany).mock.calls[0]?.[0]).toMatchObject({
        where: {
          OR: [
            { name: { contains: "sample-app", mode: "insensitive" } },
            {
              organization: {
                contains: "sample-app",
                mode: "insensitive",
              },
            },
          ],
          organization: {
            contains: "example-org",
            mode: "insensitive",
          },
        },
      });
    });
  });

  // ── airbroke_get_project ──────────────────────────────────────────────

  describe("airbroke_get_project", () => {
    it("returns a project by id", async () => {
      vi.mocked(db.project.findUnique).mockResolvedValue({
        id: "p1",
        name: "api",
        organization: "icoretech",
        paused: false,
        notices_count: BigInt(7),
        repo_provider: "github",
        repo_branch: "main",
        repo_issue_tracker: null,
        repo_url: "https://github.com/icoretech/api",
        created_at: new Date("2026-01-01T00:00:00.000Z"),
        updated_at: new Date("2026-02-21T10:00:00.000Z"),
      } as unknown as Awaited<ReturnType<typeof db.project.findUnique>>);

      const res = await POST(
        callTool("airbroke_get_project", { project_id: "p1" }),
      );
      const json = await parseMcpResponse(res);
      const structured = requireStructuredContent(json) as {
        project: { id: string; name: string; organization: string };
      };

      expect(res.status).toBe(200);
      expect(vi.mocked(db.project.findUnique)).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: "p1" } }),
      );
      expect(structured.project.name).toBe("api");
      expect(structured.project.organization).toBe("icoretech");
    });

    it("returns not found for missing project", async () => {
      vi.mocked(db.project.findUnique).mockResolvedValue(null);

      const res = await POST(
        callTool("airbroke_get_project", { project_id: "missing" }),
      );
      const json = await parseMcpResponse(res);
      const result = requireResult(json) as {
        isError?: boolean;
        structuredContent?: { error?: string };
      };

      expect(res.status).toBe(200);
      expect(result.isError).toBe(true);
      expect(result.structuredContent?.error).toBe("Project not found");
    });

    it("resolves an unambiguous project name reference", async () => {
      vi.mocked(db.project.findUnique)
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({
          id: "p1",
          name: "sample-app",
          organization: "Example Org",
          paused: false,
          notices_count: BigInt(7),
          repo_provider: "github",
          repo_branch: "main",
          repo_issue_tracker: null,
          repo_url: "https://github.com/example-org/sample-app",
          created_at: new Date("2026-01-01T00:00:00.000Z"),
          updated_at: new Date("2026-02-21T10:00:00.000Z"),
        } as unknown as Awaited<ReturnType<typeof db.project.findUnique>>);
      vi.mocked(db.project.findMany).mockResolvedValueOnce([
        {
          id: "p1",
          name: "sample-app",
          organization: "Example Org",
          paused: false,
          notices_count: BigInt(7),
          created_at: new Date("2026-01-01T00:00:00.000Z"),
          updated_at: new Date("2026-02-21T10:00:00.000Z"),
        },
      ] as unknown as Awaited<ReturnType<typeof db.project.findMany>>);

      const res = await POST(
        callTool("airbroke_get_project", { project_id: "sample-app" }),
      );
      const json = await parseMcpResponse(res);
      const structured = requireStructuredContent(json) as {
        project: { id: string; name: string };
        matched_by: string;
        requested_project_id: string;
      };

      expect(res.status).toBe(200);
      expect(structured.project.id).toBe("p1");
      expect(structured.project.name).toBe("sample-app");
      expect(structured.matched_by).toBe("name_exact");
      expect(structured.requested_project_id).toBe("sample-app");
    });

    it("returns candidate suggestions for ambiguous project references", async () => {
      vi.mocked(db.project.findUnique).mockResolvedValueOnce(null);
      vi.mocked(db.project.findMany).mockResolvedValueOnce([
        {
          id: "p1",
          name: "ai-studio",
          organization: "Example Org",
          paused: false,
          notices_count: BigInt(2),
          created_at: new Date("2026-01-01T00:00:00.000Z"),
          updated_at: new Date("2026-02-21T10:00:00.000Z"),
        },
        {
          id: "p2",
          name: "ai-editor",
          organization: "Example Org",
          paused: false,
          notices_count: BigInt(1),
          created_at: new Date("2026-01-01T00:00:00.000Z"),
          updated_at: new Date("2026-02-21T10:00:00.000Z"),
        },
      ] as unknown as Awaited<ReturnType<typeof db.project.findMany>>);

      const res = await POST(
        callTool("airbroke_get_project", { project_id: "ai" }),
      );
      const json = await parseMcpResponse(res);
      const result = requireResult(json) as {
        isError?: boolean;
        structuredContent?: {
          error?: string;
          details?: { candidates?: Array<{ id: string }> };
        };
      };

      expect(result.isError).toBe(true);
      expect(result.structuredContent?.error).toBe(
        "Project lookup is ambiguous",
      );
      expect(result.structuredContent?.details?.candidates).toHaveLength(2);
    });
  });

  // ── airbroke_list_notices ─────────────────────────────────────────────

  describe("airbroke_list_notices", () => {
    it("returns notices with include_project and offset", async () => {
      vi.mocked(db.project.findUnique).mockResolvedValueOnce({
        id: "p1",
        name: "api",
        organization: "icoretech",
        paused: false,
        notices_count: BigInt(7),
        created_at: new Date("2026-01-01T00:00:00.000Z"),
        updated_at: new Date("2026-02-21T10:00:00.000Z"),
      } as unknown as Awaited<ReturnType<typeof db.project.findUnique>>);
      vi.mocked(db.notice.findMany).mockResolvedValue([
        {
          id: "n1",
          project_id: "p1",
          env: "production",
          kind: "TypeError",
          seen_count: 3,
          resolved_at: null,
          created_at: new Date("2026-02-21T10:00:00.000Z"),
          updated_at: new Date("2026-02-21T10:01:00.000Z"),
          project: {
            id: "p1",
            name: "api",
            organization: "icoretech",
          },
        },
      ] as unknown as Awaited<ReturnType<typeof db.notice.findMany>>);

      const res = await POST(
        callTool("airbroke_list_notices", {
          project_id: "p1",
          include_project: true,
          limit: 10,
          offset: 1,
        }),
      );
      const json = await parseMcpResponse(res);
      const structured = requireStructuredContent(json) as {
        notices: Array<{ project: { name: string }; resolved_at: unknown }>;
      };

      expect(res.status).toBe(200);
      expect(vi.mocked(db.notice.findMany).mock.calls[0]?.[0]).toMatchObject({
        where: { project_id: "p1" },
        take: 10,
        skip: 1,
      });
      expect(structured.notices[0]?.project.name).toBe("api");
    });

    it("filters out resolved notices when include_resolved is false", async () => {
      vi.mocked(db.project.findUnique).mockResolvedValueOnce({
        id: "p1",
        name: "api",
        organization: "icoretech",
        paused: false,
        notices_count: BigInt(7),
        created_at: new Date("2026-01-01T00:00:00.000Z"),
        updated_at: new Date("2026-02-21T10:00:00.000Z"),
      } as unknown as Awaited<ReturnType<typeof db.project.findUnique>>);
      vi.mocked(db.notice.findMany).mockResolvedValue([]);

      const res = await POST(
        callTool("airbroke_list_notices", {
          project_id: "p1",
          include_resolved: false,
        }),
      );
      await parseMcpResponse(res);

      expect(res.status).toBe(200);
      expect(vi.mocked(db.notice.findMany).mock.calls[0]?.[0]).toMatchObject({
        where: {
          project_id: "p1",
          resolved_at: null,
        },
      });
    });

    it("includes all notices by default (include_resolved defaults to true)", async () => {
      vi.mocked(db.project.findUnique).mockResolvedValueOnce({
        id: "p1",
        name: "api",
        organization: "icoretech",
        paused: false,
        notices_count: BigInt(7),
        created_at: new Date("2026-01-01T00:00:00.000Z"),
        updated_at: new Date("2026-02-21T10:00:00.000Z"),
      } as unknown as Awaited<ReturnType<typeof db.project.findUnique>>);
      vi.mocked(db.notice.findMany).mockResolvedValue([]);

      const res = await POST(
        callTool("airbroke_list_notices", { project_id: "p1" }),
      );
      await parseMcpResponse(res);

      expect(res.status).toBe(200);
      const where = vi.mocked(db.notice.findMany).mock.calls[0]?.[0]
        ?.where as JsonObject;
      expect(where).not.toHaveProperty("resolved_at");
    });

    it("applies filter_by_env and search", async () => {
      vi.mocked(db.project.findUnique).mockResolvedValueOnce({
        id: "p1",
        name: "api",
        organization: "icoretech",
        paused: false,
        notices_count: BigInt(7),
        created_at: new Date("2026-01-01T00:00:00.000Z"),
        updated_at: new Date("2026-02-21T10:00:00.000Z"),
      } as unknown as Awaited<ReturnType<typeof db.project.findUnique>>);
      vi.mocked(db.notice.findMany).mockResolvedValue([]);

      const res = await POST(
        callTool("airbroke_list_notices", {
          project_id: "p1",
          filter_by_env: "production",
          search: "TypeError",
        }),
      );
      await parseMcpResponse(res);

      expect(res.status).toBe(200);
      expect(vi.mocked(db.notice.findMany).mock.calls[0]?.[0]).toMatchObject({
        where: {
          project_id: "p1",
          env: "production",
          kind: { contains: "TypeError", mode: "insensitive" },
        },
      });
    });

    it("includes resolved_at in notice payloads", async () => {
      const resolvedDate = new Date("2026-03-01T12:00:00.000Z");
      vi.mocked(db.project.findUnique).mockResolvedValueOnce({
        id: "p1",
        name: "api",
        organization: "icoretech",
        paused: false,
        notices_count: BigInt(7),
        created_at: new Date("2026-01-01T00:00:00.000Z"),
        updated_at: new Date("2026-02-21T10:00:00.000Z"),
      } as unknown as Awaited<ReturnType<typeof db.project.findUnique>>);
      vi.mocked(db.notice.findMany).mockResolvedValue([
        {
          id: "n1",
          project_id: "p1",
          env: "production",
          kind: "TypeError",
          seen_count: 3,
          resolved_at: resolvedDate,
          created_at: new Date("2026-02-21T10:00:00.000Z"),
          updated_at: new Date("2026-02-21T10:01:00.000Z"),
        },
      ] as unknown as Awaited<ReturnType<typeof db.notice.findMany>>);

      const res = await POST(
        callTool("airbroke_list_notices", { project_id: "p1" }),
      );
      const json = await parseMcpResponse(res);
      const structured = requireStructuredContent(json) as {
        notices: Array<{ resolved_at: string }>;
      };

      expect(structured.notices[0]?.resolved_at).toBe(
        resolvedDate.toISOString(),
      );
    });
  });

  // ── airbroke_list_occurrences ─────────────────────────────────────────

  describe("airbroke_list_occurrences", () => {
    it("returns occurrences with include_details and expansions", async () => {
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
            resolved_at: null,
            updated_at: new Date("2026-02-21T10:03:00.000Z"),
            project: {
              id: "p1",
              name: "api",
              organization: "icoretech",
            },
          },
        },
      ] as unknown as Awaited<ReturnType<typeof db.occurrence.findMany>>);

      const res = await POST(
        callTool("airbroke_list_occurrences", {
          notice_id: "n1",
          include_details: true,
          backtrace_frames: 1,
          include_notice: true,
          include_project: true,
          limit: 5,
          offset: 3,
        }),
      );
      const json = await parseMcpResponse(res);
      const structured = requireStructuredContent(json) as {
        occurrences: Array<{
          backtrace_preview: unknown[];
          notice: { resolved_at: unknown; project: { name: string } };
        }>;
      };

      expect(res.status).toBe(200);
      expect(
        vi.mocked(db.occurrence.findMany).mock.calls[0]?.[0],
      ).toMatchObject({
        where: { notice_id: "n1" },
        take: 5,
        skip: 3,
      });
      expect(structured.occurrences[0]?.backtrace_preview).toHaveLength(1);
      expect(structured.occurrences[0]?.notice.project.name).toBe("api");
      expect(structured.occurrences[0]?.notice.resolved_at).toBeNull();
    });

    it("filters out resolved occurrences when include_resolved is false", async () => {
      vi.mocked(db.occurrence.findMany).mockResolvedValue([]);

      const res = await POST(
        callTool("airbroke_list_occurrences", {
          notice_id: "n1",
          include_resolved: false,
        }),
      );
      await parseMcpResponse(res);

      expect(res.status).toBe(200);
      expect(
        vi.mocked(db.occurrence.findMany).mock.calls[0]?.[0],
      ).toMatchObject({
        where: {
          notice_id: "n1",
          resolved_at: null,
        },
      });
    });

    it("includes all occurrences by default", async () => {
      vi.mocked(db.occurrence.findMany).mockResolvedValue([]);

      const res = await POST(
        callTool("airbroke_list_occurrences", { notice_id: "n1" }),
      );
      await parseMcpResponse(res);

      const where = vi.mocked(db.occurrence.findMany).mock.calls[0]?.[0]
        ?.where as JsonObject;
      expect(where).not.toHaveProperty("resolved_at");
    });
  });

  // ── airbroke_get_notice ───────────────────────────────────────────────

  describe("airbroke_get_notice", () => {
    it("returns notice with latest/top occurrences", async () => {
      vi.mocked(db.notice.findUnique).mockResolvedValue({
        id: "n1",
        project_id: "p1",
        env: "production",
        kind: "TypeError",
        seen_count: 12,
        resolved_at: null,
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

      const res = await POST(
        callTool("airbroke_get_notice", {
          notice_id: "n1",
          latest_limit: 1,
          top_limit: 1,
          include_occurrence_details: true,
          backtrace_frames: 1,
          include_project: true,
        }),
      );
      const json = await parseMcpResponse(res);
      const structured = requireStructuredContent(json) as {
        notice: { id: string; resolved_at: unknown };
        latest_occurrences: Array<{
          id: string;
          backtrace_preview: unknown[];
        }>;
        top_occurrences: Array<{ id: string }>;
      };

      expect(res.status).toBe(200);
      expect(vi.mocked(db.notice.findUnique)).toHaveBeenCalledTimes(1);
      expect(vi.mocked(db.occurrence.findMany)).toHaveBeenCalledTimes(2);
      expect(structured.notice.id).toBe("n1");
      expect(structured.notice.resolved_at).toBeNull();
      expect(structured.latest_occurrences[0]?.id).toBe("o-latest");
      expect(structured.top_occurrences[0]?.id).toBe("o-top");
      expect(structured.latest_occurrences[0]?.backtrace_preview).toHaveLength(
        1,
      );
    });

    it("returns not found for missing notice", async () => {
      vi.mocked(db.notice.findUnique).mockResolvedValue(null);

      const res = await POST(
        callTool("airbroke_get_notice", { notice_id: "missing" }),
      );
      const json = await parseMcpResponse(res);
      const result = requireResult(json) as {
        isError?: boolean;
        structuredContent?: { error?: string };
      };

      expect(res.status).toBe(200);
      expect(result.isError).toBe(true);
      expect(result.structuredContent?.error).toBe("Notice not found");
    });

    it("filters occurrences when include_resolved is false", async () => {
      vi.mocked(db.notice.findUnique).mockResolvedValue({
        id: "n1",
        project_id: "p1",
        env: "production",
        kind: "TypeError",
        seen_count: 5,
        resolved_at: null,
        created_at: new Date("2026-02-21T10:00:00.000Z"),
        updated_at: new Date("2026-02-21T10:10:00.000Z"),
      } as unknown as Awaited<ReturnType<typeof db.notice.findUnique>>);
      vi.mocked(db.occurrence.findMany)
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([]);

      const res = await POST(
        callTool("airbroke_get_notice", {
          notice_id: "n1",
          include_resolved: false,
        }),
      );
      await parseMcpResponse(res);

      expect(res.status).toBe(200);
      // Both latest and top occurrence queries should filter by resolved_at: null
      for (const call of vi.mocked(db.occurrence.findMany).mock.calls) {
        expect(call[0]).toMatchObject({
          where: {
            notice_id: "n1",
            resolved_at: null,
          },
        });
      }
    });

    it("includes remarks_count in notice payload", async () => {
      vi.mocked(db.notice.findUnique).mockResolvedValue({
        id: "n1",
        project_id: "p1",
        env: "production",
        kind: "TypeError",
        seen_count: 5,
        resolved_at: null,
        created_at: new Date("2026-02-21T10:00:00.000Z"),
        updated_at: new Date("2026-02-21T10:10:00.000Z"),
      } as unknown as Awaited<ReturnType<typeof db.notice.findUnique>>);
      vi.mocked(db.occurrence.findMany)
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([]);
      vi.mocked(db.remark.count).mockResolvedValue(3);

      const res = await POST(
        callTool("airbroke_get_notice", { notice_id: "n1" }),
      );
      const json = await parseMcpResponse(res);
      const structured = requireStructuredContent(json) as {
        notice: { remarks_count: number };
      };

      expect(structured.notice.remarks_count).toBe(3);
    });
  });

  // ── airbroke_get_occurrence ───────────────────────────────────────────

  describe("airbroke_get_occurrence", () => {
    it("returns occurrence with notice excluded", async () => {
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
          resolved_at: null,
          created_at: new Date("2026-02-21T09:00:00.000Z"),
          updated_at: new Date("2026-02-21T09:01:00.000Z"),
          project: {
            id: "p1",
            name: "api",
            organization: "icoretech",
          },
        },
      } as unknown as Awaited<ReturnType<typeof db.occurrence.findUnique>>);

      const res = await POST(
        callTool("airbroke_get_occurrence", {
          occurrence_id: "o1",
          include_notice: false,
        }),
      );
      const json = await parseMcpResponse(res);
      const structured = requireStructuredContent(json) as {
        occurrence: { notice?: unknown };
      };

      expect(res.status).toBe(200);
      expect(structured.occurrence.notice).toBeUndefined();
    });

    it("returns occurrence with notice and project included", async () => {
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
        resolved_at: new Date("2026-03-01T12:00:00.000Z"),
        notice: {
          id: "n1",
          project_id: "p1",
          env: "production",
          kind: "TypeError",
          seen_count: 7,
          resolved_at: new Date("2026-03-01T12:00:00.000Z"),
          created_at: new Date("2026-02-21T09:00:00.000Z"),
          updated_at: new Date("2026-02-21T09:01:00.000Z"),
          project: {
            id: "p1",
            name: "api",
            organization: "icoretech",
          },
        },
      } as unknown as Awaited<ReturnType<typeof db.occurrence.findUnique>>);

      const res = await POST(
        callTool("airbroke_get_occurrence", {
          occurrence_id: "o1",
          include_notice: true,
          include_project: true,
        }),
      );
      const json = await parseMcpResponse(res);
      const structured = requireStructuredContent(json) as {
        occurrence: {
          resolved_at: string;
          notice: { project: { name: string } };
        };
      };

      expect(res.status).toBe(200);
      expect(structured.occurrence.resolved_at).toBeTruthy();
      expect(structured.occurrence.notice.project.name).toBe("api");
    });

    it("returns not found for missing occurrence", async () => {
      vi.mocked(db.occurrence.findUnique).mockResolvedValue(null);

      const res = await POST(
        callTool("airbroke_get_occurrence", { occurrence_id: "missing" }),
      );
      const json = await parseMcpResponse(res);
      const result = requireResult(json) as {
        isError?: boolean;
        structuredContent?: { error?: string };
      };

      expect(res.status).toBe(200);
      expect(result.isError).toBe(true);
      expect(result.structuredContent?.error).toBe("Occurrence not found");
    });

    it("includes remarks in occurrence response", async () => {
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
        created_at: new Date(),
        updated_at: new Date(),
        resolved_at: null,
        notice: {
          id: "n1",
          project_id: "p1",
          env: "production",
          kind: "TypeError",
          seen_count: 7,
          resolved_at: null,
          created_at: new Date(),
          updated_at: new Date(),
          project: { id: "p1", name: "api", organization: "icoretech" },
        },
      } as unknown as Awaited<ReturnType<typeof db.occurrence.findUnique>>);
      vi.mocked(db.remark.findMany).mockResolvedValue([
        {
          id: "r1",
          body: "test note",
          occurrence_id: null,
          created_at: new Date(),
          user: { name: "Kain" },
        },
      ] as unknown as Awaited<ReturnType<typeof db.remark.findMany>>);

      const res = await POST(
        callTool("airbroke_get_occurrence", { occurrence_id: "o1" }),
      );
      const json = await parseMcpResponse(res);
      const structured = requireStructuredContent(json) as {
        occurrence: {
          remarks: Array<{ body: string; is_notice_level: boolean }>;
        };
      };

      expect(structured.occurrence.remarks).toHaveLength(1);
      expect(structured.occurrence.remarks[0].body).toBe("test note");
      expect(structured.occurrence.remarks[0].is_notice_level).toBe(true);
    });
  });

  // ── airbroke_search ───────────────────────────────────────────────────

  describe("airbroke_search", () => {
    it("searches with filters, details, and pagination", async () => {
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
            resolved_at: null,
            updated_at: new Date("2026-02-21T10:02:00.000Z"),
            project: {
              id: "p1",
              name: "AR-arplus",
              organization: "AR",
            },
          },
        },
      ] as unknown as Awaited<ReturnType<typeof db.occurrence.findMany>>);

      const res = await POST(
        callTool("airbroke_search", {
          query: "network",
          organization: "AR",
          env: "android-production",
          include_resolved: false,
          include_details: true,
          backtrace_frames: 1,
          limit: 20,
          offset: 2,
        }),
      );
      const json = await parseMcpResponse(res);
      const structured = requireStructuredContent(json) as {
        matches: Array<{
          notice: {
            resolved_at: unknown;
            project: { name: string };
          };
          backtrace_preview: unknown[];
        }>;
      };

      expect(res.status).toBe(200);
      expect(
        vi.mocked(db.occurrence.findMany).mock.calls[0]?.[0],
      ).toMatchObject({
        take: 20,
        skip: 2,
        where: {
          resolved_at: null,
          notice: {
            env: "android-production",
            project: {
              organization: {
                equals: "AR",
                mode: "insensitive",
              },
            },
          },
        },
      });
      expect(structured.matches[0]?.notice.project.name).toBe("AR-arplus");
      expect(structured.matches[0]?.backtrace_preview).toHaveLength(1);
      expect(structured.matches[0]?.notice.resolved_at).toBeNull();
    });

    it("searches by project_id", async () => {
      vi.mocked(db.project.findUnique).mockResolvedValueOnce({
        id: "p1",
        name: "api",
        organization: "icoretech",
        paused: false,
        notices_count: BigInt(7),
        created_at: new Date("2026-01-01T00:00:00.000Z"),
        updated_at: new Date("2026-02-21T10:00:00.000Z"),
      } as unknown as Awaited<ReturnType<typeof db.project.findUnique>>);
      vi.mocked(db.occurrence.findMany).mockResolvedValue([]);

      const res = await POST(
        callTool("airbroke_search", {
          query: "error",
          project_id: "p1",
        }),
      );
      await parseMcpResponse(res);

      expect(
        vi.mocked(db.occurrence.findMany).mock.calls[0]?.[0],
      ).toMatchObject({
        where: {
          notice: {
            project_id: "p1",
          },
        },
      });
    });

    it("resolves a human project reference before running search", async () => {
      vi.mocked(db.project.findUnique).mockResolvedValueOnce(null);
      vi.mocked(db.project.findMany).mockResolvedValueOnce([
        {
          id: "p1",
          name: "sample-app",
          organization: "Example Org",
          paused: false,
          notices_count: BigInt(4),
          created_at: new Date("2026-01-01T00:00:00.000Z"),
          updated_at: new Date("2026-02-21T10:00:00.000Z"),
        },
      ] as unknown as Awaited<ReturnType<typeof db.project.findMany>>);
      vi.mocked(db.occurrence.findMany).mockResolvedValueOnce([]);

      const res = await POST(
        callTool("airbroke_search", {
          project_id: "sample-app",
          query: "Unauthorized",
        }),
      );
      const json = await parseMcpResponse(res);
      const structured = requireStructuredContent(json) as {
        filters: { project_id: string; requested_project_id: string };
        resolved_project: { name: string };
      };

      expect(res.status).toBe(200);
      expect(
        vi.mocked(db.occurrence.findMany).mock.calls[0]?.[0],
      ).toMatchObject({
        where: {
          notice: {
            project_id: "p1",
          },
        },
      });
      expect(structured.filters.project_id).toBe("p1");
      expect(structured.filters.requested_project_id).toBe("sample-app");
      expect(structured.resolved_project.name).toBe("sample-app");
    });

    it("returns validation error without query", async () => {
      const res = await POST(
        callTool("airbroke_search", { organization: "AR" }),
      );
      const json = await parseMcpResponse(res);
      const result = (json.result ?? null) as {
        structuredContent?: { error?: string };
        isError?: boolean;
      } | null;
      const error = (json.error ?? null) as { message?: string } | null;

      expect(res.status).toBe(200);
      if (result?.structuredContent?.error) {
        expect(result.isError).toBe(true);
        expect(result.structuredContent.error).toBe(
          "Invalid arguments for airbroke_search",
        );
        return;
      }

      if (error?.message) {
        expect(String(error.message)).toContain("airbroke_search");
        return;
      }

      if (result?.isError) {
        expect(result.isError).toBe(true);
        return;
      }

      throw new Error(
        `Unexpected validation response: ${JSON.stringify(json)}`,
      );
    });
  });

  // ── airbroke_get_setup_guide ──────────────────────────────────────────

  describe("airbroke_get_setup_guide", () => {
    it("returns all snippets with placeholders when no project_id", async () => {
      const res = await POST(callTool("airbroke_get_setup_guide", {}));
      const json = await parseMcpResponse(res);
      const structured = requireStructuredContent(json) as {
        project_id: string | null;
        has_real_credentials: boolean;
        snippets: Array<{
          sdk: string;
          name: string;
          filename: string;
          language: string;
          code: string;
        }>;
        guidance: string;
      };

      expect(res.status).toBe(200);
      expect(structured.project_id).toBeNull();
      expect(structured.has_real_credentials).toBe(false);
      expect(structured.snippets.length).toBeGreaterThanOrEqual(13);
      expect(structured.guidance).toContain("errors only");

      // Verify placeholders are present (not substituted)
      const rubySnippet = structured.snippets.find((s) =>
        s.name.includes("Ruby"),
      );
      expect(rubySnippet).toBeDefined();
      expect(rubySnippet?.code).toContain("{YOUR_PROJECT_API_KEY}");
      expect(rubySnippet?.sdk).toBe("airbrake");

      // Verify both SDK families are present
      const sdks = new Set(structured.snippets.map((s) => s.sdk));
      expect(sdks.has("airbrake")).toBe(true);
      expect(sdks.has("sentry")).toBe(true);
    });

    it("substitutes real credentials when project_id is provided", async () => {
      vi.mocked(db.project.findUnique).mockResolvedValue({
        id: "p1",
        api_key: "real-api-key-123",
      } as unknown as Awaited<ReturnType<typeof db.project.findUnique>>);

      process.env.BETTER_AUTH_URL = "https://airbroke.example.com";

      const res = await POST(
        callTool("airbroke_get_setup_guide", { project_id: "p1" }),
      );
      const json = await parseMcpResponse(res);
      const structured = requireStructuredContent(json) as {
        project_id: string;
        has_real_credentials: boolean;
        snippets: Array<{ code: string }>;
      };

      expect(structured.project_id).toBe("p1");
      expect(structured.has_real_credentials).toBe(true);

      const rubySnippet = structured.snippets.find((s) =>
        (s as { name?: string }).name?.includes("Ruby"),
      ) as { code: string } | undefined;
      expect(rubySnippet?.code).toContain("real-api-key-123");
      expect(rubySnippet?.code).toContain("https://airbroke.example.com");
      expect(rubySnippet?.code).not.toContain("{REPLACE_");

      delete process.env.BETTER_AUTH_URL;
    });

    it("resolves real credentials from an unambiguous project name", async () => {
      vi.mocked(db.project.findUnique)
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({
          id: "p1",
          api_key: "real-api-key-123",
        } as unknown as Awaited<ReturnType<typeof db.project.findUnique>>);
      vi.mocked(db.project.findMany).mockResolvedValueOnce([
        {
          id: "p1",
          name: "sample-app",
          organization: "Example Org",
          paused: false,
          notices_count: BigInt(4),
          created_at: new Date("2026-01-01T00:00:00.000Z"),
          updated_at: new Date("2026-02-21T10:00:00.000Z"),
        },
      ] as unknown as Awaited<ReturnType<typeof db.project.findMany>>);

      const res = await POST(
        callTool("airbroke_get_setup_guide", { project_id: "sample-app" }),
      );
      const json = await parseMcpResponse(res);
      const structured = requireStructuredContent(json) as {
        project_id: string;
        requested_project_id: string;
        matched_by: string;
      };

      expect(structured.project_id).toBe("p1");
      expect(structured.requested_project_id).toBe("sample-app");
      expect(structured.matched_by).toBe("name_exact");
    });

    it("returns not found for missing project", async () => {
      vi.mocked(db.project.findUnique).mockResolvedValue(null);

      const res = await POST(
        callTool("airbroke_get_setup_guide", { project_id: "missing" }),
      );
      const json = await parseMcpResponse(res);
      const result = requireResult(json) as {
        isError?: boolean;
        structuredContent?: { error?: string };
      };

      expect(result.isError).toBe(true);
      expect(result.structuredContent?.error).toBe("Project not found");
    });

    it("filters by sdk family", async () => {
      const res = await POST(
        callTool("airbroke_get_setup_guide", { sdk: "sentry" }),
      );
      const json = await parseMcpResponse(res);
      const structured = requireStructuredContent(json) as {
        snippets: Array<{ sdk: string }>;
      };

      expect(structured.snippets.length).toBe(2);
      expect(structured.snippets.every((s) => s.sdk === "sentry")).toBe(true);
    });

    it("filters by framework name", async () => {
      const res = await POST(
        callTool("airbroke_get_setup_guide", { framework: "ruby" }),
      );
      const json = await parseMcpResponse(res);
      const structured = requireStructuredContent(json) as {
        snippets: Array<{ name: string }>;
      };

      expect(structured.snippets.length).toBeGreaterThanOrEqual(1);
      expect(
        structured.snippets.every(
          (s) =>
            s.name.toLowerCase().includes("ruby") ||
            (s as { language?: string }).language === "ruby",
        ),
      ).toBe(true);
    });

    it("filters by both sdk and framework", async () => {
      const res = await POST(
        callTool("airbroke_get_setup_guide", {
          sdk: "airbrake",
          framework: "go",
        }),
      );
      const json = await parseMcpResponse(res);
      const structured = requireStructuredContent(json) as {
        snippets: Array<{ sdk: string; name: string }>;
      };

      expect(structured.snippets.length).toBe(1);
      expect(structured.snippets[0]?.sdk).toBe("airbrake");
      expect(structured.snippets[0]?.name).toContain("Go");
    });

    it("returns empty snippets for non-matching framework", async () => {
      const res = await POST(
        callTool("airbroke_get_setup_guide", { framework: "cobol" }),
      );
      const json = await parseMcpResponse(res);
      const structured = requireStructuredContent(json) as {
        snippets: unknown[];
      };

      expect(structured.snippets).toHaveLength(0);
    });
  });
});
