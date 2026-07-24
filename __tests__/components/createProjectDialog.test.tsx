import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import CreateProjectDialog from "@/components/project/CreateProjectDialog";

const { createProjectMock } = vi.hoisted(() => ({
  createProjectMock: vi.fn(),
}));

vi.mock("@/lib/actions/projectActions", () => ({
  createProject: createProjectMock,
}));

describe("CreateProjectDialog", () => {
  beforeEach(() => {
    createProjectMock.mockImplementation(
      async (_previousState: unknown, formData: FormData) => ({
        error: "Invalid repository URL format.",
        lastUrl: String(formData.get("repository_url") ?? ""),
      }),
    );
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  test("keeps a rejected repository URL without changing an uncontrolled default", async () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);

    render(<CreateProjectDialog />);

    fireEvent.click(screen.getByRole("button", { name: "Create Project" }));
    const repositoryUrl = await screen.findByRole<HTMLInputElement>("textbox", {
      name: "Repository URL",
    });
    expect(repositoryUrl.closest('[data-slot="field"]')).not.toBeNull();
    expect(repositoryUrl.closest('[data-slot="field-group"]')).not.toBeNull();

    fireEvent.change(repositoryUrl, {
      target: { value: "https://invalid.example/repository" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Create" }));

    expect((await screen.findByRole("alert")).textContent).toBe(
      "Invalid repository URL format.",
    );
    expect(repositoryUrl.value).toBe("https://invalid.example/repository");

    const fieldControlWarnings = consoleError.mock.calls.filter((call) =>
      call.some(
        (argument) =>
          typeof argument === "string" &&
          argument.includes(
            "changing the default value state of an uncontrolled FieldControl",
          ),
      ),
    );

    expect(fieldControlWarnings).toEqual([]);
  });
});
