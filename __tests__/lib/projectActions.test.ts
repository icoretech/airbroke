// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from "vitest";

const revalidatePathMock = vi.fn();
const noticeDeleteManyMock = vi.fn();

vi.mock("next/cache", () => ({
  cacheLife: vi.fn(),
  revalidatePath: revalidatePathMock,
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
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
      delete: vi.fn(),
    },
    hourlyOccurrence: {
      groupBy: vi.fn(),
    },
  },
}));

const { deleteProjectNotices } = await import("@/lib/actions/projectActions");

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
  });
});
