import { db } from "@/lib/db";
import { McpReadModelError } from "@/lib/mcp/readModels/errors";
import {
  buildOccurrenceSelect,
  formatOccurrenceSummary,
} from "@/lib/mcp/readModels/occurrenceSummary";
import type {
  GetOccurrenceArgs,
  ListOccurrencesArgs,
} from "@/lib/mcp/tools/schemas";
import type { Prisma } from "@/prisma/generated/client";

export async function listOccurrencesReadModel(args: ListOccurrencesArgs) {
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
    formatOccurrenceSummary(occurrence, {
      includeDetails: args.include_details,
      backtraceFrames: args.backtrace_frames,
      includeNotice,
      includeProject: args.include_project,
    }),
  );

  return { occurrences };
}

export async function getOccurrenceReadModel(args: GetOccurrenceArgs) {
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
    throw new McpReadModelError("Occurrence not found", {
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

  const formattedRemarks = remarks.map((remark) => ({
    id: remark.id,
    body: remark.body,
    user_name: remark.user.name,
    created_at: remark.created_at,
    is_notice_level: remark.occurrence_id === null,
  }));

  const { notice, ...occurrenceFields } = occurrence;
  const occurrenceOutput = {
    ...occurrenceFields,
    remarks: formattedRemarks,
  };

  if (args.include_notice) {
    const { project, ...noticeFields } = notice;
    return {
      occurrence: {
        ...occurrenceOutput,
        notice: args.include_project ? notice : noticeFields,
      },
    };
  }

  return { occurrence: occurrenceOutput };
}
