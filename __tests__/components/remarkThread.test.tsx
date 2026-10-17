import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, test, vi } from "vitest";
import RemarkThread from "@/components/remark/RemarkThread";

const { noticeQuery, occurrenceQuery, sessionQuery } = vi.hoisted(() => ({
  noticeQuery: vi.fn(),
  occurrenceQuery: vi.fn(),
  sessionQuery: vi.fn(),
}));

vi.mock("next/headers", () => ({ headers: async () => new Headers() }));
vi.mock("@/lib/auth", () => ({
  getAuth: () => ({ api: { getSession: sessionQuery } }),
}));
vi.mock("@/lib/queries/projects", () => ({ getProjectById: async () => null }));
vi.mock("@/lib/queries/remarks", () => ({
  getRemarksByNoticeId: noticeQuery,
  getRemarksByOccurrenceId: occurrenceQuery,
}));
vi.mock("@/components/remark/RemarkItem", () => ({
  default: ({
    remark,
    currentUserId,
  }: {
    remark: { body: string };
    currentUserId: string;
  }) => <p data-user={currentUserId}>{remark.body}</p>,
}));
vi.mock("@/components/remark/RemarkForm", () => ({
  default: ({
    noticeId,
    occurrenceId,
    userName,
  }: {
    noticeId: string;
    occurrenceId?: string;
    userName: string;
  }) => (
    <form
      aria-label="Remark form"
      data-notice={noticeId}
      data-occurrence={occurrenceId}
      data-name={userName}
    />
  ),
}));

const noticeRemark = {
  id: "remark-notice",
  occurrence_id: null,
  body: "Notice investigation",
};
const occurrenceRemark = {
  id: "remark-occurrence",
  occurrence_id: "occurrence-1",
  body: "Occurrence investigation",
};

describe("RemarkThread grouping", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionQuery.mockResolvedValue({
      user: { id: "user-1", name: "Example User", image: null },
    });
    noticeQuery.mockResolvedValue([]);
    occurrenceQuery.mockResolvedValue([]);
  });

  test("notice pages render notice remarks without section labels", async () => {
    noticeQuery.mockResolvedValue([noticeRemark]);
    const html = renderToStaticMarkup(
      await RemarkThread({ noticeId: "notice-1", projectId: "project-1" }),
    );
    expect(noticeQuery).toHaveBeenCalledWith("notice-1");
    expect(occurrenceQuery).not.toHaveBeenCalled();
    expect(html).toContain("Notice investigation");
    expect(html).not.toContain("Notice remarks");
    expect(html).not.toContain("Occurrence remarks");
    expect(html).toContain('data-user="user-1"');
  });

  test("occurrence pages group notice remarks before occurrence remarks regardless of query order", async () => {
    occurrenceQuery.mockResolvedValue([occurrenceRemark, noticeRemark]);
    const html = renderToStaticMarkup(
      await RemarkThread({
        noticeId: "notice-1",
        occurrenceId: "occurrence-1",
        projectId: "project-1",
      }),
    );
    expect(occurrenceQuery).toHaveBeenCalledWith("occurrence-1", "notice-1");
    expect(html.indexOf("Notice remarks")).toBeLessThan(
      html.indexOf("Notice investigation"),
    );
    expect(html.indexOf("Notice investigation")).toBeLessThan(
      html.indexOf("Occurrence remarks"),
    );
    expect(html.indexOf("Occurrence remarks")).toBeLessThan(
      html.indexOf("Occurrence investigation"),
    );
    expect(html).toContain('data-occurrence="occurrence-1"');
  });

  test("an occurrence-only thread has no redundant section heading", async () => {
    occurrenceQuery.mockResolvedValue([occurrenceRemark]);
    const html = renderToStaticMarkup(
      await RemarkThread({
        noticeId: "notice-1",
        occurrenceId: "occurrence-1",
        projectId: "project-1",
      }),
    );
    expect(html).toContain("Occurrence investigation");
    expect(html).not.toContain("Notice remarks");
    expect(html).not.toContain("Occurrence remarks");
  });

  test("an occurrence page with only notice remarks shows only the notice group", async () => {
    occurrenceQuery.mockResolvedValue([noticeRemark]);
    const html = renderToStaticMarkup(
      await RemarkThread({
        noticeId: "notice-1",
        occurrenceId: "occurrence-1",
        projectId: "project-1",
      }),
    );
    expect(html).toContain("Notice remarks");
    expect(html).not.toContain("Occurrence remarks");
    expect(html).not.toContain("No remarks yet");
  });

  test.each([undefined, "occurrence-1"])(
    "empty thread %s retains the Empty state and fallback form identity",
    async (occurrenceId) => {
      sessionQuery.mockResolvedValue(null);
      const html = renderToStaticMarkup(
        await RemarkThread({
          noticeId: "notice-1",
          occurrenceId,
          projectId: "project-1",
        }),
      );
      const document = new DOMParser().parseFromString(html, "text/html");
      expect(document.querySelectorAll('[data-slot="empty"]')).toHaveLength(1);
      expect(document.body.textContent).toContain("No remarks yet");
      expect(document.querySelector("form")?.getAttribute("data-name")).toBe(
        "User",
      );
      expect(document.querySelector("form")?.getAttribute("data-notice")).toBe(
        "notice-1",
      );
    },
  );
});
