import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test, vi } from "vitest";
import type { Project } from "@/prisma/generated/client";

vi.mock("@/components/project/cards/ToggleIntake", () => ({
  default: () => <div>Intake control</div>,
}));
vi.mock("@/components/project/cards/DangerActions", () => ({
  default: () => <div>Danger actions</div>,
}));

import DangerZone from "@/components/project/cards/DangerZone";

const project: Project = {
  id: "project-1",
  name: "Sample project",
  api_key: "project-key",
  organization: "example-org",
  repo_provider: "github",
  repo_provider_api_key: null,
  repo_provider_api_secret: null,
  repo_branch: "main",
  repo_issue_tracker: null,
  repo_url: null,
  notices_count: BigInt(0),
  paused: false,
  created_at: new Date("2026-01-01T00:00:00.000Z"),
  updated_at: new Date("2026-01-01T00:00:00.000Z"),
};

describe("DangerZone", () => {
  test("stacks the intake control below its copy on mobile", async () => {
    const html = renderToStaticMarkup(await DangerZone({ project }));
    const document = new DOMParser().parseFromString(html, "text/html");
    const intakeTitle = [
      ...document.querySelectorAll("[data-slot=item-title]"),
    ].find((title) => title.textContent === "Intake");
    const intakeItem = intakeTitle?.closest("[data-slot=item]");
    const section = document.querySelector("section");
    const heading = document.querySelector("h2");

    expect(intakeItem?.classList.contains("flex-col")).toBe(true);
    expect(intakeItem?.classList.contains("items-stretch")).toBe(true);
    expect(intakeItem?.classList.contains("sm:flex-row")).toBe(true);
    expect(intakeItem?.classList.contains("sm:items-center")).toBe(true);
    expect(section?.classList.contains("border-destructive/50")).toBe(true);
    expect(heading?.classList.contains("text-destructive")).toBe(true);
    expect(heading?.classList.contains("text-rose-400")).toBe(false);
  });
});
