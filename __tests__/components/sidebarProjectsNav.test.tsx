import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import {
  SIDEBAR_GROUPS_STORAGE_KEY,
  SIDEBAR_SCROLL_STORAGE_KEY,
  SidebarProjectsNav,
} from "@/components/SidebarProjectsNav";
import { Sidebar, SidebarProvider } from "@/components/ui/sidebar";
import type { SidebarProjectsGroup } from "@/components/SidebarProjectsNav";

const groupedProjects: SidebarProjectsGroup[] = [
  {
    organization: "Alpha",
    projects: [
      {
        id: "project-alpha-1",
        name: "Project One",
        paused: false,
        repoProvider: "github",
        noticesCount: "3",
      },
    ],
  },
  {
    organization: "Beta",
    projects: [
      {
        id: "project-beta-1",
        name: "Project Two",
        paused: false,
        repoProvider: "github",
        noticesCount: "0",
      },
    ],
  },
];

describe("SidebarProjectsNav", () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    window.sessionStorage.clear();
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

  function renderSidebarProjectsNav() {
    return render(
      <SidebarProvider>
        <Sidebar collapsible="none">
          <SidebarProjectsNav groupedProjects={groupedProjects} />
        </Sidebar>
      </SidebarProvider>,
    );
  }

  test("restores open/closed organization groups from sessionStorage", async () => {
    window.sessionStorage.setItem(
      SIDEBAR_GROUPS_STORAGE_KEY,
      JSON.stringify({ Alpha: false, Beta: true }),
    );

    renderSidebarProjectsNav();

    const alphaTrigger = screen.getByRole("button", { name: "Alpha" });
    const alphaRoot = alphaTrigger.closest("[data-state]");
    await waitFor(() => {
      expect(alphaRoot?.getAttribute("data-state")).toBe("closed");
    });

    fireEvent.click(alphaTrigger);

    await waitFor(() => {
      expect(alphaRoot?.getAttribute("data-state")).toBe("open");
    });

    await waitFor(() => {
      const saved = JSON.parse(
        window.sessionStorage.getItem(SIDEBAR_GROUPS_STORAGE_KEY) ?? "{}",
      ) as Record<string, boolean>;
      expect(saved.Alpha).toBe(true);
    });
  });

  test("restores and persists sidebar scroll position", async () => {
    window.sessionStorage.setItem(SIDEBAR_SCROLL_STORAGE_KEY, "160");

    const { unmount } = render(
      <SidebarProvider>
        <Sidebar collapsible="none">
          <SidebarProjectsNav groupedProjects={groupedProjects} />
        </Sidebar>
      </SidebarProvider>,
    );

    const sidebarContent = document.querySelector<HTMLDivElement>(
      '[data-sidebar="content"]',
    );
    expect(sidebarContent).not.toBeNull();

    await waitFor(() => {
      expect(sidebarContent?.scrollTop).toBe(160);
    });

    if (!sidebarContent) {
      throw new Error("Sidebar content element not found.");
    }

    sidebarContent.scrollTop = 245;
    fireEvent.scroll(sidebarContent);
    expect(window.sessionStorage.getItem(SIDEBAR_SCROLL_STORAGE_KEY)).toBe(
      "245",
    );

    unmount();
    renderSidebarProjectsNav();

    const remountedSidebarContent = document.querySelector<HTMLDivElement>(
      '[data-sidebar="content"]',
    );
    expect(remountedSidebarContent).not.toBeNull();

    await waitFor(() => {
      expect(remountedSidebarContent?.scrollTop).toBe(245);
    });
  });

  test("keeps stored scroll when a navigation click is in progress", async () => {
    renderSidebarProjectsNav();

    const sidebarContent = document.querySelector<HTMLDivElement>(
      '[data-sidebar="content"]',
    );
    expect(sidebarContent).not.toBeNull();

    if (!sidebarContent) {
      throw new Error("Sidebar content element not found.");
    }

    sidebarContent.scrollTop = 220;
    fireEvent.scroll(sidebarContent);
    expect(window.sessionStorage.getItem(SIDEBAR_SCROLL_STORAGE_KEY)).toBe(
      "220",
    );

    const projectLink = screen.getByRole("link", { name: /Project One/i });
    fireEvent.pointerDown(projectLink);

    sidebarContent.scrollTop = 0;
    fireEvent.scroll(sidebarContent);
    expect(window.sessionStorage.getItem(SIDEBAR_SCROLL_STORAGE_KEY)).toBe(
      "220",
    );
  });
});
