import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test, vi } from "vitest";

const { getProjectByIdMock, projectFixture } = vi.hoisted(() => {
  const projectFixture = (
    repoUrl: string | null = null,
    repoBranch: string | null = "main",
  ) => ({
    id: "project-1",
    name: "Sample Project",
    organization: "Example organization",
    api_key: "sample-key",
    paused: false,
    notices_count: BigInt(3),
    repo_url: repoUrl,
    repo_branch: repoBranch,
  });

  return {
    projectFixture,
    getProjectByIdMock: vi.fn(async () => projectFixture()),
  };
});

vi.mock("@/lib/queries/projects", () => ({
  getProjectById: getProjectByIdMock,
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
    const projectHeader = document.querySelector(
      '[aria-labelledby="project-name"]',
    );

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

  test("omits branch metadata when a project has no repository", async () => {
    // Given a project with the default branch but no repository.
    getProjectByIdMock.mockResolvedValueOnce(projectFixture());

    // When its notice page is rendered.
    const html = renderToStaticMarkup(
      await ProjectNotices({
        params: Promise.resolve({ project_id: "project-1" }),
        searchParams: Promise.resolve({}),
      }),
    );
    const document = new DOMParser().parseFromString(html, "text/html");

    // Then the header does not suggest a repository branch is configured.
    const header = document.querySelector('[aria-labelledby="project-name"]');
    expect(header?.textContent).not.toContain("Branch:");
    expect(header?.textContent).not.toContain("main");
  });

  test.each([
    { configuredBranch: "release", visibleBranch: "release" },
    { configuredBranch: null, visibleBranch: "main" },
  ])(
    "shows repository context with branch $visibleBranch",
    async ({ configuredBranch, visibleBranch }) => {
      // Given a project with a repository and an explicit or default branch.
      getProjectByIdMock.mockResolvedValueOnce(
        projectFixture(
          "https://example.com/example-org/sample-app",
          configuredBranch,
        ),
      );

      // When its notice page is rendered.
      const html = renderToStaticMarkup(
        await ProjectNotices({
          params: Promise.resolve({ project_id: "project-1" }),
          searchParams: Promise.resolve({}),
        }),
      );
      const document = new DOMParser().parseFromString(html, "text/html");

      // Then the repository link and its matching branch are shown together.
      const repository = document.querySelector(
        'a[href="https://example.com/example-org/sample-app"]',
      );
      expect(repository).not.toBeNull();
      expect(
        repository?.closest('[data-slot="card-content"]')?.textContent,
      ).toContain(`Branch: ${visibleBranch}`);
    },
  );
});
