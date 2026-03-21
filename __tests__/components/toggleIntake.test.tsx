import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { StrictMode } from "react";
import { beforeEach, describe, expect, test, vi } from "vitest";
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

vi.mock("@/app/_actions", () => ({
  toggleProjectPausedStatus: toggleProjectPausedStatusMock,
}));

describe("ToggleIntake", () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
});
