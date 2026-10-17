import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test, vi } from "vitest";

vi.mock("@/lib/auth/requireSession", () => ({
  requireSession: vi.fn(() => Promise.resolve({ user: { id: "user-1" } })),
}));

vi.mock("@/lib/queries/occurrences", () => ({
  getOccurrenceById: vi.fn(() =>
    Promise.resolve({
      id: "occurrence-1",
      notice_id: "notice-1",
      message: "Sample failure",
      context: { request: { path: "/sample" } },
      environment: { os: "sample-os" },
      session: { id: "session-1" },
      params: { id: "sample" },
      seen_count: BigInt(2),
      resolved_at: null,
      created_at: new Date("2026-01-01T00:00:00.000Z"),
      updated_at: new Date("2026-01-02T00:00:00.000Z"),
      notice: {
        kind: "Sample Error",
        env: "production",
        project_id: "project-1",
        project: {
          id: "project-1",
          name: "Sample Project",
          organization: "example-org",
        },
      },
    }),
  ),
}));

vi.mock("@/lib/queries/occurrenceBookmarks", () => ({
  checkOccurrenceBookmarkExistence: vi.fn(() => Promise.resolve(false)),
}));

vi.mock("@/lib/queries/remarks", () => ({
  getRemarkCountForOccurrencePage: vi.fn(() => Promise.resolve(1)),
}));

vi.mock("@/components/common/CounterLabel", () => ({
  default: () => <div />,
}));
vi.mock("@/components/common/CustomTimeAgo", () => ({
  default: () => <div />,
}));
vi.mock("@/components/common/EnvironmentLabel", () => ({
  default: () => <div />,
}));
vi.mock("@/components/occurrence/Backtrace", () => ({
  default: () => <div />,
}));
vi.mock("@/components/occurrence/BookmarkButton", () => ({
  default: () => <div />,
}));
vi.mock("@/components/occurrence/Context", () => ({
  default: () => <div />,
}));
vi.mock("@/components/occurrence/Environment", () => ({
  default: () => <div />,
}));
vi.mock("@/components/occurrence/OccurrenceChartWrapper", () => ({
  default: () => <div />,
}));
vi.mock("@/components/occurrence/Params", () => ({
  default: () => <div />,
}));
vi.mock("@/components/occurrence/ResolveButton", () => ({
  default: () => <div />,
}));
vi.mock("@/components/occurrence/Session", () => ({
  default: () => <div />,
}));
vi.mock("@/components/occurrence/Toolbox", () => ({
  default: () => <div />,
}));
vi.mock("@/components/remark/RemarkThread", () => ({
  default: () => <div />,
}));

import Occurrence from "@/app/occurrences/[occurrence_id]/page";
import { getOccurrenceById } from "@/lib/queries/occurrences";

describe("Occurrence", () => {
  test("keeps empty data sections reachable by their native URL links", async () => {
    const occurrence = await getOccurrenceById("occurrence-1");
    if (!occurrence) throw new Error("Missing fixture");
    vi.mocked(getOccurrenceById).mockResolvedValueOnce({
      ...occurrence,
      environment: null,
      session: null,
      params: null,
    });
    const html = renderToStaticMarkup(
      await Occurrence({
        params: Promise.resolve({ occurrence_id: "occurrence-1" }),
        searchParams: Promise.resolve({ tab: "environment" }),
      }),
    );
    const document = new DOMParser().parseFromString(html, "text/html");
    const navigation = document.querySelector('nav[aria-label="Tabs"]');
    expect(navigation?.querySelectorAll("a")).toHaveLength(8);
    expect(
      navigation?.querySelector('[aria-current="page"]')?.textContent,
    ).toContain("Environment");
  });

  test("uses an opaque semantic surface for the occurrence header", async () => {
    const html = renderToStaticMarkup(
      await Occurrence({
        params: Promise.resolve({ occurrence_id: "occurrence-1" }),
        searchParams: Promise.resolve({}),
      }),
    );
    const document = new DOMParser().parseFromString(html, "text/html");
    const occurrenceHeader = document.querySelector('[data-slot="card"]');

    expect(occurrenceHeader?.classList.contains("bg-card")).toBe(true);
    expect(occurrenceHeader?.classList.contains("backdrop-blur")).toBe(false);
  });

  test("wraps every tab instead of clipping labels on narrow screens", async () => {
    const html = renderToStaticMarkup(
      await Occurrence({
        params: Promise.resolve({ occurrence_id: "occurrence-1" }),
        searchParams: Promise.resolve({}),
      }),
    );
    const document = new DOMParser().parseFromString(html, "text/html");
    const tabs = document.querySelector('nav[aria-label="Tabs"]');

    expect(tabs?.classList.contains("flex-wrap")).toBe(true);
    expect(tabs?.classList.contains("overflow-x-auto")).toBe(false);
    expect(tabs?.textContent).toContain("Environment");
    expect(tabs?.textContent).toContain("Remarks 1");
  });

  test("keeps the tab controls and active content in one mobile surface", async () => {
    const html = renderToStaticMarkup(
      await Occurrence({
        params: Promise.resolve({ occurrence_id: "occurrence-1" }),
        searchParams: Promise.resolve({}),
      }),
    );
    const document = new DOMParser().parseFromString(html, "text/html");
    const tabs = document.querySelector('nav[aria-label="Tabs"]');
    const tabsSection = tabs?.closest('[data-slot="card"]');
    const tabsHeader = tabs?.parentElement;

    expect(tabsSection?.classList.contains("overflow-hidden")).toBe(true);
    expect(
      tabsSection?.querySelector('[data-slot="card-content"]'),
    ).not.toBeNull();
    expect(tabsSection?.classList.contains("bg-card")).toBe(true);
    expect(tabsHeader?.classList.contains("border-b")).toBe(true);
    expect(tabsHeader?.classList.contains("rounded-lg")).toBe(false);
  });

  test.each([
    "backtrace",
    "context",
    "environment",
    "session",
    "params",
    "chart",
    "toolbox",
    "remarks",
  ])("renders %s as the current native navigation link", async (tab) => {
    const html = renderToStaticMarkup(
      await Occurrence({
        params: Promise.resolve({ occurrence_id: "occurrence-1" }),
        searchParams: Promise.resolve({ tab }),
      }),
    );
    const document = new DOMParser().parseFromString(html, "text/html");
    const navigation = document.querySelector('nav[aria-label="Tabs"]');
    expect(navigation?.querySelectorAll("a")).toHaveLength(8);
    expect(navigation?.querySelectorAll('[aria-current="page"]')).toHaveLength(
      1,
    );
    const current = navigation?.querySelector('[aria-current="page"]');
    expect(current?.tagName).toBe("A");
    expect(current?.getAttribute("href")).toBe(
      `/occurrences/occurrence-1?tab=${tab}`,
    );
    expect(current?.getAttribute("role")).not.toBe("button");
    expect(navigation?.querySelector("button")).toBeNull();
  });
});
