import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import EnvironmentFilter from "@/app/projects/[project_id]/Filter";
import SortDropdown from "@/components/common/SortDropdown";
import { NavUser } from "@/components/layout/NavUser";
import StatusFilter from "@/components/notice/StatusFilter";
import { SidebarProvider } from "@/components/ui/sidebar";

describe("labelled dropdown menus", () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  test("opens the status filter without losing its group label", () => {
    render(<StatusFilter />);

    fireEvent.click(screen.getByRole("button", { name: "Filter by status" }));

    expect(screen.getByText("Filter by status")).not.toBeNull();
  });

  test("opens the environment filter without losing its group label", () => {
    render(<EnvironmentFilter environments={["production"]} />);

    fireEvent.click(
      screen.getByRole("button", { name: "Filter by environment" }),
    );

    expect(screen.getByText("Filter by environment")).not.toBeNull();
  });

  test("opens the sort menu without losing its group label", () => {
    render(
      <SortDropdown
        ariaLabel="Sort notices"
        attributes={["updated_at", "count"]}
        defaultAttr="updated_at"
        defaultDir="desc"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Sort notices" }));

    expect(screen.getByText("Sort by")).not.toBeNull();
  });

  test("renders sort choices as the radio item links", () => {
    render(
      <SortDropdown
        ariaLabel="Sort notices"
        attributes={["updated_at", "count"]}
        defaultAttr="updated_at"
        defaultDir="desc"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Sort notices" }));

    expect(
      screen.getByRole("menuitemradio", { name: /updated at/i }).tagName,
    ).toBe("A");
  });

  test("opens the user menu without losing its account label", () => {
    render(
      <SidebarProvider>
        <NavUser user={{ name: "Sample User", email: "user@example.com" }} />
      </SidebarProvider>,
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /Sample User.*user@example\.com/,
      }),
    );

    expect(screen.getAllByText("Sample User")).toHaveLength(2);
  });
});
