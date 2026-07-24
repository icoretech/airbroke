import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test, vi } from "vitest";

vi.mock("@/lib/queries/projects", () => ({
  getProjectById: vi.fn(() =>
    Promise.resolve({
      id: "project-1",
      name: "Sample Project",
      api_key: "sample-key",
      paused: false,
      notices_count: BigInt(3),
      repo_url: null,
      repo_branch: "main",
    }),
  ),
}));

vi.mock("@/lib/queries/notices", () => ({
  getNoticeEnvs: vi.fn(() => Promise.resolve(["production"])),
}));

vi.mock("@/components/common/CopyToClipboardButton", () => ({
  default: () => <button type="button">Copy</button>,
}));

vi.mock("@/components/notice/NoticesTable", () => ({
  default: () => <div>Notice rows</div>,
}));

vi.mock("@/components/notice/StatusFilter", () => ({
  default: () => <button type="button">Status filter</button>,
}));

vi.mock("@/app/projects/[project_id]/Filter", () => ({
  default: () => <button type="button">Environment filter</button>,
}));

vi.mock("@/app/projects/[project_id]/Sort", () => ({
  default: () => <button type="button">Sort notices</button>,
}));

vi.mock("@/app/projects/[project_id]/NoticesWithBulkActions", () => ({
  default: ({ children }: { children: React.ReactNode }) => children,
}));

import ProjectNotices from "@/app/projects/[project_id]/page";

describe("ProjectNotices", () => {
  test("uses an opaque semantic surface for the project header", async () => {
    const html = renderToStaticMarkup(
      await ProjectNotices({
        params: Promise.resolve({ project_id: "project-1" }),
        searchParams: Promise.resolve({}),
      }),
    );
    const document = new DOMParser().parseFromString(html, "text/html");
    const projectHeader = document.querySelector("section");

    expect(projectHeader?.classList.contains("bg-card")).toBe(true);
    expect(projectHeader?.classList.contains("backdrop-blur")).toBe(false);
  });

  test("allows the notice filters to wrap on narrow screens", async () => {
    const html = renderToStaticMarkup(
      await ProjectNotices({
        params: Promise.resolve({ project_id: "project-1" }),
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

  test("renders the read-only API key as selectable text", async () => {
    const html = renderToStaticMarkup(
      await ProjectNotices({
        params: Promise.resolve({ project_id: "project-1" }),
        searchParams: Promise.resolve({}),
      }),
    );
    const document = new DOMParser().parseFromString(html, "text/html");

    expect(document.querySelector("input[readonly]")).toBeNull();
    expect(document.querySelector("[data-api-key]")?.textContent).toBe(
      "sample-key",
    );
  });
});
