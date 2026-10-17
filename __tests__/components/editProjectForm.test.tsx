import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";
import EditForm from "@/components/project/EditForm";
import type { Project } from "@/prisma/generated/client";

const { updateProjectMock } = vi.hoisted(() => ({
  updateProjectMock: vi.fn(async (_state: unknown, _formData: FormData) => ({
    errors: { name: ["Name is required"] },
  })),
}));

vi.mock("@/lib/actions/projectActions", () => ({
  updateProject: updateProjectMock,
}));

const project: Project = {
  id: "sample-project",
  name: "Sample app",
  organization: "Example org",
  api_key: "sample-key",
  repo_provider: "github",
  repo_provider_api_key: null,
  repo_provider_api_secret: null,
  repo_branch: "main",
  repo_issue_tracker: null,
  repo_url: null,
  notices_count: BigInt(0),
  paused: false,
  created_at: new Date(0),
  updated_at: new Date(0),
};

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("EditForm", () => {
  test("associates a rejected field with its validation error", async () => {
    render(<EditForm project={project} bare />);
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    const error = await screen.findByText("Name is required");
    const name = screen.getByRole("textbox", { name: "Name" });
    expect(
      Object.fromEntries(updateProjectMock.mock.calls[0]?.[1] ?? []),
    ).toEqual({
      projectId: project.id,
      organization: project.organization,
      name: project.name,
      repo_url: "",
      repo_branch: "main",
      repo_issue_tracker: "",
    });
    expect(error.textContent).toBe("Name is required");
    expect(name.getAttribute("aria-invalid")).toBe("true");
    expect(
      document.getElementById(name.getAttribute("aria-describedby") ?? ""),
    ).toBe(error);
    expect(
      screen
        .getByRole("textbox", { name: "Organization" })
        .getAttribute("aria-invalid"),
    ).toBe("false");
  });
});
