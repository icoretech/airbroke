// @vitest-environment node

import { PassThrough } from "node:stream";
import { renderToPipeableStream } from "react-dom/server";
import { describe, expect, test, vi } from "vitest";
import BookmarksLayout from "@/app/bookmarks/layout";
import NoticeLayout from "@/app/notices/[notice_id]/layout";
import OccurrenceLayout from "@/app/occurrences/[occurrence_id]/layout";
import ProjectLayout from "@/app/projects/[project_id]/layout";
import { AppShell } from "@/components/layout/AppShell";
import {
  buildNoticeCrumbsById,
  buildOccurrenceCrumbsById,
  buildProjectCrumbsById,
} from "@/lib/routing/breadcrumbs";
import type { ReactNode } from "react";

vi.mock("@/lib/routing/breadcrumbs", () => ({
  buildBookmarksCrumbs: vi.fn(() => []),
  buildProjectCrumbsById: vi.fn(),
  buildNoticeCrumbsById: vi.fn(),
  buildOccurrenceCrumbsById: vi.fn(),
}));
vi.mock("@/lib/db", () => ({
  db: {
    notice: { findUnique: vi.fn(async () => ({ project_id: "project-1" })) },
    occurrence: {
      findUnique: vi.fn(async () => ({ notice: { project_id: "project-1" } })),
    },
  },
}));
vi.mock("@/components/layout/AppShell", () => ({
  AppShell: vi.fn(async ({ children }: { children: ReactNode }) => (
    <main>{children}</main>
  )),
}));
vi.mock("@/components/layout/AppBreadcrumbs", () => ({ default: () => null }));
vi.mock("@/components/project/ProjectTopbarEndSlot", () => ({
  ProjectTopbarEndSlot: () => null,
}));
vi.mock("@/components/project/EditProjectButton", () => ({
  EditProjectButton: () => null,
}));

describe("detail layout streaming", () => {
  test.each([
    {
      name: "bookmarks",
      render: () => (
        <BookmarksLayout params={Promise.resolve({})}>
          <p>Detail content</p>
        </BookmarksLayout>
      ),
    },
    {
      name: "project",
      render: () => (
        <ProjectLayout params={Promise.resolve({ project_id: "project-1" })}>
          <p>Detail content</p>
        </ProjectLayout>
      ),
    },
    {
      name: "notice",
      render: () => (
        <NoticeLayout params={Promise.resolve({ notice_id: "notice-1" })}>
          <p>Detail content</p>
        </NoticeLayout>
      ),
    },
    {
      name: "occurrence",
      render: () => (
        <OccurrenceLayout
          params={Promise.resolve({ occurrence_id: "occurrence-1" })}
        >
          <p>Detail content</p>
        </OccurrenceLayout>
      ),
    },
  ])(
    "streams a fallback while $name shell data is pending",
    async ({ render }) => {
      // Given request-time breadcrumb and shell data that has not resolved yet.
      const crumbs =
        Promise.withResolvers<
          Awaited<ReturnType<typeof buildProjectCrumbsById>>
        >();
      vi.mocked(buildProjectCrumbsById).mockReturnValue(crumbs.promise);
      vi.mocked(buildNoticeCrumbsById).mockReturnValue(crumbs.promise);
      vi.mocked(buildOccurrenceCrumbsById).mockReturnValue(crumbs.promise);
      vi.mocked(AppShell).mockImplementation(async ({ children }) => {
        await crumbs.promise;
        return <main>{children}</main>;
      });
      const output = new PassThrough();
      const firstChunk = Promise.withResolvers<string>();
      const complete = Promise.withResolvers<string>();
      let html = "";
      output.on("data", (chunk: Buffer) => {
        html += chunk.toString();
        firstChunk.resolve(html);
      });
      output.on("end", () => complete.resolve(html));
      const errors: unknown[] = [];

      // When React renders the actual layout through its streaming server renderer.
      // A document shell lets React finalize the preamble before async data resolves.
      const stream = renderToPipeableStream(
        <html lang="en">
          <body>{render()}</body>
        </html>,
        {
          onShellReady() {
            stream.pipe(output);
          },
          onShellError: firstChunk.reject,
          onError(error) {
            errors.push(error);
          },
        },
      );

      try {
        // Then the fallback is available before data, followed by the detail content.
        expect(await firstChunk.promise).toContain("Loading...");
        expect(html).not.toContain("Detail content");
        crumbs.resolve([]);
        expect(await complete.promise).toContain(
          "<main><p>Detail content</p></main>",
        );
        expect(errors).toEqual([]);
      } finally {
        crumbs.resolve([]);
        stream.abort();
        output.destroy();
      }
    },
    5000,
  );
});
