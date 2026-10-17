import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, describe, expect, test } from "vitest";
import IntegrationsGrid from "@/components/project/IntegrationsGrid";

afterEach(cleanup);

describe("IntegrationsGrid", () => {
  test("keeps exactly one provider selected and updates its SDK instructions", async () => {
    render(<IntegrationsGrid replacements={{}} />);
    const airbrake = screen.getByRole("button", { name: "Airbrake SDKs" });
    const sentry = screen.getByRole("button", { name: "Sentry SDKs" });
    expect(airbrake.getAttribute("aria-pressed")).toBe("true");
    fireEvent.click(sentry);
    expect(sentry.getAttribute("aria-pressed")).toBe("true");
    expect(airbrake.getAttribute("aria-pressed")).toBe("false");
    expect(screen.getByText(/Sentry-compatible envelope intake/)).toBeTruthy();
    fireEvent.click(sentry);
    expect(sentry.getAttribute("aria-pressed")).toBe("true");
  });

  test("opens a labelled snippet and restores focus to the originating trigger", async () => {
    render(<IntegrationsGrid replacements={{}} />);
    const trigger = screen.getByRole("button", { name: /Ruby \/ Rails/ });
    trigger.focus();
    fireEvent.click(trigger);
    const dialog = await screen.findByRole("dialog", { name: "Ruby / Rails" });
    expect(dialog.getAttribute("aria-describedby")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Copy code" })).toBeTruthy();
    fireEvent.keyDown(dialog, { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    await waitFor(() => expect(document.activeElement).toBe(trigger));
  });
});
