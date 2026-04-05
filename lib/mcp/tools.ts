import { z } from "zod";
import { db } from "@/lib/db";
import {
  airbrakeIntegrations,
  sentryIntegrations,
} from "@/lib/integrationsData";
import type { Prisma } from "@/prisma/generated/client";

export type McpToolResult = {
  content: Array<{ type: "text"; text: string }>;
  structuredContent?: Record<string, unknown>;
  isError?: boolean;
};

type ToolSpec = {
  description: string;
  inputSchema: z.ZodTypeAny;
  run(args: unknown): Promise<unknown>;
};

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
    include_resolved: z.boolean().optional().default(true),
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

const GetSetupGuideArgsSchema = z
  .object({
    project_id: z.string().min(1).optional(),
    sdk: z
      .enum(["airbrake", "sentry"])
      .optional()
      .describe("Filter by SDK family: 'airbrake' or 'sentry'. Omit for all."),
    framework: z
      .string()
      .trim()
      .min(1)
      .optional()
      .describe(
        "Filter by framework/language name (case-insensitive partial match, e.g. 'ruby', 'node', 'python', 'go', 'sentry browser').",
      ),
  })
  .strict();

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }
  return value as Record<string, unknown>;
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
    for (const [key, nested] of Object.entries(record)) {
      output[key] = toJsonSafe(nested);
    }
    return output;
  }

  return value;
}

export function buildToolSuccess(payload: unknown): McpToolResult {
  const safePayload = toJsonSafe(payload);
  const structuredContent =
    asRecord(safePayload) ??
    ({ value: safePayload } as Record<string, unknown>);

  return {
    content: [{ type: "text", text: JSON.stringify(safePayload, null, 2) }],
    structuredContent,
  };
}

export function buildToolError(
  message: string,
  details?: unknown,
): McpToolResult {
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
              resolved_at: true,
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
        resolved_at: notice.resolved_at ?? null,
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

export const MCP_TOOLS: Record<string, ToolSpec> = {
  airbroke_list_projects: {
    description: "List projects in Airbroke with optional filtering.",
    inputSchema: ListProjectsArgsSchema,
    run: async (args: z.infer<typeof ListProjectsArgsSchema>) => {
      const where: Prisma.ProjectWhereInput = {};
      if (args.search) {
        where.name = { contains: args.search, mode: "insensitive" };
      }
      if (args.organization) {
        where.organization = args.organization;
      }
      if (!args.includePaused) {
        where.paused = false;
      }

      const projects = await db.project.findMany({
        where,
        orderBy: [{ organization: "asc" }, { name: "asc" }],
        take: args.limit,
        skip: args.offset,
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

      return { projects };
    },
  },
  airbroke_get_project: {
    description: "Get details for a single project by id.",
    inputSchema: GetProjectArgsSchema,
    run: async (args: z.infer<typeof GetProjectArgsSchema>) => {
      const project = await db.project.findUnique({
        where: { id: args.project_id },
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
          project_id: args.project_id,
        });
      }

      return { project };
    },
  },
  airbroke_list_notices: {
    description:
      "List notices for a project with optional search, env filter, sorting, and limit.",
    inputSchema: ListNoticesArgsSchema,
    run: async (args: z.infer<typeof ListNoticesArgsSchema>) => {
      const where: Prisma.NoticeWhereInput = {
        project_id: args.project_id,
        ...(args.filter_by_env ? { env: args.filter_by_env } : {}),
        ...(args.search
          ? { kind: { contains: args.search, mode: "insensitive" } }
          : {}),
        ...(args.include_resolved ? {} : { resolved_at: null }),
      };

      const notices = await db.notice.findMany({
        where,
        orderBy: { [args.sort_attr]: args.sort_dir },
        take: args.limit,
        skip: args.offset,
        select: args.include_project
          ? {
              id: true,
              project_id: true,
              env: true,
              kind: true,
              seen_count: true,
              resolved_at: true,
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
              resolved_at: true,
              created_at: true,
              updated_at: true,
            },
      });

      return { notices };
    },
  },
  airbroke_list_occurrences: {
    description:
      "List occurrences for a notice with optional search, sorting, and resolved filter.",
    inputSchema: ListOccurrencesArgsSchema,
    run: async (args: z.infer<typeof ListOccurrencesArgsSchema>) => {
      const where: Prisma.OccurrenceWhereInput = {
        notice_id: args.notice_id,
        ...(args.search
          ? { message: { contains: args.search, mode: "insensitive" } }
          : {}),
        ...(args.include_resolved ? {} : { resolved_at: null }),
      };

      const includeNotice = args.include_notice || args.include_project;
      const rawOccurrences = await db.occurrence.findMany({
        where,
        orderBy: { [args.sort_attr]: args.sort_dir },
        take: args.limit,
        skip: args.offset,
        select: buildOccurrenceSelect(
          args.include_details,
          includeNotice,
          args.include_project,
        ),
      });

      const occurrences = rawOccurrences.map((occurrence) =>
        formatOccurrenceSummary(occurrence as Record<string, unknown>, {
          includeDetails: args.include_details,
          backtraceFrames: args.backtrace_frames,
          includeNotice,
          includeProject: args.include_project,
        }),
      );

      return { occurrences };
    },
  },
  airbroke_get_notice: {
    description:
      "Get notice details with latest and top occurrences for faster debugging context.",
    inputSchema: GetNoticeArgsSchema,
    run: async (args: z.infer<typeof GetNoticeArgsSchema>) => {
      const notice = await db.notice.findUnique({
        where: { id: args.notice_id },
        select: {
          id: true,
          project_id: true,
          env: true,
          kind: true,
          seen_count: true,
          resolved_at: true,
          created_at: true,
          updated_at: true,
          ...(args.include_project
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
          notice_id: args.notice_id,
        });
      }

      const remarkCount = await db.remark.count({
        where: { notice_id: args.notice_id, occurrence_id: null },
      });

      const occurrenceWhere: Prisma.OccurrenceWhereInput = {
        notice_id: args.notice_id,
        ...(args.include_resolved ? {} : { resolved_at: null }),
      };
      const occurrenceSelect = buildOccurrenceSelect(
        args.include_occurrence_details,
        false,
        false,
      );

      const [latestRaw, topRaw] = await Promise.all([
        db.occurrence.findMany({
          where: occurrenceWhere,
          orderBy: { updated_at: "desc" },
          take: args.latest_limit,
          select: occurrenceSelect,
        }),
        db.occurrence.findMany({
          where: occurrenceWhere,
          orderBy: [{ seen_count: "desc" }, { updated_at: "desc" }],
          take: args.top_limit,
          select: occurrenceSelect,
        }),
      ]);

      const latestOccurrences = latestRaw.map((occurrence) =>
        formatOccurrenceSummary(occurrence as Record<string, unknown>, {
          includeDetails: args.include_occurrence_details,
          backtraceFrames: args.backtrace_frames,
          includeNotice: false,
          includeProject: false,
        }),
      );
      const topOccurrences = topRaw.map((occurrence) =>
        formatOccurrenceSummary(occurrence as Record<string, unknown>, {
          includeDetails: args.include_occurrence_details,
          backtraceFrames: args.backtrace_frames,
          includeNotice: false,
          includeProject: false,
        }),
      );

      return {
        notice: { ...notice, remarks_count: remarkCount },
        latest_occurrences: latestOccurrences,
        top_occurrences: topOccurrences,
      };
    },
  },
  airbroke_get_occurrence: {
    description:
      "Get full occurrence details, including parent notice and project.",
    inputSchema: GetOccurrenceArgsSchema,
    run: async (args: z.infer<typeof GetOccurrenceArgsSchema>) => {
      const occurrence = await db.occurrence.findUnique({
        where: { id: args.occurrence_id },
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
          occurrence_id: args.occurrence_id,
        });
      }

      const remarks = await db.remark.findMany({
        where: {
          notice_id: occurrence.notice_id,
          OR: [{ occurrence_id: null }, { occurrence_id: args.occurrence_id }],
        },
        orderBy: { created_at: "asc" },
        select: {
          id: true,
          body: true,
          occurrence_id: true,
          created_at: true,
          user: { select: { name: true } },
        },
      });

      const formattedRemarks = remarks.map((r) => ({
        id: r.id,
        body: r.body,
        user_name: r.user.name,
        created_at: r.created_at,
        is_notice_level: r.occurrence_id === null,
      }));

      const occurrenceOutput = {
        ...occurrence,
        remarks: formattedRemarks,
      } as Record<string, unknown>;

      if (!args.include_notice) {
        delete occurrenceOutput.notice;
      } else if (!args.include_project) {
        const notice = asRecord(occurrenceOutput.notice);
        if (notice) {
          delete notice.project;
          occurrenceOutput.notice = notice;
        }
      }

      return { occurrence: occurrenceOutput };
    },
  },
  airbroke_search: {
    description:
      "Search across occurrences/notices/projects with optional filters for organization, project, env, and resolved status.",
    inputSchema: SearchArgsSchema,
    run: async (args: z.infer<typeof SearchArgsSchema>) => {
      const where: Prisma.OccurrenceWhereInput = {
        ...(args.include_resolved ? {} : { resolved_at: null }),
        ...(args.project_id || args.env || args.organization
          ? {
              notice: {
                ...(args.project_id ? { project_id: args.project_id } : {}),
                ...(args.env ? { env: args.env } : {}),
                ...(args.organization
                  ? {
                      project: {
                        organization: args.organization,
                      },
                    }
                  : {}),
              },
            }
          : {}),
        OR: [
          { message: { contains: args.query, mode: "insensitive" } },
          {
            notice: {
              kind: { contains: args.query, mode: "insensitive" },
            },
          },
          {
            notice: {
              env: { contains: args.query, mode: "insensitive" },
            },
          },
          {
            notice: {
              project: {
                name: { contains: args.query, mode: "insensitive" },
              },
            },
          },
          {
            notice: {
              project: {
                organization: {
                  contains: args.query,
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
        take: args.limit,
        skip: args.offset,
        select: buildOccurrenceSelect(args.include_details, true, true),
      });

      const matches = rawMatches.map((occurrence) =>
        formatOccurrenceSummary(occurrence as Record<string, unknown>, {
          includeDetails: args.include_details,
          backtraceFrames: args.backtrace_frames,
          includeNotice: true,
          includeProject: true,
        }),
      );

      return {
        query: args.query,
        filters: {
          organization: args.organization ?? null,
          project_id: args.project_id ?? null,
          env: args.env ?? null,
          include_resolved: args.include_resolved,
        },
        limit: args.limit,
        offset: args.offset,
        matches,
      };
    },
  },
  airbroke_get_setup_guide: {
    description:
      "Get integration setup code for connecting an application to Airbroke. " +
      "Airbroke is an error-only collector — it does NOT support performance monitoring, " +
      "session replay, logs, or metrics. The provided code snippets explicitly disable " +
      "non-error features in each SDK (APM, remote config, tracing, etc.) to prevent " +
      "the SDK from sending data that Airbroke will not process. " +
      "IMPORTANT: these snippets were built by inspecting each SDK's configuration surface " +
      "at a point in time. SDKs evolve and may add new telemetry features. When helping a " +
      "user integrate Airbroke, verify the snippet against the SDK version in use and disable " +
      "any newer non-error features not yet covered by the template. " +
      "Supports Airbrake-compatible SDKs (Ruby, Node.js, Python, Go, Java, PHP, .NET, " +
      "iOS Swift/ObjC, Android, JS Browser) and Sentry SDKs (Browser, Node.js). " +
      "Optionally pass a project_id to get ready-to-use code with real credentials; " +
      "without it, templates contain placeholders.",
    inputSchema: GetSetupGuideArgsSchema,
    run: async (args: z.infer<typeof GetSetupGuideArgsSchema>) => {
      let host = "your-airbroke-host.example.com";
      let origin = "https://your-airbroke-host.example.com";
      let projectKey = "{YOUR_PROJECT_API_KEY}";
      let projectId = "{YOUR_PROJECT_ID}";

      if (args.project_id) {
        const project = await db.project.findUnique({
          where: { id: args.project_id },
          select: { id: true, api_key: true },
        });

        if (!project) {
          return buildToolError("Project not found", {
            project_id: args.project_id,
          });
        }

        projectKey = project.api_key;
        projectId = project.id;

        // Derive host/origin from BETTER_AUTH_URL or fall back to placeholder
        const baseUrl = process.env.BETTER_AUTH_URL;
        if (baseUrl) {
          try {
            const url = new URL(baseUrl);
            host = url.host;
            origin = url.origin;
          } catch {
            // keep placeholders
          }
        }
      }

      const replacements: Record<string, string> = {
        REPLACE_PROJECT_KEY: projectKey,
        REPLACE_AIRBROKE_HOST: host,
        REPLACE_AIRBROKE_URL: origin,
        REPLACE_PROJECT_ID: projectId,
      };

      function applyReplacements(template: string): string {
        let result = template;
        for (const key in replacements) {
          const find = `{${key}}`;
          result = result.split(find).join(replacements[key]);
        }
        return result.trim();
      }

      type SnippetOutput = {
        sdk: "airbrake" | "sentry";
        name: string;
        filename: string;
        language: string;
        code: string;
      };

      const snippets: SnippetOutput[] = [];

      const includeAirbrake = !args.sdk || args.sdk === "airbrake";
      const includeSentry = !args.sdk || args.sdk === "sentry";
      const frameworkFilter = args.framework?.toLowerCase();

      if (includeAirbrake) {
        for (const item of airbrakeIntegrations) {
          if (
            frameworkFilter &&
            !item.name.toLowerCase().includes(frameworkFilter) &&
            !item.language.toLowerCase().includes(frameworkFilter)
          ) {
            continue;
          }
          snippets.push({
            sdk: "airbrake",
            name: item.name,
            filename: item.filename,
            language: item.language,
            code: applyReplacements(item.code),
          });
        }
      }

      if (includeSentry) {
        for (const item of sentryIntegrations) {
          if (
            frameworkFilter &&
            !item.name.toLowerCase().includes(frameworkFilter) &&
            !item.language.toLowerCase().includes(frameworkFilter)
          ) {
            continue;
          }
          snippets.push({
            sdk: "sentry",
            name: item.name,
            filename: item.filename,
            language: item.language,
            code: applyReplacements(item.code),
          });
        }
      }

      return {
        project_id: args.project_id ?? null,
        has_real_credentials: Boolean(args.project_id),
        snippets,
        guidance:
          "Airbroke collects errors only. Each snippet disables non-error SDK " +
          "features (APM, tracing, remote config, session replay, etc.). " +
          "SDKs add new telemetry over time — verify the snippet against the " +
          "SDK version in use and disable any newer non-error features.",
      };
    },
  },
};
