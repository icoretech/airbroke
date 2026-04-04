// @vitest-environment node
import { describe, expect, it, vi, beforeEach } from "vitest";

const mockFindMany = vi.fn().mockResolvedValue([]);
const mockCount = vi.fn().mockResolvedValue(0);
const mockFindUnique = vi.fn().mockResolvedValue(null);
const mockFindFirst = vi.fn().mockResolvedValue(null);

vi.mock("@/lib/db", () => ({
  db: {
    notice: {
      findMany: (...args: unknown[]) => mockFindMany(...args),
      count: (...args: unknown[]) => mockCount(...args),
      findUnique: (...args: unknown[]) => mockFindUnique(...args),
      findFirst: (...args: unknown[]) => mockFindFirst(...args),
    },
  },
}));

describe("getNotices resolved filter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("defaults to unresolved filter", async () => {
    const { getNotices } = await import("@/lib/queries/notices");
    await getNotices("proj1", {});
    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          resolved_at: null,
        }),
      }),
    );
  });

  it("filters resolved only", async () => {
    const { getNotices } = await import("@/lib/queries/notices");
    await getNotices("proj1", { resolvedFilter: "resolved" });
    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          resolved_at: { not: null },
        }),
      }),
    );
  });

  it("shows all when filter is all", async () => {
    const { getNotices } = await import("@/lib/queries/notices");
    await getNotices("proj1", { resolvedFilter: "all" });
    const callArgs = mockFindMany.mock.calls[0][0];
    expect(callArgs.where).not.toHaveProperty("resolved_at");
  });
});
