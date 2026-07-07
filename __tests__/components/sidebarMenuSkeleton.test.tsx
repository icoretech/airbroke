import { act } from "react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { describe, expect, test, vi } from "vitest";
import { SidebarMenuSkeleton } from "@/components/ui/sidebar";
import type { Root } from "react-dom/client";

describe("SidebarMenuSkeleton", () => {
  test("hydrates with a stable skeleton width", async () => {
    const random = vi
      .spyOn(Math, "random")
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0.99);
    const html = renderToString(<SidebarMenuSkeleton showIcon />);
    const container = document.createElement("div");
    container.innerHTML = html;

    const serverSkeleton = container.querySelector<HTMLElement>(
      '[data-sidebar="menu-skeleton-text"]',
    );
    const serverWidth =
      serverSkeleton?.style.getPropertyValue("--skeleton-width");

    expect(serverWidth).toMatch(/^[5-8][0-9]%$/);

    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    let root: Root | undefined;

    try {
      await act(async () => {
        root = hydrateRoot(container, <SidebarMenuSkeleton showIcon />);
      });

      const clientSkeleton = container.querySelector<HTMLElement>(
        '[data-sidebar="menu-skeleton-text"]',
      );
      const clientWidth =
        clientSkeleton?.style.getPropertyValue("--skeleton-width");
      const hydrationErrors = consoleError.mock.calls.filter((args) =>
        args.some(
          (arg) =>
            typeof arg === "string" &&
            /hydrat|server rendered HTML|didn't match/i.test(arg),
        ),
      );

      expect(clientWidth).toBe(serverWidth);
      expect(hydrationErrors).toEqual([]);
    } finally {
      await act(async () => {
        root?.unmount();
      });
      random.mockRestore();
      consoleError.mockRestore();
    }
  });
});
