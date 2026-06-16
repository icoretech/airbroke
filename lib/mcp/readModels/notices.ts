import { db } from "@/lib/db";
import { McpReadModelError } from "@/lib/mcp/readModels/errors";
import {
  buildOccurrenceSelect,
  formatOccurrenceSummary,
} from "@/lib/mcp/readModels/occurrenceSummary";
import { resolveProjectReferenceOrThrow } from "@/lib/mcp/readModels/projectResolution";
import type { GetNoticeArgs, ListNoticesArgs } from "@/lib/mcp/tools/schemas";
import type { Prisma } from "@/prisma/generated/client";

export async function listNoticesReadModel(args: ListNoticesArgs) {
  const resolution = await resolveProjectReferenceOrThrow(args.project_id);

  const where: Prisma.NoticeWhereInput = {
    project_id: resolution.project.id,
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

  return {
    notices,
    requested_project_id: args.project_id,
    resolved_project_id: resolution.project.id,
  };
}

export async function getNoticeReadModel(args: GetNoticeArgs) {
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
    throw new McpReadModelError("Notice not found", {
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
    formatOccurrenceSummary(occurrence, {
      includeDetails: args.include_occurrence_details,
      backtraceFrames: args.backtrace_frames,
      includeNotice: false,
      includeProject: false,
    }),
  );
  const topOccurrences = topRaw.map((occurrence) =>
    formatOccurrenceSummary(occurrence, {
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
}
