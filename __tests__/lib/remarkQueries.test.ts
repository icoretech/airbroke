// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockFindMany = vi.fn().mockResolvedValue([]);
const mockCount = vi.fn().mockResolvedValue(0);

vi.mock("@/lib/db", () => ({
  db: {
    remark: {
      findMany: (...args: unknown[]) => mockFindMany(...args),
      count: (...args: unknown[]) => mockCount(...args),
    },
  },
}));

describe("remark queries", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getRemarksByNoticeId", () => {
    it("fetches notice-level remarks only", async () => {
      const { getRemarksByNoticeId } = await import("@/lib/queries/remarks");
      await getRemarksByNoticeId("n1");
      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            notice_id: "n1",
            occurrence_id: null,
          },
          orderBy: { created_at: "asc" },
          include: {
            user: { select: { id: true, name: true, image: true } },
          },
        }),
      );
    });
  });

  describe("getRemarksByOccurrenceId", () => {
    it("fetches both notice-level and occurrence-level remarks", async () => {
      const { getRemarksByOccurrenceId } = await import(
        "@/lib/queries/remarks"
      );
      await getRemarksByOccurrenceId("o1", "n1");
      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            notice_id: "n1",
            OR: [{ occurrence_id: null }, { occurrence_id: "o1" }],
          },
          orderBy: { created_at: "asc" },
          include: {
            user: { select: { id: true, name: true, image: true } },
          },
        }),
      );
    });
  });

  describe("getRemarkCountByNoticeId", () => {
    it("counts notice-level remarks only", async () => {
      const { getRemarkCountByNoticeId } = await import(
        "@/lib/queries/remarks"
      );
      await getRemarkCountByNoticeId("n1");
      expect(mockCount).toHaveBeenCalledWith({
        where: { notice_id: "n1", occurrence_id: null },
      });
    });
  });

  describe("getRemarkCountForOccurrencePage", () => {
    it("counts both notice-level and occurrence-level remarks", async () => {
      const { getRemarkCountForOccurrencePage } = await import(
        "@/lib/queries/remarks"
      );
      await getRemarkCountForOccurrencePage("o1", "n1");
      expect(mockCount).toHaveBeenCalledWith({
        where: {
          notice_id: "n1",
          OR: [{ occurrence_id: null }, { occurrence_id: "o1" }],
        },
      });
    });
  });
});
