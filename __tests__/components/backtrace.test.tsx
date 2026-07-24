import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test, vi } from "vitest";

vi.mock("@/lib/queries/occurrences", () => ({
  getOccurrenceById: vi.fn(() =>
    Promise.resolve({
      backtrace: [
        {
          file: "/PROJECT_ROOT/app/sample.ts",
          line: 42,
          function: "SampleCameraController.captureCurrentFrame",
        },
      ],
      notice: {
        project: {
          id: "project-1",
          repo_provider: "github",
          repo_url: "https://github.com/example-org/sample-app",
          repo_branch: "main",
        },
      },
    }),
  ),
}));

vi.mock("@/components/occurrence/ClipboardButton", () => ({
  default: ({ text }: { readonly text?: boolean }) => (
    <button type="button">{text ? "Copy Text" : "Copy JSON"}</button>
  ),
}));

import Backtrace from "@/components/occurrence/Backtrace";

describe("Backtrace", () => {
  test("keeps function names intact when a frame wraps on mobile", async () => {
    const html = renderToStaticMarkup(
      await Backtrace({ occurrenceId: "occurrence-1" }),
    );
    const document = new DOMParser().parseFromString(html, "text/html");
    const functionName = [...document.querySelectorAll("p")].find(
      (paragraph) =>
        paragraph.textContent === "SampleCameraController.captureCurrentFrame",
    );

    expect(functionName?.classList.contains("whitespace-nowrap")).toBe(true);
    expect(functionName?.classList.contains("text-foreground")).toBe(true);
    expect(functionName?.classList.contains("text-rose-500")).toBe(false);
  });

  test("uses semantic primary color for linked project paths", async () => {
    const html = renderToStaticMarkup(
      await Backtrace({ occurrenceId: "occurrence-1" }),
    );
    const document = new DOMParser().parseFromString(html, "text/html");
    const projectPath = document.querySelector(
      'a[href="https://github.com/example-org/sample-app/blob/main/app/sample.ts#L42"]',
    );

    expect(projectPath?.classList.contains("text-primary")).toBe(true);
    expect(projectPath?.classList.contains("text-indigo-400")).toBe(false);
  });
});
