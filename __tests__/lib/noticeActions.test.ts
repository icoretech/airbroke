// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockUpdateMany = vi.fn().mockResolvedValue({ count: 0 });
const mockFindMany = vi.fn().mockResolvedValue([]);

vi.mock("@/lib/db", () => ({
  db: {
    occurrence: {
      updateMany: (...args: unknown[]) => mockUpdateMany(...args),
    },
    notice: {
      findMany: (...args: unknown[]) => mockFindMany(...args),
    },
  },
}));

vi.mock("@/lib/auth", () => ({
  getAuth: () => ({
    api: {
      getSession: vi.fn().mockResolvedValue({ user: { id: "user1" } }),
    },
  }),
}));

vi.mock("next/headers", () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

describe("noticeActions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("resolveAllOccurrences", () => {
    it("updates all unresolved occurrences for a notice", async () => {
      const { resolveAllOccurrences } = await import(
        "@/lib/actions/noticeActions"
      );
      await resolveAllOccurrences("notice1", "proj1");
      expect(mockUpdateMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            notice_id: "notice1",
            resolved_at: null,
          },
          data: {
            resolved_at: expect.any(Date),
          },
        }),
      );
    });
  });

  describe("reinstateAllOccurrences", () => {
    it("clears resolved_at for all resolved occurrences under a notice", async () => {
      const { reinstateAllOccurrences } = await import(
        "@/lib/actions/noticeActions"
      );
      await reinstateAllOccurrences("notice1", "proj1");
      expect(mockUpdateMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            notice_id: "notice1",
            resolved_at: { not: null },
          },
          data: {
            resolved_at: null,
          },
        }),
      );
    });
  });

  describe("resolveSelectedNotices", () => {
    it("resolves all occurrences under multiple notices", async () => {
      const { resolveSelectedNotices } = await import(
        "@/lib/actions/noticeActions"
      );
      await resolveSelectedNotices(["n1", "n2"], "proj1");
      expect(mockUpdateMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            notice_id: { in: ["n1", "n2"] },
            resolved_at: null,
          },
          data: {
            resolved_at: expect.any(Date),
          },
        }),
      );
    });
  });

  describe("resolveAllByProjectEnv", () => {
    it("resolves all occurrences for a project", async () => {
      mockFindMany.mockResolvedValue([{ id: "n1" }, { id: "n2" }]);
      const { resolveAllByProjectEnv } = await import(
        "@/lib/actions/noticeActions"
      );
      await resolveAllByProjectEnv("proj1");
      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { project_id: "proj1" },
          select: { id: true },
        }),
      );
      expect(mockUpdateMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            notice_id: { in: ["n1", "n2"] },
            resolved_at: null,
          },
        }),
      );
    });

    it("resolves all occurrences for a project+env", async () => {
      mockFindMany.mockResolvedValue([{ id: "n3" }]);
      const { resolveAllByProjectEnv } = await import(
        "@/lib/actions/noticeActions"
      );
      await resolveAllByProjectEnv("proj1", "production");
      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { project_id: "proj1", env: "production" },
          select: { id: true },
        }),
      );
    });
  });
});
