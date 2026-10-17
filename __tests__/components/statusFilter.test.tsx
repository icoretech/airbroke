import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";
import EnvironmentFilter from "@/app/projects/[project_id]/Filter";
import StatusFilter from "@/components/notice/StatusFilter";

vi.mock("next/navigation", () => ({
  usePathname: () => "/notices/sample-notice",
  useSearchParams: () =>
    new URLSearchParams("status=resolved&searchQuery=timeout"),
}));

afterEach(cleanup);

describe("StatusFilter", () => {
  test("makes the radio menu item itself the navigable status link", async () => {
    render(<StatusFilter />);
    fireEvent.click(screen.getByRole("button", { name: "Filter by status" }));
    const unresolved = await screen.findByRole("menuitemradio", {
      name: "Unresolved",
    });
    expect(unresolved.tagName).toBe("A");
    expect(unresolved.getAttribute("href")).toBe(
      "/notices/sample-notice?searchQuery=timeout",
    );
    expect(unresolved.querySelector("a")).toBeNull();
    expect(
      screen
        .getByRole("menuitemradio", { name: "Resolved" })
        .getAttribute("aria-checked"),
    ).toBe("true");
    expect(
      screen.getByRole("menuitemradio", { name: "All" }).getAttribute("href"),
    ).toBe("/notices/sample-notice?status=all&searchQuery=timeout");
    document.addEventListener("click", (event) => event.preventDefault(), {
      once: true,
    });
    fireEvent.click(unresolved);
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
  });
});

describe("EnvironmentFilter", () => {
  test("composes environment navigation into the radio item", async () => {
    render(<EnvironmentFilter environments={["production", "staging"]} />);
    fireEvent.click(
      screen.getByRole("button", { name: "Filter by environment" }),
    );
    const production = await screen.findByRole("menuitemradio", {
      name: "production",
    });
    expect(production.tagName).toBe("A");
    expect(production.getAttribute("href")).toBe(
      "/notices/sample-notice?status=resolved&searchQuery=timeout&filterByEnv=production",
    );
    expect(
      screen.getByRole("menuitemradio", { name: "All environments" }).tagName,
    ).toBe("A");
    document.addEventListener("click", (event) => event.preventDefault(), {
      once: true,
    });
    fireEvent.click(production);
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
  });
});
