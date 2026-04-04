// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockFindMany = vi.fn().mockResolvedValue([]);

vi.mock("@/lib/db", () => ({
  db: {
    occurrence: {
      findMany: (...args: unknown[]) => mockFindMany(...args),
    },
  },
}));

describe("getOccurrences resolved filter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("defaults to unresolved filter", async () => {
    const { getOccurrences } = await import("@/lib/queries/occurrences");
    await getOccurrences("notice1", {});
    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          resolved_at: null,
        }),
      }),
    );
  });

  it("filters unresolved only", async () => {
    const { getOccurrences } = await import("@/lib/queries/occurrences");
    await getOccurrences("notice1", { resolvedFilter: "unresolved" });
    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          resolved_at: null,
        }),
      }),
    );
  });

  it("filters resolved only", async () => {
    const { getOccurrences } = await import("@/lib/queries/occurrences");
    await getOccurrences("notice1", { resolvedFilter: "resolved" });
    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          resolved_at: { not: null },
        }),
      }),
    );
  });
});
