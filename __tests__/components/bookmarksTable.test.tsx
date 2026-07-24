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

vi.mock("@/lib/queries/occurrenceBookmarks", () => ({
  getOccurrenceBookmarks: vi.fn(() =>
    Promise.resolve([
      {
        occurrence_id: "occurrence-1",
        occurrence: {
          id: "occurrence-1",
          message: "undefined method body for nil response payload",
          created_at: new Date("2026-01-01T00:00:00.000Z"),
          updated_at: new Date("2026-01-02T00:00:00.000Z"),
          seen_count: BigInt(3),
          notice: {
            kind: "NoMethodError",
            env: "production",
            project: {
              id: "project-1",
              name: "sample-app",
              organization: "example-org",
            },
          },
        },
      },
    ]),
  ),
}));

vi.mock("@/components/common/CounterLabel", () => ({
  default: () => <span>3 times</span>,
}));
vi.mock("@/components/common/CustomTimeAgo", () => ({
  default: () => <span>recently</span>,
}));
vi.mock("@/components/common/EnvironmentLabel", () => ({
  default: () => <span>production</span>,
}));

import BookmarksTable from "@/components/bookmarks/BookmarksTable";

describe("BookmarksTable", () => {
  test("keeps each mobile project group in one continuous surface", async () => {
    const html = renderToStaticMarkup(await BookmarksTable({}));
    const document = new DOMParser().parseFromString(html, "text/html");
    const section = document.querySelector("section");
    const groupHeader = section?.querySelector(":scope > div");
    const list = section?.querySelector(":scope > ul");
    const row = list?.querySelector("li");
    const title = row?.querySelector("h3 span");

    expect(section?.classList.contains("overflow-hidden")).toBe(true);
    expect(section?.classList.contains("border")).toBe(true);
    expect(section?.classList.contains("bg-card")).toBe(true);
    expect(groupHeader?.classList.contains("border-b")).toBe(true);
    expect(list?.classList.contains("divide-y")).toBe(true);
    expect(row?.classList.contains("border")).toBe(false);
    expect(title?.classList.contains("line-clamp-2")).toBe(true);
    expect(title?.classList.contains("truncate")).toBe(false);
  });
});
