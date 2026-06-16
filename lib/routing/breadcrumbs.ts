import { cache } from "react";
import { db } from "@/lib/db";

type Crumb = { label: string; href?: string | null };

export function buildProjectsIndexCrumbs(): Crumb[] {
  return [{ label: "Projects", href: "/projects" }];
}

export const buildProjectCrumbsById = cache(
  async (projectId: string): Promise<Crumb[]> => {
    const p = await db.project.findUnique({
      where: { id: projectId },
      select: { organization: true, name: true },
    });
    return [
      { label: "Projects", href: "/projects" },
      { label: p?.organization ?? "Org" },
      { label: p?.name ?? "Project" },
    ];
  },
);

export const buildNoticeCrumbsById = cache(
  async (noticeId: string): Promise<Crumb[]> => {
    const n = await db.notice.findUnique({
      where: { id: noticeId },
      select: {
        kind: true,
        project: { select: { id: true, name: true, organization: true } },
      },
    });
    return [
      { label: "Projects", href: "/projects" },
      {
        label: n?.project.organization ?? "Org",
        href: n?.project?.id ? `/projects/${n.project.id}` : undefined,
      },
      {
        label: n?.project.name ?? "Project",
        href: n?.project?.id ? `/projects/${n.project.id}` : undefined,
      },
      { label: n?.kind ?? "Notice" },
    ];
  },
);

export const buildOccurrenceCrumbsById = cache(
  async (occurrenceId: string): Promise<Crumb[]> => {
    const o = await db.occurrence.findUnique({
      where: { id: occurrenceId },
      select: {
        id: true,
        notice: {
          select: {
            kind: true,
            project: { select: { id: true, name: true, organization: true } },
            id: true,
          },
        },
      },
    });
    const pid = o?.notice?.project?.id;
    const occurrenceLabel = "Occurrence";
    return [
      { label: "Projects", href: "/projects" },
      {
        label: o?.notice?.project?.organization ?? "Org",
        href: pid ? `/projects/${pid}` : undefined,
      },
      {
        label: o?.notice?.project?.name ?? "Project",
        href: pid ? `/projects/${pid}` : undefined,
      },
      {
        label: o?.notice?.kind ?? "Notice",
        href: o?.notice?.id ? `/notices/${o.notice.id}` : undefined,
      },
      { label: occurrenceLabel },
    ];
  },
);

export function buildBookmarksCrumbs(): Crumb[] {
  return [{ label: "Bookmarks", href: "/bookmarks" }];
}
