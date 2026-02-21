import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { corsHeaders } from "@/lib/cors";
import { db } from "@/lib/db";
import type { NextRequest } from "next/server";
import type { Prisma } from "@/prisma/generated/client";

type JsonRpcId = string | number | null;

type JsonRpcRequest = {
  id?: JsonRpcId;
  method?: unknown;
  params?: unknown;
};

type JsonRpcErrorBody = {
  jsonrpc: "2.0";
  id: JsonRpcId;
  error: {
    code: number;
    message: string;
    data?: unknown;
  };
};

type JsonRpcSuccessBody = {
  jsonrpc: "2.0";
  id: JsonRpcId;
  result: unknown;
};

type McpToolResult = {
  content: Array<{ type: "text"; text: string }>;
  structuredContent?: unknown;
  isError?: boolean;
};

type ToolDefinition = {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
};

const DEFAULT_PROTOCOL_VERSION = "2025-11-25";
const MCP_SERVER_NAME = "airbroke";
const MCP_SERVER_VERSION = "0.1.0";

const ListProjectsArgsSchema = z
  .object({
    search: z.string().trim().min(1).optional(),
    organization: z.string().trim().min(1).optional(),
    includePaused: z.boolean().optional().default(true),
    limit: z.coerce.number().int().min(1).max(200).optional().default(50),
    offset: z.coerce.number().int().min(0).max(10_000).optional().default(0),
  })
  .strict();

const GetProjectArgsSchema = z
  .object({
    project_id: z.string().min(1),
  })
  .strict();

const ListNoticesArgsSchema = z
  .object({
    project_id: z.string().min(1),
    search: z.string().trim().min(1).optional(),
    filter_by_env: z.string().trim().min(1).optional(),
    include_project: z.boolean().optional().default(false),
    sort_attr: z
      .enum(["env", "kind", "updated_at", "seen_count"])
      .optional()
      .default("updated_at"),
    sort_dir: z.enum(["asc", "desc"]).optional().default("desc"),
    limit: z.coerce.number().int().min(1).max(200).optional().default(50),
    offset: z.coerce.number().int().min(0).max(10_000).optional().default(0),
  })
  .strict();

const ListOccurrencesArgsSchema = z
  .object({
    notice_id: z.string().min(1),
    search: z.string().trim().min(1).optional(),
    include_resolved: z.boolean().optional().default(true),
    include_details: z.boolean().optional().default(false),
    include_notice: z.boolean().optional().default(false),
    include_project: z.boolean().optional().default(false),
    backtrace_frames: z.coerce
      .number()
      .int()
      .min(1)
      .max(100)
      .optional()
      .default(5),
    sort_attr: z
      .enum(["updated_at", "seen_count"])
      .optional()
      .default("updated_at"),
    sort_dir: z.enum(["asc", "desc"]).optional().default("desc"),
    limit: z.coerce.number().int().min(1).max(200).optional().default(50),
    offset: z.coerce.number().int().min(0).max(10_000).optional().default(0),
  })
  .strict();

const GetOccurrenceArgsSchema = z
  .object({
    occurrence_id: z.string().min(1),
    include_notice: z.boolean().optional().default(true),
    include_project: z.boolean().optional().default(true),
  })
  .strict();

const GetNoticeArgsSchema = z
  .object({
    notice_id: z.string().min(1),
    include_project: z.boolean().optional().default(true),
    include_occurrence_details: z.boolean().optional().default(true),
    include_resolved: z.boolean().optional().default(true),
    backtrace_frames: z.coerce
      .number()
      .int()
      .min(1)
      .max(100)
      .optional()
      .default(5),
    latest_limit: z.coerce.number().int().min(1).max(50).optional().default(5),
    top_limit: z.coerce.number().int().min(1).max(50).optional().default(5),
  })
  .strict();

const SearchArgsSchema = z
  .object({
    query: z.string().trim().min(1),
    organization: z.string().trim().min(1).optional(),
    project_id: z.string().min(1).optional(),
    env: z.string().trim().min(1).optional(),
    include_resolved: z.boolean().optional().default(true),
    include_details: z.boolean().optional().default(false),
    backtrace_frames: z.coerce
      .number()
      .int()
      .min(1)
      .max(100)
      .optional()
      .default(5),
    limit: z.coerce.number().int().min(1).max(200).optional().default(50),
    offset: z.coerce.number().int().min(0).max(10_000).optional().default(0),
  })
  .strict();

const MCP_TOOLS: ToolDefinition[] = [
  {
    name: "airbroke_list_projects",
    description: "List projects in Airbroke with optional filtering.",
    inputSchema: {
      type: "object",
      properties: {
        search: { type: "string" },
        organization: { type: "string" },
        includePaused: { type: "boolean", default: true },
        limit: { type: "integer", minimum: 1, maximum: 200, default: 50 },
        offset: { type: "integer", minimum: 0, maximum: 10000, default: 0 },
      },
      additionalProperties: false,
    },
  },
  {
    name: "airbroke_get_project",
    description: "Get details for a single project by id.",
    inputSchema: {
      type: "object",
      properties: {
        project_id: { type: "string" },
      },
      required: ["project_id"],
      additionalProperties: false,
    },
  },
  {
    name: "airbroke_list_notices",
    description:
      "List notices for a project with optional search, env filter, sorting, and limit.",
    inputSchema: {
      type: "object",
      properties: {
        project_id: { type: "string" },
        search: { type: "string" },
        filter_by_env: { type: "string" },
        include_project: { type: "boolean", default: false },
        sort_attr: {
          type: "string",
          enum: ["env", "kind", "updated_at", "seen_count"],
        },
        sort_dir: { type: "string", enum: ["asc", "desc"] },
        limit: { type: "integer", minimum: 1, maximum: 200, default: 50 },
        offset: { type: "integer", minimum: 0, maximum: 10000, default: 0 },
      },
      required: ["project_id"],
      additionalProperties: false,
    },
  },
  {
    name: "airbroke_list_occurrences",
    description:
      "List occurrences for a notice with optional search, sorting, and resolved filter.",
    inputSchema: {
      type: "object",
      properties: {
        notice_id: { type: "string" },
        search: { type: "string" },
        include_resolved: { type: "boolean", default: true },
        include_details: { type: "boolean", default: false },
        include_notice: { type: "boolean", default: false },
        include_project: { type: "boolean", default: false },
        backtrace_frames: {
          type: "integer",
          minimum: 1,
          maximum: 100,
          default: 5,
        },
        sort_attr: { type: "string", enum: ["updated_at", "seen_count"] },
        sort_dir: { type: "string", enum: ["asc", "desc"] },
        limit: { type: "integer", minimum: 1, maximum: 200, default: 50 },
        offset: { type: "integer", minimum: 0, maximum: 10000, default: 0 },
      },
      required: ["notice_id"],
      additionalProperties: false,
    },
  },
  {
    name: "airbroke_get_notice",
    description:
      "Get notice details with latest and top occurrences for faster debugging context.",
    inputSchema: {
      type: "object",
      properties: {
        notice_id: { type: "string" },
        include_project: { type: "boolean", default: true },
        include_occurrence_details: { type: "boolean", default: true },
        include_resolved: { type: "boolean", default: true },
        backtrace_frames: {
          type: "integer",
          minimum: 1,
          maximum: 100,
          default: 5,
        },
        latest_limit: { type: "integer", minimum: 1, maximum: 50, default: 5 },
        top_limit: { type: "integer", minimum: 1, maximum: 50, default: 5 },
      },
      required: ["notice_id"],
      additionalProperties: false,
    },
  },
  {
    name: "airbroke_search",
    description:
      "Search across occurrences/notices/projects with optional filters for organization, project, env, and resolved status.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string" },
        organization: { type: "string" },
        project_id: { type: "string" },
        env: { type: "string" },
        include_resolved: { type: "boolean", default: true },
        include_details: { type: "boolean", default: false },
        backtrace_frames: {
          type: "integer",
          minimum: 1,
          maximum: 100,
          default: 5,
        },
        limit: { type: "integer", minimum: 1, maximum: 200, default: 50 },
        offset: { type: "integer", minimum: 0, maximum: 10000, default: 0 },
      },
      required: ["query"],
      additionalProperties: false,
    },
  },
  {
    name: "airbroke_get_occurrence",
    description:
      "Get full occurrence details, including parent notice and project.",
    inputSchema: {
      type: "object",
      properties: {
        occurrence_id: { type: "string" },
        include_notice: { type: "boolean", default: true },
        include_project: { type: "boolean", default: true },
      },
      required: ["occurrence_id"],
      additionalProperties: false,
    },
  },
];

function parseJsonRpcId(value: unknown): JsonRpcId {
  if (
    typeof value === "string" ||
    typeof value === "number" ||
    value === null
  ) {
    return value;
  }
  return null;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }
  return value as Record<string, unknown>;
}

function jsonResponse(
  req: NextRequest,
  body: JsonRpcErrorBody | JsonRpcSuccessBody | Record<string, unknown>,
  status = 200,
) {
  return NextResponse.json(body, {
    status,
    headers: corsHeaders(req.headers),
  });
}

function jsonRpcError(
  req: NextRequest,
  id: JsonRpcId,
  code: number,
  message: string,
  status = 200,
  data?: unknown,
) {
  const body: JsonRpcErrorBody = {
    jsonrpc: "2.0",
    id,
    error: { code, message, ...(data !== undefined ? { data } : {}) },
  };
  return jsonResponse(req, body, status);
}

function jsonRpcSuccess(req: NextRequest, id: JsonRpcId, result: unknown) {
  const body: JsonRpcSuccessBody = { jsonrpc: "2.0", id, result };
  return jsonResponse(req, body);
}

function toJsonSafe(value: unknown): unknown {
  if (typeof value === "bigint") {
    return value.toString();
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (Array.isArray(value)) {
    return value.map((item) => toJsonSafe(item));
  }
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    const output: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(record)) {
      output[k] = toJsonSafe(v);
    }
    return output;
  }
  return value;
}

function buildToolSuccess(payload: unknown): McpToolResult {
  const safePayload = toJsonSafe(payload);
  return {
    content: [{ type: "text", text: JSON.stringify(safePayload, null, 2) }],
    structuredContent: safePayload,
  };
}

function buildToolError(message: string, details?: unknown): McpToolResult {
  const safeDetails = details === undefined ? null : toJsonSafe(details);
  return {
    isError: true,
    content: [{ type: "text", text: message }],
    structuredContent: {
      ok: false,
      error: message,
      details: safeDetails,
    },
  };
}

function extractToken(headers: Headers): string | null {
  const bearer = headers.get("Authorization") ?? headers.get("authorization");
  if (bearer?.startsWith("Bearer ")) {
    const token = bearer.slice("Bearer ".length).trim();
    if (token) return token;
  }

  const direct = headers.get("X-Airbroke-Mcp-Key");
  if (direct?.trim()) {
    return direct.trim();
  }

  return null;
}

function secureTokenEqual(a: string, b: string): boolean {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);
  if (aBuffer.length !== bBuffer.length) {
    return false;
  }
  return timingSafeEqual(aBuffer, bBuffer);
}

function authenticateMcpRequest(
  req: NextRequest,
): { ok: true } | { ok: false; status: number; message: string } {
  const expectedToken = process.env.AIRBROKE_MCP_API_KEY?.trim();
  if (!expectedToken) {
    return {
      ok: false,
      status: 503,
      message: "MCP API is disabled. Set AIRBROKE_MCP_API_KEY.",
    };
  }

  const providedToken = extractToken(req.headers);
  if (!providedToken || !secureTokenEqual(providedToken, expectedToken)) {
    return {
      ok: false,
      status: 401,
      message: "Unauthorized",
    };
  }

  return { ok: true };
}

function buildOccurrenceSelect(
  includeDetails: boolean,
  includeNotice: boolean,
  includeProject: boolean,
): Record<string, unknown> {
  return {
    id: true,
    notice_id: true,
    message: true,
    seen_count: true,
    resolved_at: true,
    created_at: true,
    updated_at: true,
    ...(includeDetails
      ? {
          backtrace: true,
          context: true,
          environment: true,
          params: true,
        }
      : {}),
    ...(includeNotice
      ? {
          notice: {
            select: {
              id: true,
              project_id: true,
              env: true,
              kind: true,
              seen_count: true,
              updated_at: true,
              ...(includeProject
                ? {
                    project: {
                      select: {
                        id: true,
                        name: true,
                        organization: true,
                      },
                    },
                  }
                : {}),
            },
          },
        }
      : {}),
  };
}

function formatOccurrenceSummary(
  occurrence: Record<string, unknown>,
  options: {
    includeDetails: boolean;
    backtraceFrames: number;
    includeNotice: boolean;
    includeProject: boolean;
  },
): Record<string, unknown> {
  const result: Record<string, unknown> = {
    id: occurrence.id,
    notice_id: occurrence.notice_id,
    message: occurrence.message,
    seen_count: occurrence.seen_count,
    resolved_at: occurrence.resolved_at ?? null,
    created_at: occurrence.created_at,
    updated_at: occurrence.updated_at,
  };

  if (options.includeDetails) {
    const backtrace = Array.isArray(occurrence.backtrace)
      ? occurrence.backtrace
      : [];
    const context = asRecord(occurrence.context);

    result.backtrace_preview = backtrace.slice(0, options.backtraceFrames);
    result.severity =
      typeof context?.severity === "string" ? context.severity : null;
    result.language =
      typeof context?.language === "string" ? context.language : null;
    if (context?.environment !== undefined) {
      result.context_environment = context.environment;
    }
    result.environment = occurrence.environment ?? null;
    result.params = occurrence.params ?? null;
  }

  if (options.includeNotice || options.includeProject) {
    const notice = asRecord(occurrence.notice);
    if (notice) {
      const noticeOutput: Record<string, unknown> = {
        id: notice.id,
        project_id: notice.project_id,
        env: notice.env,
        kind: notice.kind,
        seen_count: notice.seen_count,
        updated_at: notice.updated_at,
      };
      if (options.includeProject) {
        const project = asRecord(notice.project);
        if (project) {
          noticeOutput.project = {
            id: project.id,
            name: project.name,
            organization: project.organization,
          };
        }
      }
      result.notice = noticeOutput;
    }
  }

  return result;
}

async function runListProjects(rawArgs: unknown): Promise<McpToolResult> {
  const parsed = ListProjectsArgsSchema.safeParse(rawArgs ?? {});
  if (!parsed.success) {
    return buildToolError("Invalid arguments for airbroke_list_projects", {
      issues: parsed.error.issues,
    });
  }

  const where: Prisma.ProjectWhereInput = {};
  if (parsed.data.search) {
    where.name = { contains: parsed.data.search, mode: "insensitive" };
  }
  if (parsed.data.organization) {
    where.organization = parsed.data.organization;
  }
  if (!parsed.data.includePaused) {
    where.paused = false;
  }

  const projects = await db.project.findMany({
    where,
    orderBy: [{ organization: "asc" }, { name: "asc" }],
    take: parsed.data.limit,
    skip: parsed.data.offset,
    select: {
      id: true,
      name: true,
      organization: true,
      paused: true,
      notices_count: true,
      created_at: true,
      updated_at: true,
    },
  });

  return buildToolSuccess({ projects });
}

async function runGetProject(rawArgs: unknown): Promise<McpToolResult> {
  const parsed = GetProjectArgsSchema.safeParse(rawArgs ?? {});
  if (!parsed.success) {
    return buildToolError("Invalid arguments for airbroke_get_project", {
      issues: parsed.error.issues,
    });
  }

  const project = await db.project.findUnique({
    where: { id: parsed.data.project_id },
    select: {
      id: true,
      name: true,
      organization: true,
      paused: true,
      notices_count: true,
      repo_provider: true,
      repo_branch: true,
      repo_issue_tracker: true,
      repo_url: true,
      created_at: true,
      updated_at: true,
    },
  });

  if (!project) {
    return buildToolError("Project not found", {
      project_id: parsed.data.project_id,
    });
  }

  return buildToolSuccess({ project });
}

async function runListNotices(rawArgs: unknown): Promise<McpToolResult> {
  const parsed = ListNoticesArgsSchema.safeParse(rawArgs ?? {});
  if (!parsed.success) {
    return buildToolError("Invalid arguments for airbroke_list_notices", {
      issues: parsed.error.issues,
    });
  }

  const where: Prisma.NoticeWhereInput = {
    project_id: parsed.data.project_id,
    ...(parsed.data.filter_by_env ? { env: parsed.data.filter_by_env } : {}),
    ...(parsed.data.search
      ? { kind: { contains: parsed.data.search, mode: "insensitive" } }
      : {}),
  };

  const notices = await db.notice.findMany({
    where,
    orderBy: { [parsed.data.sort_attr]: parsed.data.sort_dir },
    take: parsed.data.limit,
    skip: parsed.data.offset,
    select: parsed.data.include_project
      ? {
          id: true,
          project_id: true,
          env: true,
          kind: true,
          seen_count: true,
          created_at: true,
          updated_at: true,
          project: {
            select: {
              id: true,
              name: true,
              organization: true,
            },
          },
        }
      : {
          id: true,
          project_id: true,
          env: true,
          kind: true,
          seen_count: true,
          created_at: true,
          updated_at: true,
        },
  });

  return buildToolSuccess({ notices });
}

async function runListOccurrences(rawArgs: unknown): Promise<McpToolResult> {
  const parsed = ListOccurrencesArgsSchema.safeParse(rawArgs ?? {});
  if (!parsed.success) {
    return buildToolError("Invalid arguments for airbroke_list_occurrences", {
      issues: parsed.error.issues,
    });
  }

  const where: Prisma.OccurrenceWhereInput = {
    notice_id: parsed.data.notice_id,
    ...(parsed.data.search
      ? { message: { contains: parsed.data.search, mode: "insensitive" } }
      : {}),
    ...(parsed.data.include_resolved ? {} : { resolved_at: null }),
  };

  const includeNotice =
    parsed.data.include_notice || parsed.data.include_project;
  const rawOccurrences = await db.occurrence.findMany({
    where,
    orderBy: { [parsed.data.sort_attr]: parsed.data.sort_dir },
    take: parsed.data.limit,
    skip: parsed.data.offset,
    select: buildOccurrenceSelect(
      parsed.data.include_details,
      includeNotice,
      parsed.data.include_project,
    ),
  });

  const occurrences = rawOccurrences.map((occurrence) =>
    formatOccurrenceSummary(occurrence as Record<string, unknown>, {
      includeDetails: parsed.data.include_details,
      backtraceFrames: parsed.data.backtrace_frames,
      includeNotice,
      includeProject: parsed.data.include_project,
    }),
  );

  return buildToolSuccess({ occurrences });
}

async function runGetNotice(rawArgs: unknown): Promise<McpToolResult> {
  const parsed = GetNoticeArgsSchema.safeParse(rawArgs ?? {});
  if (!parsed.success) {
    return buildToolError("Invalid arguments for airbroke_get_notice", {
      issues: parsed.error.issues,
    });
  }

  const notice = await db.notice.findUnique({
    where: { id: parsed.data.notice_id },
    select: {
      id: true,
      project_id: true,
      env: true,
      kind: true,
      seen_count: true,
      created_at: true,
      updated_at: true,
      ...(parsed.data.include_project
        ? {
            project: {
              select: {
                id: true,
                name: true,
                organization: true,
              },
            },
          }
        : {}),
    },
  });

  if (!notice) {
    return buildToolError("Notice not found", {
      notice_id: parsed.data.notice_id,
    });
  }

  const occurrenceWhere: Prisma.OccurrenceWhereInput = {
    notice_id: parsed.data.notice_id,
    ...(parsed.data.include_resolved ? {} : { resolved_at: null }),
  };
  const occurrenceSelect = buildOccurrenceSelect(
    parsed.data.include_occurrence_details,
    false,
    false,
  );

  const [latestRaw, topRaw] = await Promise.all([
    db.occurrence.findMany({
      where: occurrenceWhere,
      orderBy: { updated_at: "desc" },
      take: parsed.data.latest_limit,
      select: occurrenceSelect,
    }),
    db.occurrence.findMany({
      where: occurrenceWhere,
      orderBy: [{ seen_count: "desc" }, { updated_at: "desc" }],
      take: parsed.data.top_limit,
      select: occurrenceSelect,
    }),
  ]);

  const latestOccurrences = latestRaw.map((occurrence) =>
    formatOccurrenceSummary(occurrence as Record<string, unknown>, {
      includeDetails: parsed.data.include_occurrence_details,
      backtraceFrames: parsed.data.backtrace_frames,
      includeNotice: false,
      includeProject: false,
    }),
  );
  const topOccurrences = topRaw.map((occurrence) =>
    formatOccurrenceSummary(occurrence as Record<string, unknown>, {
      includeDetails: parsed.data.include_occurrence_details,
      backtraceFrames: parsed.data.backtrace_frames,
      includeNotice: false,
      includeProject: false,
    }),
  );

  return buildToolSuccess({
    notice,
    latest_occurrences: latestOccurrences,
    top_occurrences: topOccurrences,
  });
}

async function runGetOccurrence(rawArgs: unknown): Promise<McpToolResult> {
  const parsed = GetOccurrenceArgsSchema.safeParse(rawArgs ?? {});
  if (!parsed.success) {
    return buildToolError("Invalid arguments for airbroke_get_occurrence", {
      issues: parsed.error.issues,
    });
  }

  const occurrence = await db.occurrence.findUnique({
    where: { id: parsed.data.occurrence_id },
    include: {
      notice: {
        include: {
          project: {
            select: {
              id: true,
              name: true,
              organization: true,
            },
          },
        },
      },
    },
  });

  if (!occurrence) {
    return buildToolError("Occurrence not found", {
      occurrence_id: parsed.data.occurrence_id,
    });
  }

  const occurrenceOutput = {
    ...occurrence,
  } as Record<string, unknown>;

  if (!parsed.data.include_notice) {
    delete occurrenceOutput.notice;
  } else if (!parsed.data.include_project) {
    const notice = asRecord(occurrenceOutput.notice);
    if (notice) {
      delete notice.project;
      occurrenceOutput.notice = notice;
    }
  }

  return buildToolSuccess({ occurrence: occurrenceOutput });
}

async function runSearch(rawArgs: unknown): Promise<McpToolResult> {
  const parsed = SearchArgsSchema.safeParse(rawArgs ?? {});
  if (!parsed.success) {
    return buildToolError("Invalid arguments for airbroke_search", {
      issues: parsed.error.issues,
    });
  }

  const where: Prisma.OccurrenceWhereInput = {
    ...(parsed.data.include_resolved ? {} : { resolved_at: null }),
    ...(parsed.data.project_id || parsed.data.env || parsed.data.organization
      ? {
          notice: {
            ...(parsed.data.project_id
              ? { project_id: parsed.data.project_id }
              : {}),
            ...(parsed.data.env ? { env: parsed.data.env } : {}),
            ...(parsed.data.organization
              ? {
                  project: {
                    organization: parsed.data.organization,
                  },
                }
              : {}),
          },
        }
      : {}),
    OR: [
      { message: { contains: parsed.data.query, mode: "insensitive" } },
      {
        notice: {
          kind: { contains: parsed.data.query, mode: "insensitive" },
        },
      },
      {
        notice: {
          env: { contains: parsed.data.query, mode: "insensitive" },
        },
      },
      {
        notice: {
          project: {
            name: { contains: parsed.data.query, mode: "insensitive" },
          },
        },
      },
      {
        notice: {
          project: {
            organization: {
              contains: parsed.data.query,
              mode: "insensitive",
            },
          },
        },
      },
    ],
  };

  const rawMatches = await db.occurrence.findMany({
    where,
    orderBy: [{ updated_at: "desc" }, { seen_count: "desc" }],
    take: parsed.data.limit,
    skip: parsed.data.offset,
    select: buildOccurrenceSelect(parsed.data.include_details, true, true),
  });

  const matches = rawMatches.map((occurrence) =>
    formatOccurrenceSummary(occurrence as Record<string, unknown>, {
      includeDetails: parsed.data.include_details,
      backtraceFrames: parsed.data.backtrace_frames,
      includeNotice: true,
      includeProject: true,
    }),
  );

  return buildToolSuccess({
    query: parsed.data.query,
    filters: {
      organization: parsed.data.organization ?? null,
      project_id: parsed.data.project_id ?? null,
      env: parsed.data.env ?? null,
      include_resolved: parsed.data.include_resolved,
    },
    limit: parsed.data.limit,
    offset: parsed.data.offset,
    matches,
  });
}

async function runTool(name: string, rawArgs: unknown): Promise<McpToolResult> {
  switch (name) {
    case "airbroke_list_projects":
      return runListProjects(rawArgs);
    case "airbroke_get_project":
      return runGetProject(rawArgs);
    case "airbroke_list_notices":
      return runListNotices(rawArgs);
    case "airbroke_list_occurrences":
      return runListOccurrences(rawArgs);
    case "airbroke_get_notice":
      return runGetNotice(rawArgs);
    case "airbroke_search":
      return runSearch(rawArgs);
    case "airbroke_get_occurrence":
      return runGetOccurrence(rawArgs);
    default:
      return buildToolError(`Unknown tool: ${name}`);
  }
}

export async function handleMcpPost(req: NextRequest) {
  const auth = authenticateMcpRequest(req);
  if (!auth.ok) {
    return jsonResponse(req, { error: auth.message }, auth.status);
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonRpcError(req, null, -32700, "Parse error", 400);
  }

  const request = asRecord(body) as JsonRpcRequest | null;
  if (!request || typeof request.method !== "string") {
    return jsonRpcError(req, null, -32600, "Invalid Request");
  }

  const method = request.method;
  const id = parseJsonRpcId(request.id);

  if (method.startsWith("notifications/")) {
    return new NextResponse("", {
      status: 202,
      headers: corsHeaders(req.headers),
    });
  }

  if (method === "initialize") {
    const params = asRecord(request.params);
    const protocolVersion =
      typeof params?.protocolVersion === "string"
        ? params.protocolVersion
        : DEFAULT_PROTOCOL_VERSION;

    return jsonRpcSuccess(req, id, {
      protocolVersion,
      capabilities: {
        tools: {
          listChanged: false,
        },
      },
      serverInfo: {
        name: MCP_SERVER_NAME,
        version: MCP_SERVER_VERSION,
      },
    });
  }

  if (method === "ping") {
    return jsonRpcSuccess(req, id, {});
  }

  if (method === "tools/list") {
    return jsonRpcSuccess(req, id, {
      tools: MCP_TOOLS,
      nextCursor: null,
    });
  }

  if (method === "tools/call") {
    const params = asRecord(request.params);
    if (!params || typeof params.name !== "string") {
      return jsonRpcError(req, id, -32602, "Invalid params for tools/call");
    }

    const toolResult = await runTool(params.name, params.arguments);
    return jsonRpcSuccess(req, id, toolResult);
  }

  return jsonRpcError(req, id, -32601, `Method not found: ${method}`);
}

export async function handleMcpOptions(req: NextRequest) {
  return new NextResponse("", {
    status: 200,
    headers: corsHeaders(req.headers),
  });
}

export async function handleMcpGet(req: NextRequest) {
  return jsonResponse(
    req,
    {
      name: MCP_SERVER_NAME,
      version: MCP_SERVER_VERSION,
      endpoint: "/api/mcp",
      sse_endpoint: "/api/mcp/sse",
      auth: "Bearer token via AIRBROKE_MCP_API_KEY",
      tools: MCP_TOOLS.map((tool) => tool.name),
    },
    200,
  );
}

export async function handleMcpDelete(req: NextRequest) {
  return jsonRpcError(req, null, -32000, "Method not allowed.", 405);
}
