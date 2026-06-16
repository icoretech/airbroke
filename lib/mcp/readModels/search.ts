import { db } from "@/lib/db";
import {
  buildOccurrenceSelect,
  formatOccurrenceSummary,
} from "@/lib/mcp/readModels/occurrenceSummary";
import { resolveProjectReferenceOrThrow } from "@/lib/mcp/readModels/projectResolution";
import type { ProjectSummary } from "@/lib/mcp/readModels/projectResolution";
import type { SearchArgs } from "@/lib/mcp/tools/schemas";
import type { Prisma } from "@/prisma/generated/client";

export async function searchReadModel(args: SearchArgs) {
  let resolvedProject: ProjectSummary | null = null;

  if (args.project_id) {
    resolvedProject = (await resolveProjectReferenceOrThrow(args.project_id))
      .project;
  }

  const where: Prisma.OccurrenceWhereInput = {
    ...(args.include_resolved ? {} : { resolved_at: null }),
    ...(resolvedProject || args.env || args.organization
      ? {
          notice: {
            ...(resolvedProject ? { project_id: resolvedProject.id } : {}),
            ...(args.env ? { env: args.env } : {}),
            ...(args.organization
              ? {
                  project: {
                    organization: {
                      equals: args.organization,
                      mode: "insensitive",
                    },
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
    formatOccurrenceSummary(occurrence, {
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
      project_id: resolvedProject?.id ?? args.project_id ?? null,
      requested_project_id: args.project_id ?? null,
      env: args.env ?? null,
      include_resolved: args.include_resolved,
    },
    limit: args.limit,
    offset: args.offset,
    matches,
    ...(resolvedProject
      ? {
          resolved_project: {
            id: resolvedProject.id,
            name: resolvedProject.name,
            organization: resolvedProject.organization,
          },
        }
      : {}),
  };
}
