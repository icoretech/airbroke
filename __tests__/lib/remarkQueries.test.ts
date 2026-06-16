// @vitest-environment node
import { afterEach, describe, expect, it } from "vitest";
import { db } from "@/lib/db";
import {
  getRemarkCountByNoticeId,
  getRemarkCountForOccurrencePage,
  getRemarksByNoticeId,
  getRemarksByOccurrenceId,
} from "@/lib/queries/remarks";
import {
  createNotice,
  createOccurrence,
  createProject,
  createRemark,
  createUser,
} from "../factories/prismaFactories";

const projectIds: string[] = [];
const userIds: string[] = [];

async function createTrackedProject() {
  const project = await createProject();
  projectIds.push(project.id);
  return project;
}

async function createTrackedUser() {
  const user = await createUser({ name: "Query Example User" });
  userIds.push(user.id);
  return user;
}

afterEach(async () => {
  if (projectIds.length > 0) {
    await db.project.deleteMany({
      where: { id: { in: projectIds.splice(0) } },
    });
  }

  if (userIds.length > 0) {
    await db.user.deleteMany({
      where: { id: { in: userIds.splice(0) } },
    });
  }
});

describe("remark queries", () => {
  it("returns notice-level remarks with the public user shape", async () => {
    const project = await createTrackedProject();
    const user = await createTrackedUser();
    const notice = await createNotice(project.id);
    const occurrence = await createOccurrence(notice.id);
    const noticeRemark = await createRemark(notice.id, user.id, {
      body: "Notice-level remark",
      created_at: new Date("2026-01-01T00:00:00.000Z"),
    });
    await createRemark(notice.id, user.id, {
      occurrence_id: occurrence.id,
      body: "Occurrence-level remark",
      created_at: new Date("2026-01-02T00:00:00.000Z"),
    });

    const remarks = await getRemarksByNoticeId(notice.id);

    expect(remarks.map((remark) => remark.id)).toEqual([noticeRemark.id]);
    expect(remarks[0]?.user).toEqual({
      id: user.id,
      image: user.image,
      name: user.name,
    });
    expect(remarks[0]?.user).not.toHaveProperty("email");
    await expect(getRemarkCountByNoticeId(notice.id)).resolves.toBe(1);
  });

  it("returns notice-level and selected occurrence-level remarks in chronological order", async () => {
    const project = await createTrackedProject();
    const otherProject = await createTrackedProject();
    const user = await createTrackedUser();
    const notice = await createNotice(project.id);
    const selectedOccurrence = await createOccurrence(notice.id, {
      message_hash: "selected",
    });
    const siblingOccurrence = await createOccurrence(notice.id, {
      message_hash: "sibling",
    });
    const otherNotice = await createNotice(otherProject.id);
    const otherOccurrence = await createOccurrence(otherNotice.id);

    const noticeRemark = await createRemark(notice.id, user.id, {
      body: "Notice-level remark",
      created_at: new Date("2026-01-01T00:00:00.000Z"),
    });
    const selectedOccurrenceRemark = await createRemark(notice.id, user.id, {
      occurrence_id: selectedOccurrence.id,
      body: "Selected occurrence remark",
      created_at: new Date("2026-01-02T00:00:00.000Z"),
    });
    await createRemark(notice.id, user.id, {
      occurrence_id: siblingOccurrence.id,
      body: "Sibling occurrence remark",
      created_at: new Date("2026-01-03T00:00:00.000Z"),
    });
    await createRemark(otherNotice.id, user.id, {
      occurrence_id: otherOccurrence.id,
      body: "Other project remark",
      created_at: new Date("2026-01-04T00:00:00.000Z"),
    });

    const remarks = await getRemarksByOccurrenceId(
      selectedOccurrence.id,
      notice.id,
    );

    expect(remarks.map((remark) => remark.id)).toEqual([
      noticeRemark.id,
      selectedOccurrenceRemark.id,
    ]);
    await expect(
      getRemarkCountForOccurrencePage(selectedOccurrence.id, notice.id),
    ).resolves.toBe(2);
  });
});
