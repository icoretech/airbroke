import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test, vi } from "vitest";

vi.mock("@/lib/queries/notices", () => ({
  getNotices: vi.fn(async () => []),
}));
vi.mock("@/components/notice/ResolveNoticeButton", () => ({
  default: () => <button type="button">Resolve</button>,
}));

import NoticesTable from "@/components/notice/NoticesTable";

describe("NoticesTable empty states", () => {
  test.each([
    { searchParams: {}, title: "No unresolved notices", action: true },
    {
      searchParams: { resolvedFilter: "resolved" as const },
      title: "No resolved notices",
      action: true,
    },
    {
      searchParams: { resolvedFilter: "all" as const },
      title: "No notices yet",
      action: false,
    },
    {
      searchParams: { searchQuery: "missing" },
      title: "No matching notices",
      action: true,
    },
    {
      searchParams: { filterByEnv: "staging" },
      title: "No matching notices",
      action: true,
    },
  ])(
    "shows $title with a usable recovery route",
    async ({ searchParams, title, action }) => {
      const html = renderToStaticMarkup(
        await NoticesTable({ projectId: "project-1", searchParams }),
      );
      const document = new DOMParser().parseFromString(html, "text/html");
      expect(
        document.querySelector('[data-slot="empty-title"]')?.textContent,
      ).toBe(title);
      expect(
        document.querySelector('a[href="/projects/project-1/edit"]')
          ?.textContent,
      ).toBe("Configure SDKs");
      expect(
        Boolean(
          document.querySelector('a[href="/projects/project-1?status=all"]'),
        ),
      ).toBe(action);
      expect(document.querySelector("ul")).toBeNull();
    },
  );
});
