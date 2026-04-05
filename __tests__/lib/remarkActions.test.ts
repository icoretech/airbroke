// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockCreate = vi.fn().mockResolvedValue({ id: "r1" });
const mockUpdate = vi.fn().mockResolvedValue({ id: "r1" });
const mockDelete = vi.fn().mockResolvedValue({ id: "r1" });
const mockFindUnique = vi.fn();

vi.mock("@/lib/db", () => ({
  db: {
    remark: {
      create: (...args: unknown[]) => mockCreate(...args),
      update: (...args: unknown[]) => mockUpdate(...args),
      delete: (...args: unknown[]) => mockDelete(...args),
      findUnique: (...args: unknown[]) => mockFindUnique(...args),
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

describe("remarkActions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createRemark", () => {
    it("creates a notice-level remark", async () => {
      const { createRemark } = await import("@/lib/actions/remarkActions");
      await createRemark("n1", "test body");
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          data: {
            notice_id: "n1",
            user_id: "user1",
            body: "test body",
          },
        }),
      );
    });

    it("creates an occurrence-level remark", async () => {
      const { createRemark } = await import("@/lib/actions/remarkActions");
      await createRemark("n1", "test body", "o1");
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            notice_id: "n1",
            occurrence_id: "o1",
            user_id: "user1",
            body: "test body",
          }),
        }),
      );
    });
  });

  describe("updateRemark", () => {
    it("updates own remark", async () => {
      mockFindUnique.mockResolvedValue({
        id: "r1",
        user_id: "user1",
        notice_id: "n1",
        occurrence_id: null,
      });
      const { updateRemark } = await import("@/lib/actions/remarkActions");
      await updateRemark("r1", "updated body");
      expect(mockUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "r1" },
          data: { body: "updated body" },
        }),
      );
    });

    it("throws Forbidden when updating another user remark", async () => {
      mockFindUnique.mockResolvedValue({
        id: "r1",
        user_id: "other-user",
        notice_id: "n1",
        occurrence_id: null,
      });
      const { updateRemark } = await import("@/lib/actions/remarkActions");
      await expect(updateRemark("r1", "hacked")).rejects.toThrow("Forbidden");
    });
  });

  describe("deleteRemark", () => {
    it("deletes own remark", async () => {
      mockFindUnique.mockResolvedValue({
        id: "r1",
        user_id: "user1",
        notice_id: "n1",
        occurrence_id: "o1",
      });
      const { deleteRemark } = await import("@/lib/actions/remarkActions");
      await deleteRemark("r1");
      expect(mockDelete).toHaveBeenCalledWith({ where: { id: "r1" } });
    });

    it("throws Forbidden when deleting another user remark", async () => {
      mockFindUnique.mockResolvedValue({
        id: "r1",
        user_id: "other-user",
        notice_id: "n1",
        occurrence_id: null,
      });
      const { deleteRemark } = await import("@/lib/actions/remarkActions");
      await expect(deleteRemark("r1")).rejects.toThrow("Forbidden");
    });
  });
});
