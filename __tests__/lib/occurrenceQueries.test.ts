// @vitest-environment node
import { afterEach, describe, expect, it } from "vitest";
import { db } from "@/lib/db";
import {
  getOccurrences,
  getOccurrencesCountByProjectId,
} from "@/lib/queries/occurrences";
import {
  createNotice,
  createOccurrence,
  createProject,
} from "../factories/prismaFactories";

const projectIds: string[] = [];

async function createTrackedProject() {
  const project = await createProject();
  projectIds.push(project.id);
  return project;
}

afterEach(async () => {
  if (projectIds.length === 0) return;

  await db.project.deleteMany({
    where: { id: { in: projectIds.splice(0) } },
  });
});

describe("occurrence queries", () => {
  it("filters occurrences by notice, resolution, search, and limit", async () => {
    const project = await createTrackedProject();
    const otherProject = await createTrackedProject();
    const notice = await createNotice(project.id, { kind: "CheckoutError" });
    const otherNotice = await createNotice(project.id, {
      kind: "WorkersError",
    });
    const externalNotice = await createNotice(otherProject.id, {
      kind: "CheckoutError",
    });

    const matchingUnresolved = await createOccurrence(notice.id, {
      message: "Needle failure",
      message_hash: "needle-unresolved",
      seen_count: BigInt(2),
    });
    const nonMatchingUnresolved = await createOccurrence(notice.id, {
      message: "Different failure",
      message_hash: "different-unresolved",
      seen_count: BigInt(4),
    });
    const matchingResolved = await createOccurrence(notice.id, {
      message: "Needle resolved",
      message_hash: "needle-resolved",
      seen_count: BigInt(8),
      resolved_at: new Date("2026-01-02T00:00:00.000Z"),
    });
    await createOccurrence(otherNotice.id, {
      message: "Needle from another notice",
      message_hash: "other-notice",
      seen_count: BigInt(16),
    });
    await createOccurrence(externalNotice.id, {
      message: "Needle from another project",
      message_hash: "external-notice",
      seen_count: BigInt(32),
    });

    const defaultUnresolved = await getOccurrences(notice.id, {
      sortAttr: "seen_count",
      sortDir: "asc",
    });
    expect(defaultUnresolved.map((occurrence) => occurrence.id)).toEqual([
      matchingUnresolved.id,
      nonMatchingUnresolved.id,
    ]);

    const resolvedOnly = await getOccurrences(notice.id, {
      resolvedFilter: "resolved",
      sortAttr: "seen_count",
      sortDir: "desc",
    });
    expect(resolvedOnly.map((occurrence) => occurrence.id)).toEqual([
      matchingResolved.id,
    ]);

    const limitedNeedleMatches = await getOccurrences(notice.id, {
      resolvedFilter: "all",
      searchQuery: "needle",
      sortAttr: "seen_count",
      sortDir: "desc",
      limit: 1,
    });
    expect(limitedNeedleMatches.map((occurrence) => occurrence.id)).toEqual([
      matchingResolved.id,
    ]);
  });

  it("counts occurrences through notices owned by the project", async () => {
    const project = await createTrackedProject();
    const otherProject = await createTrackedProject();
    const firstNotice = await createNotice(project.id, { kind: "ApiError" });
    const secondNotice = await createNotice(project.id, {
      kind: "WorkerError",
    });
    const otherProjectNotice = await createNotice(otherProject.id, {
      kind: "ApiError",
    });

    await createOccurrence(firstNotice.id);
    await createOccurrence(firstNotice.id, { message_hash: "second" });
    await createOccurrence(secondNotice.id);
    await createOccurrence(otherProjectNotice.id);

    await expect(getOccurrencesCountByProjectId(project.id)).resolves.toBe(3);
  });
});
