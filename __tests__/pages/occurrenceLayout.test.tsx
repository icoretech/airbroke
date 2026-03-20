// @vitest-environment node

import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

const connectionMock = vi.fn(async () => {});
const buildOccurrenceCrumbsByIdMock = vi.fn(async () => [
  { label: "Occurrence", href: "/occurrences/occ-1" },
]);
const findUniqueMock = vi.fn(async () => ({
  notice: { project_id: "project-123" },
}));

vi.mock("next/server", () => ({
  connection: connectionMock,
}));

vi.mock("@/components/AppBreadcrumbs", () => ({
  default: ({ items }: { items: Array<{ label: string; href: string }> }) => (
    <div data-breadcrumb-count={items.length} />
  ),
}));

vi.mock("@/components/AppShell", () => ({
  AppShell: ({
    children,
    selectedProjectId,
    topbarEndSlot,
    topbarSearchPlaceholder,
  }: {
    children: React.ReactNode;
    selectedProjectId?: string;
    topbarEndSlot?: React.ReactNode;
    topbarSearchPlaceholder: string;
  }) => (
    <div
      data-project-id={selectedProjectId}
      data-search-placeholder={topbarSearchPlaceholder}
    >
      {topbarEndSlot}
      {children}
    </div>
  ),
}));

vi.mock("@/components/project/EditProjectButton", () => ({
  EditProjectButton: ({ projectId }: { projectId: string }) => (
    <button type="button" data-edit-project-id={projectId} />
  ),
}));

vi.mock("@/lib/breadcrumbs", () => ({
  buildOccurrenceCrumbsById: buildOccurrenceCrumbsByIdMock,
}));

vi.mock("@/lib/db", () => ({
  db: {
    occurrence: {
      findUnique: findUniqueMock,
    },
  },
}));

const { default: OccurrenceLayout } = await import(
  "@/app/occurrences/[occurrence_id]/layout"
);

describe("OccurrenceLayout", () => {
  it("waits for request-time rendering before building the shell", async () => {
    const element = await OccurrenceLayout({
      children: <div>occurrence page</div>,
      params: Promise.resolve({ occurrence_id: "occ-1" }),
    } as LayoutProps<"/occurrences/[occurrence_id]">);

    const html = renderToStaticMarkup(element);

    expect(connectionMock).toHaveBeenCalledTimes(1);
    expect(findUniqueMock).toHaveBeenCalledWith({
      where: { id: "occ-1" },
      select: { notice: { select: { project_id: true } } },
    });
    expect(buildOccurrenceCrumbsByIdMock).toHaveBeenCalledWith("occ-1");
    expect(connectionMock.mock.invocationCallOrder[0]).toBeLessThan(
      findUniqueMock.mock.invocationCallOrder[0],
    );
    expect(html).toContain('data-project-id="project-123"');
    expect(html).toContain('data-edit-project-id="project-123"');
    expect(html).toContain("occurrence page");
  });
});
