import { asRecord } from "@/lib/mcp/toolResult";
import type { Prisma } from "@/prisma/generated/client";

const occurrenceBaseSelect = {
  id: true,
  notice_id: true,
  message: true,
  seen_count: true,
  resolved_at: true,
  created_at: true,
  updated_at: true,
} as const satisfies Prisma.OccurrenceSelect;

const occurrenceDetailSelect = {
  ...occurrenceBaseSelect,
  backtrace: true,
  context: true,
  environment: true,
  params: true,
} as const satisfies Prisma.OccurrenceSelect;

const noticeSummarySelect = {
  id: true,
  project_id: true,
  env: true,
  kind: true,
  seen_count: true,
  resolved_at: true,
  updated_at: true,
} as const satisfies Prisma.NoticeSelect;

const projectSummarySelect = {
  id: true,
  name: true,
  organization: true,
} as const satisfies Prisma.ProjectSelect;

const noticeWithProjectSelect = {
  ...noticeSummarySelect,
  project: {
    select: projectSummarySelect,
  },
} as const satisfies Prisma.NoticeSelect;

const occurrenceWithNoticeSelect = {
  ...occurrenceBaseSelect,
  notice: {
    select: noticeSummarySelect,
  },
} as const satisfies Prisma.OccurrenceSelect;

const occurrenceDetailWithNoticeSelect = {
  ...occurrenceDetailSelect,
  notice: {
    select: noticeSummarySelect,
  },
} as const satisfies Prisma.OccurrenceSelect;

const occurrenceWithNoticeProjectSelect = {
  ...occurrenceBaseSelect,
  notice: {
    select: noticeWithProjectSelect,
  },
} as const satisfies Prisma.OccurrenceSelect;

const occurrenceDetailWithNoticeProjectSelect = {
  ...occurrenceDetailSelect,
  notice: {
    select: noticeWithProjectSelect,
  },
} as const satisfies Prisma.OccurrenceSelect;

type OccurrenceSummarySelect =
  | typeof occurrenceBaseSelect
  | typeof occurrenceDetailSelect
  | typeof occurrenceWithNoticeSelect
  | typeof occurrenceDetailWithNoticeSelect
  | typeof occurrenceWithNoticeProjectSelect
  | typeof occurrenceDetailWithNoticeProjectSelect;

type OccurrenceSummaryInput =
  | Prisma.OccurrenceGetPayload<{ select: typeof occurrenceBaseSelect }>
  | Prisma.OccurrenceGetPayload<{ select: typeof occurrenceDetailSelect }>
  | Prisma.OccurrenceGetPayload<{ select: typeof occurrenceWithNoticeSelect }>
  | Prisma.OccurrenceGetPayload<{
      select: typeof occurrenceDetailWithNoticeSelect;
    }>
  | Prisma.OccurrenceGetPayload<{
      select: typeof occurrenceWithNoticeProjectSelect;
    }>
  | Prisma.OccurrenceGetPayload<{
      select: typeof occurrenceDetailWithNoticeProjectSelect;
    }>;

export function buildOccurrenceSelect(
  includeDetails: boolean,
  includeNotice: boolean,
  includeProject: boolean,
): OccurrenceSummarySelect {
  if (includeProject) {
    return includeDetails
      ? occurrenceDetailWithNoticeProjectSelect
      : occurrenceWithNoticeProjectSelect;
  }

  if (includeNotice) {
    return includeDetails
      ? occurrenceDetailWithNoticeSelect
      : occurrenceWithNoticeSelect;
  }

  return includeDetails ? occurrenceDetailSelect : occurrenceBaseSelect;
}

export function formatOccurrenceSummary(
  occurrence: OccurrenceSummaryInput,
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
    const backtrace =
      "backtrace" in occurrence && Array.isArray(occurrence.backtrace)
        ? occurrence.backtrace
        : [];
    const context =
      "context" in occurrence ? asRecord(occurrence.context) : null;

    result.backtrace_preview = backtrace.slice(0, options.backtraceFrames);
    result.severity =
      typeof context?.severity === "string" ? context.severity : null;
    result.language =
      typeof context?.language === "string" ? context.language : null;
    if (context?.environment !== undefined) {
      result.context_environment = context.environment;
    }
    result.environment =
      "environment" in occurrence ? (occurrence.environment ?? null) : null;
    result.params = "params" in occurrence ? (occurrence.params ?? null) : null;
  }

  if (options.includeNotice || options.includeProject) {
    if ("notice" in occurrence && occurrence.notice) {
      const { notice } = occurrence;
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
        if ("project" in notice && notice.project) {
          const { project } = notice;
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
