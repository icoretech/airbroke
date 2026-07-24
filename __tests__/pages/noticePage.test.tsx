import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test, vi } from "vitest";

vi.mock("@/lib/queries/notices", () => ({
  getNoticeById: vi.fn(() =>
    Promise.resolve({
      id: "notice-1",
      project_id: "project-1",
      kind: "Sample Error",
      env: "production",
      seen_count: BigInt(3),
      updated_at: new Date("2026-01-02T03:04:05.000Z"),
      project: {
        id: "project-1",
        name: "Sample Project",
        organization: "example-org",
      },
    }),
  ),
}));

vi.mock("@/lib/queries/remarks", () => ({
  getRemarkCountByNoticeId: vi.fn(() => Promise.resolve(0)),
}));

vi.mock("@/components/common/CustomTimeAgo", () => ({
  default: () => <span>recently</span>,
}));

vi.mock("@/components/common/EnvironmentLabel", () => ({
  default: () => <span>production</span>,
}));

vi.mock("@/components/notice/OccurrencesTable", () => ({
  default: () => <div>Occurrence rows</div>,
}));

vi.mock("@/components/notice/StatusFilter", () => ({
  default: () => <button type="button">Status filter</button>,
}));

vi.mock("@/components/remark/RemarkThread", () => ({
  default: () => <div>Remark thread</div>,
}));

vi.mock("@/app/notices/[notice_id]/Sort", () => ({
  default: () => <button type="button">Sort occurrences</button>,
}));

import Notice from "@/app/notices/[notice_id]/page";

describe("Notice", () => {
  test("keeps the remarks heading and thread in one surface on narrow screens", async () => {
    const html = renderToStaticMarkup(
      await Notice({
        params: Promise.resolve({ notice_id: "notice-1" }),
        searchParams: Promise.resolve({}),
      }),
    );
    const document = new DOMParser().parseFromString(html, "text/html");
    const remarksHeading = [...document.querySelectorAll("h2")].find(
      (heading) => heading.textContent === "Remarks",
    );
    const remarksSection = remarksHeading?.closest("section");

    expect(remarksSection?.classList.contains("overflow-hidden")).toBe(true);
    expect(remarksSection?.classList.contains("border")).toBe(true);
    expect(remarksSection?.classList.contains("bg-card")).toBe(true);
    expect(remarksSection?.classList.contains("backdrop-blur")).toBe(false);
  });

  test("allows the occurrence filters to wrap on narrow screens", async () => {
    const html = renderToStaticMarkup(
      await Notice({
        params: Promise.resolve({ notice_id: "notice-1" }),
        searchParams: Promise.resolve({}),
      }),
    );
    const document = new DOMParser().parseFromString(html, "text/html");
    const statusFilter = [...document.querySelectorAll("button")].find(
      (button) => button.textContent === "Status filter",
    );

    expect(statusFilter?.parentElement?.classList.contains("flex-wrap")).toBe(
      true,
    );
  });

  test("keeps notice metadata below the project identity through tablet widths", async () => {
    const html = renderToStaticMarkup(
      await Notice({
        params: Promise.resolve({ notice_id: "notice-1" }),
        searchParams: Promise.resolve({}),
      }),
    );
    const document = new DOMParser().parseFromString(html, "text/html");
    const projectLink = document.querySelector('a[href="/projects/project-1"]');
    const headerLayout = projectLink?.parentElement?.parentElement;

    expect(headerLayout?.classList.contains("lg:flex-row")).toBe(true);
    expect(headerLayout?.classList.contains("sm:flex-row")).toBe(false);
  });
});
