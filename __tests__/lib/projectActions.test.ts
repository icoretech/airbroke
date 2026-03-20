// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from "vitest";

const revalidatePathMock = vi.fn();
const refreshMock = vi.fn();
const updateTagMock = vi.fn();
const cacheTagMock = vi.fn();
const cacheLifeMock = vi.fn();
const noticeDeleteManyMock = vi.fn();
const projectDeleteMock = vi.fn();
const redirectMock = vi.fn();

vi.mock("next/cache", () => ({
  cacheLife: cacheLifeMock,
  cacheTag: cacheTagMock,
  refresh: refreshMock,
  revalidatePath: revalidatePathMock,
  updateTag: updateTagMock,
}));

vi.mock("next/navigation", () => ({
  redirect: redirectMock,
  unstable_rethrow: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  db: {
    notice: {
      deleteMany: noticeDeleteManyMock,
    },
    project: {
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: projectDeleteMock,
    },
    hourlyOccurrence: {
      groupBy: vi.fn(),
    },
  },
}));

const { db } = await import("@/lib/db");
const {
  cachedProjectChartOccurrencesData,
  deleteProject,
  deleteProjectNotices,
} = await import("@/lib/actions/projectActions");

describe("deleteProjectNotices", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("revalidates project shell paths after deleting project notices", async () => {
    const projectId = "project-123";

    await deleteProjectNotices(projectId);

    expect(noticeDeleteManyMock).toHaveBeenCalledWith({
      where: { project_id: projectId },
    });
    expect(revalidatePathMock).toHaveBeenCalledWith("/projects");
    expect(revalidatePathMock).toHaveBeenCalledWith("/bookmarks");
    expect(revalidatePathMock).toHaveBeenCalledWith(
      `/projects/${projectId}`,
      "layout",
    );
    expect(revalidatePathMock).toHaveBeenCalledWith(`/projects/${projectId}`);
    expect(revalidatePathMock).toHaveBeenCalledWith(
      `/projects/${projectId}/edit`,
    );
    expect(updateTagMock).toHaveBeenCalledWith(`project-activity:${projectId}`);
    expect(refreshMock).toHaveBeenCalled();
  });
});

describe("cachedProjectChartOccurrencesData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(db.hourlyOccurrence.groupBy).mockResolvedValue(
      [] as unknown as Awaited<ReturnType<typeof db.hourlyOccurrence.groupBy>>,
    );
  });

  it("tags project activity chart data for cache invalidation", async () => {
    await cachedProjectChartOccurrencesData("project-123");

    expect(cacheLifeMock).toHaveBeenCalledWith("hours");
    expect(cacheTagMock).toHaveBeenCalledWith("project-activity:project-123");
  });
});

describe("deleteProject", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("revalidates the projects shell and redirects to the projects list", async () => {
    const projectId = "project-123";

    await deleteProject(projectId);

    expect(projectDeleteMock).toHaveBeenCalledWith({
      where: { id: projectId },
    });
    expect(revalidatePathMock).toHaveBeenCalledWith("/projects");
    expect(revalidatePathMock).toHaveBeenCalledWith("/bookmarks");
    expect(redirectMock).toHaveBeenCalledWith("/projects");
  });
});
