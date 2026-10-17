import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test, vi } from "vitest";

vi.mock("next/headers", () => ({
  headers: vi.fn(() => Promise.resolve(new Headers())),
}));

vi.mock("@/lib/auth", () => ({
  getAuth: () => ({
    api: {
      getSession: vi.fn(() => Promise.resolve({ user: { id: "user-1" } })),
    },
  }),
}));

vi.mock("@/lib/queries/occurrences", () => ({
  getOccurrences: vi.fn(() =>
    Promise.resolve([
      {
        id: "occurrence-1",
        message:
          "Call to function ExpoCamera_expo.modules.camera.ExpoCameraView",
        created_at: new Date("2026-01-01T00:00:00.000Z"),
        updated_at: new Date("2026-01-02T00:00:00.000Z"),
        seen_count: BigInt(2),
        resolved_at: new Date("2026-01-02T00:00:00.000Z"),
        notice: { kind: "RuntimeError", env: "production" },
      },
    ]),
  ),
}));

vi.mock("@/lib/queries/occurrenceBookmarks", () => ({
  getBookmarkedOccurrenceIds: vi.fn(() => Promise.resolve(new Set<string>())),
}));

vi.mock("@/components/common/CounterLabel", () => ({
  default: () => <span>2 times</span>,
}));
vi.mock("@/components/common/CustomTimeAgo", () => ({
  default: () => <span>recently</span>,
}));
vi.mock("@/components/common/EnvironmentLabel", () => ({
  default: () => <span>production</span>,
}));
vi.mock("@/components/occurrence/BookmarkButton", () => ({
  default: () => <button type="button">Bookmark</button>,
}));
vi.mock("@/components/occurrence/ResolveButton", () => ({
  default: () => <button type="button">Resolve</button>,
}));

import OccurrencesTable from "@/components/notice/OccurrencesTable";
import { getOccurrences } from "@/lib/queries/occurrences";

describe("OccurrencesTable", () => {
  test("wraps occurrence titles and first-seen metadata on narrow screens", async () => {
    const html = renderToStaticMarkup(
      await OccurrencesTable({ noticeId: "notice-1", searchParams: {} }),
    );
    const document = new DOMParser().parseFromString(html, "text/html");
    const title = document.querySelector("h2 span");
    const firstSeen = [...document.querySelectorAll("p")].find((paragraph) =>
      paragraph.textContent?.includes("First seen"),
    );
    const resolved = [...document.querySelectorAll('[data-slot="badge"]')].find(
      (element) => element.textContent === "resolved",
    );
    const occurrence = document.querySelector("li");

    expect(title?.classList.contains("line-clamp-2")).toBe(true);
    expect(title?.classList.contains("truncate")).toBe(false);
    expect(firstSeen?.classList.contains("truncate")).toBe(false);
    expect(firstSeen?.parentElement?.classList.contains("flex-wrap")).toBe(
      true,
    );
    expect(occurrence?.classList.contains("hover:bg-muted/50")).toBe(true);
    expect(resolved?.textContent).toBe("resolved");
  });
});

describe("OccurrencesTable empty states", () => {
  test.each([
    { searchParams: {}, title: "No unresolved occurrences", action: true },
    {
      searchParams: { resolvedFilter: "resolved" as const },
      title: "No resolved occurrences",
      action: true,
    },
    {
      searchParams: { resolvedFilter: "all" as const },
      title: "No occurrences yet",
      action: false,
    },
    {
      searchParams: { searchQuery: "missing" },
      title: "No matching occurrences",
      action: true,
    },
  ])(
    "shows $title with the appropriate recovery action",
    async ({ searchParams, title, action }) => {
      vi.mocked(getOccurrences).mockResolvedValueOnce([]);
      const html = renderToStaticMarkup(
        await OccurrencesTable({ noticeId: "notice-1", searchParams }),
      );
      const document = new DOMParser().parseFromString(html, "text/html");
      expect(
        document.querySelector('[data-slot="empty-title"]')?.textContent,
      ).toBe(title);
      const allStatuses = document.querySelector(
        'a[href="/notices/notice-1?status=all"]',
      );
      expect(Boolean(allStatuses)).toBe(action);
      expect(document.querySelector("ul")).toBeNull();
    },
  );
});
