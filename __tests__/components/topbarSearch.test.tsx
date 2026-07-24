import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import TopbarSearch from "@/components/layout/TopbarSearch";

const { pushMock, routeState } = vi.hoisted(() => ({
  pushMock: vi.fn(),
  routeState: {
    pathname: "/projects/project-1",
    searchParams: new URLSearchParams(),
  },
}));

vi.mock("next/navigation", () => ({
  usePathname: () => routeState.pathname,
  useRouter: () => ({ push: pushMock }),
  useSearchParams: () => routeState.searchParams,
}));

describe("TopbarSearch", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    pushMock.mockReset();
    routeState.pathname = "/projects/project-1";
    routeState.searchParams = new URLSearchParams();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  test("preserves continued typing when an earlier search navigation completes", () => {
    const { rerender } = render(<TopbarSearch placeholder="Search notices" />);
    const input = screen.getByRole("searchbox", { name: "" });

    fireEvent.change(input, { target: { value: "alpha" } });
    vi.advanceTimersByTime(400);
    fireEvent.change(input, { target: { value: "alphabet" } });

    routeState.searchParams = new URLSearchParams({ searchQuery: "alpha" });
    rerender(<TopbarSearch placeholder="Search notices" />);

    expect(screen.getByRole<HTMLInputElement>("searchbox").value).toBe(
      "alphabet",
    );
    expect(screen.getByRole("searchbox").hasAttribute("disabled")).toBe(false);
    expect(console.error).not.toHaveBeenCalled();
  });
});
