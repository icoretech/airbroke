import { db } from "@/lib/db";
import { McpReadModelError } from "@/lib/mcp/readModels/errors";
import { Prisma } from "@/prisma/generated/client";

export const PROJECT_SUMMARY_SELECT = {
  id: true,
  name: true,
  organization: true,
  paused: true,
  notices_count: true,
  created_at: true,
  updated_at: true,
} satisfies Prisma.ProjectSelect;

export type ProjectSummary = Prisma.ProjectGetPayload<{
  select: typeof PROJECT_SUMMARY_SELECT;
}>;

export type ProjectResolution =
  | {
      status: "resolved";
      project: ProjectSummary;
      matched_by:
        | "id"
        | "name_exact"
        | "org_name_exact"
        | "name_prefix"
        | "name_contains"
        | "org_contains";
    }
  | {
      status: "ambiguous";
      candidates: ProjectSummary[];
    }
  | {
      status: "missing";
    };

export type ResolvedProjectReference = Extract<
  ProjectResolution,
  { status: "resolved" }
>;

type ProjectMatchKind = ResolvedProjectReference["matched_by"];

function normalizeProjectReference(value: string): string {
  return value.trim().toLowerCase();
}

function splitProjectReference(
  value: string,
): { organization: string; name: string } | null {
  const trimmed = value.trim();
  const slashMatch = trimmed.match(/^(.+?)\s*\/\s*(.+)$/);
  if (slashMatch) {
    return {
      organization: slashMatch[1].trim(),
      name: slashMatch[2].trim(),
    };
  }

  const colonMatch = trimmed.match(/^(.+?)\s*:\s*(.+)$/);
  if (colonMatch) {
    return {
      organization: colonMatch[1].trim(),
      name: colonMatch[2].trim(),
    };
  }

  return null;
}

export function buildProjectLookupDetails(
  projectRef: string,
  candidates: ProjectSummary[],
): Record<string, unknown> {
  return {
    project_id: projectRef,
    candidates: candidates.map((candidate) => ({
      id: candidate.id,
      name: candidate.name,
      organization: candidate.organization,
    })),
  };
}

export function projectNotFound(projectId: string): McpReadModelError {
  return new McpReadModelError("Project not found", { project_id: projectId });
}

export async function resolveProjectReference(
  projectRef: string,
): Promise<ProjectResolution> {
  const exactProject = await db.project.findUnique({
    where: { id: projectRef },
    select: PROJECT_SUMMARY_SELECT,
  });

  if (exactProject) {
    return {
      status: "resolved",
      project: exactProject,
      matched_by: "id",
    };
  }

  const trimmed = projectRef.trim();
  const normalized = normalizeProjectReference(trimmed);
  const composite = splitProjectReference(trimmed);

  const candidates = await db.project.findMany({
    where: {
      OR: [
        {
          name: {
            contains: trimmed,
            mode: Prisma.QueryMode.insensitive,
          },
        },
        {
          organization: {
            contains: trimmed,
            mode: Prisma.QueryMode.insensitive,
          },
        },
        ...(composite
          ? [
              {
                AND: [
                  {
                    organization: {
                      contains: composite.organization,
                      mode: Prisma.QueryMode.insensitive,
                    },
                  },
                  {
                    name: {
                      contains: composite.name,
                      mode: Prisma.QueryMode.insensitive,
                    },
                  },
                ],
              },
            ]
          : []),
      ],
    },
    orderBy: [{ organization: "asc" }, { name: "asc" }],
    take: 10,
    select: PROJECT_SUMMARY_SELECT,
  });

  if (candidates.length === 0) {
    return { status: "missing" };
  }

  const scored = candidates
    .map((candidate) => {
      const candidateName = normalizeProjectReference(candidate.name);
      const candidateOrganization = normalizeProjectReference(
        candidate.organization,
      );
      const candidateComposite = `${candidateOrganization}/${candidateName}`;

      let score = 0;
      let matchedBy: ProjectMatchKind = "name_contains";

      if (candidateName === normalized) {
        score = 100;
        matchedBy = "name_exact";
      } else if (
        composite &&
        candidateComposite ===
          `${normalizeProjectReference(composite.organization)}/${normalizeProjectReference(composite.name)}`
      ) {
        score = 95;
        matchedBy = "org_name_exact";
      } else if (candidateName.startsWith(normalized)) {
        score = 80;
        matchedBy = "name_prefix";
      } else if (candidateName.includes(normalized)) {
        score = 70;
        matchedBy = "name_contains";
      } else if (candidateOrganization.includes(normalized)) {
        score = 60;
        matchedBy = "org_contains";
      }

      if (
        composite &&
        candidateOrganization.includes(
          normalizeProjectReference(composite.organization),
        ) &&
        candidateName.includes(normalizeProjectReference(composite.name))
      ) {
        score = Math.max(score, 95);
        matchedBy = "org_name_exact";
      }

      return {
        candidate,
        score,
        matchedBy,
      };
    })
    .sort(
      (a, b) =>
        b.score - a.score || a.candidate.name.localeCompare(b.candidate.name),
    );

  const top = scored[0];
  const equallyStrong = scored.filter((item) => item.score === top.score);

  if (top && top.score >= 70 && equallyStrong.length === 1) {
    return {
      status: "resolved",
      project: top.candidate,
      matched_by: top.matchedBy,
    };
  }

  return {
    status: "ambiguous",
    candidates: scored.slice(0, 5).map((item) => item.candidate),
  };
}

export async function resolveProjectReferenceOrThrow(
  projectRef: string,
): Promise<ResolvedProjectReference> {
  const resolution = await resolveProjectReference(projectRef);

  if (resolution.status === "missing") {
    throw projectNotFound(projectRef);
  }

  if (resolution.status === "ambiguous") {
    throw new McpReadModelError(
      "Project lookup is ambiguous",
      buildProjectLookupDetails(projectRef, resolution.candidates),
    );
  }

  return resolution;
}
