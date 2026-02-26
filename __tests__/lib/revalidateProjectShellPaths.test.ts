// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from "vitest";

const revalidatePathMock = vi.fn();

vi.mock("next/cache", () => ({
  revalidatePath: revalidatePathMock,
}));

const { revalidateProjectShellPaths, revalidateProjectsSidebarPaths } =
  await import("@/lib/actions/revalidateProjectShellPaths");

describe("revalidateProjectShellPaths", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("revalidates shared sidebar paths", () => {
    revalidateProjectsSidebarPaths();

    expect(revalidatePathMock).toHaveBeenCalledWith("/projects");
    expect(revalidatePathMock).toHaveBeenCalledWith("/bookmarks");
  });

  it("revalidates sidebar and project-specific shell paths", () => {
    revalidateProjectShellPaths("project-1");

    expect(revalidatePathMock).toHaveBeenCalledWith("/projects");
    expect(revalidatePathMock).toHaveBeenCalledWith("/bookmarks");
    expect(revalidatePathMock).toHaveBeenCalledWith(
      "/projects/project-1",
      "layout",
    );
    expect(revalidatePathMock).toHaveBeenCalledWith("/projects/project-1");
    expect(revalidatePathMock).toHaveBeenCalledWith("/projects/project-1/edit");
  });
});
