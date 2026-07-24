import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

vi.mock("@/lib/actions/projectActions", () => ({
  deleteProject: vi.fn(),
  deleteProjectNotices: vi.fn(),
}));

import DangerActions from "@/components/project/cards/DangerActions";

describe("DangerActions", () => {
  afterEach(() => cleanup());

  test("uses filled semantic destructive triggers with readable labels", () => {
    render(
      <DangerActions projectId="project-1" projectName="Sample project" />,
    );

    for (const name of ["Delete All Errors", "Delete Project"]) {
      const trigger = screen.getByRole("button", { name });
      expect(trigger.classList.contains("bg-destructive-surface")).toBe(true);
      expect(trigger.classList.contains("text-destructive-foreground")).toBe(
        true,
      );
    }
  });

  test("uses semantic muted color for the irreversible-action hint", () => {
    render(
      <DangerActions projectId="project-1" projectName="Sample project" />,
    );

    const hint = screen.getByText(
      "Irreversible operations. Proceed with caution.",
    );

    expect(hint.classList.contains("text-muted-foreground")).toBe(true);
    expect(hint.classList.contains("text-white/70")).toBe(false);
  });
});
