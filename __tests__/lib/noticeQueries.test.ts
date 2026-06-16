// @vitest-environment node
import { afterEach, describe, expect, it } from "vitest";
import { db } from "@/lib/db";
import {
  getNoticeEnvs,
  getNotices,
  getNoticesCountByProjectId,
} from "@/lib/queries/notices";
import { createNotice, createProject } from "../factories/prismaFactories";

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

describe("notice queries", () => {
  it("filters notices by project, resolution, environment, search, and limit", async () => {
    const project = await createTrackedProject();
    const otherProject = await createTrackedProject();

    const unresolvedProduction = await createNotice(project.id, {
      env: "production",
      kind: "AlphaCheckoutError",
      seen_count: BigInt(4),
    });
    const unresolvedStaging = await createNotice(project.id, {
      env: "staging",
      kind: "GammaWorkersError",
      seen_count: BigInt(2),
    });
    const resolvedProduction = await createNotice(project.id, {
      env: "production",
      kind: "BetaCheckoutError",
      seen_count: BigInt(10),
      resolved_at: new Date("2026-01-02T00:00:00.000Z"),
    });
    await createNotice(otherProject.id, {
      env: "production",
      kind: "AlphaCheckoutError",
      seen_count: BigInt(99),
    });

    const defaultUnresolved = await getNotices(project.id, {
      sortAttr: "kind",
      sortDir: "asc",
    });
    expect(defaultUnresolved.map((notice) => notice.id)).toEqual([
      unresolvedProduction.id,
      unresolvedStaging.id,
    ]);

    const resolvedOnly = await getNotices(project.id, {
      resolvedFilter: "resolved",
      sortAttr: "seen_count",
      sortDir: "desc",
    });
    expect(resolvedOnly.map((notice) => notice.id)).toEqual([
      resolvedProduction.id,
    ]);

    const matchingProduction = await getNotices(project.id, {
      resolvedFilter: "all",
      filterByEnv: "production",
      searchQuery: "checkout",
      sortAttr: "seen_count",
      sortDir: "desc",
    });
    expect(matchingProduction.map((notice) => notice.id)).toEqual([
      resolvedProduction.id,
      unresolvedProduction.id,
    ]);

    const limited = await getNotices(
      project.id,
      { resolvedFilter: "all", sortAttr: "kind", sortDir: "asc" },
      1,
    );
    expect(limited.map((notice) => notice.id)).toEqual([
      unresolvedProduction.id,
    ]);
  });

  it("counts notices and returns sorted distinct environments per project", async () => {
    const project = await createTrackedProject();
    const otherProject = await createTrackedProject();

    await createNotice(project.id, { env: "staging", kind: "WorkersError" });
    await createNotice(project.id, { env: "production", kind: "ApiError" });
    await createNotice(project.id, {
      env: "production",
      kind: "CheckoutError",
    });
    await createNotice(otherProject.id, {
      env: "qa",
      kind: "ApiError",
    });

    await expect(getNoticesCountByProjectId(project.id)).resolves.toBe(3);
    await expect(getNoticeEnvs(project.id)).resolves.toEqual([
      "production",
      "staging",
    ]);
  });
});
