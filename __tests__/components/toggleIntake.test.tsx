import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { StrictMode } from "react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import ToggleIntake from "@/components/project/cards/ToggleIntake";

const { refreshMock, toggleProjectPausedStatusMock } = vi.hoisted(() => ({
  refreshMock: vi.fn(),
  toggleProjectPausedStatusMock: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: refreshMock,
  }),
}));

vi.mock("@/lib/actions/projectActions", () => ({
  toggleProjectPausedStatus: toggleProjectPausedStatusMock,
}));

describe("ToggleIntake", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  test("updates the switch immediately while the server action is pending", async () => {
    let resolveToggle: (() => void) | undefined;
    toggleProjectPausedStatusMock.mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          resolveToggle = resolve;
        }),
    );

    render(<ToggleIntake projectId="project-123" isPaused={true} />);

    const toggle = screen.getByRole("switch", { name: /accept data/i });

    expect(toggle.getAttribute("aria-checked")).toBe("false");
    expect(toggle.classList.contains("data-checked:bg-rose-600")).toBe(false);
    expect(toggle.classList.contains("data-unchecked:bg-gray-200")).toBe(false);

    fireEvent.click(toggle);

    expect(toggle.getAttribute("aria-checked")).toBe("true");

    resolveToggle?.();

    await waitFor(() => {
      expect(refreshMock).toHaveBeenCalledTimes(1);
    });
  });

  test("does not warn when the optimistic state matches refreshed props", async () => {
    toggleProjectPausedStatusMock.mockResolvedValue(undefined);
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);

    const { rerender } = render(
      <StrictMode>
        <ToggleIntake projectId="project-123" isPaused={true} />
      </StrictMode>,
    );

    const toggle = screen.getByRole("switch", { name: /accept data/i });

    fireEvent.click(toggle);

    rerender(
      <StrictMode>
        <ToggleIntake projectId="project-123" isPaused={false} />
      </StrictMode>,
    );

    await waitFor(() => {
      expect(refreshMock).toHaveBeenCalled();
    });

    expect(consoleErrorSpy).not.toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });

  test("rolls back and surfaces a local error when the mutation fails", async () => {
    toggleProjectPausedStatusMock.mockRejectedValue(new Error("denied"));
    vi.spyOn(console, "error").mockImplementation(() => undefined);

    render(<ToggleIntake projectId="project-123" isPaused={true} />);

    const toggle = screen.getByRole("switch", { name: /accept data/i });
    fireEvent.click(toggle);

    expect(toggle.getAttribute("aria-checked")).toBe("true");

    await screen.findByRole("alert");

    expect(screen.getByRole("alert").textContent).toBe(
      "Could not update intake status: denied",
    );
    expect(toggle.getAttribute("aria-checked")).toBe("false");
    expect(refreshMock).not.toHaveBeenCalled();
  });
});
