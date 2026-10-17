import { act, cleanup, render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";
import OccurrenceChart from "@/components/common/OccurrenceChart";

class MeasuredResizeObserver implements ResizeObserver {
  static readonly instances = new Set<MeasuredResizeObserver>();
  readonly targets = new Set<Element>();
  readonly callback: ResizeObserverCallback;

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
    MeasuredResizeObserver.instances.add(this);
  }

  observe(target: Element) {
    this.targets.add(target);
    queueMicrotask(() => {
      if (this.targets.has(target)) this.notify();
    });
  }

  unobserve(target: Element) {
    this.targets.delete(target);
  }

  disconnect() {
    this.targets.clear();
    MeasuredResizeObserver.instances.delete(this);
  }

  notify() {
    const entries = [...this.targets].map((target) => {
      const contentRect = target.getBoundingClientRect();
      const size = {
        inlineSize: contentRect.width,
        blockSize: contentRect.height,
      };
      return {
        target,
        contentRect,
        contentBoxSize: [size],
        borderBoxSize: [size],
        devicePixelContentBoxSize: [size],
      };
    });
    if (entries.length > 0) this.callback(entries, this);
  }

  static resize() {
    for (const observer of MeasuredResizeObserver.instances) observer.notify();
  }
}

const chartData = [1, 4, 2, 8].map((count, index) => ({
  date: Date.UTC(2026, 0, 1, index),
  count,
}));

describe("OccurrenceChart real Recharts rendering", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  test.each([
    { width: 375, compact: false },
    { width: 768, compact: false },
    { width: 1280, compact: false },
    { width: 375, compact: true },
    { width: 768, compact: true },
    { width: 1280, compact: true },
  ])(
    "resizes real bars to width $width, compact $compact",
    async ({ width, compact }) => {
      const height = compact ? 180 : 220;
      // jsdom has no layout engine. Only measurement is supplied; all chart
      // primitives, dynamic imports, paths, and paint attributes remain real.
      vi.stubGlobal("ResizeObserver", MeasuredResizeObserver);
      let measuredWidth = width - 100;
      vi.spyOn(
        HTMLElement.prototype,
        "getBoundingClientRect",
      ).mockImplementation(() => new DOMRect(0, 0, measuredWidth, height));
      const container = document.createElement("div");
      document.body.append(container);
      await act(async () => {
        render(<OccurrenceChart chartData={chartData} compact={compact} />, {
          container,
        });
      });

      await waitFor(() =>
        expect(container.querySelector("svg")?.getAttribute("width")).toBe(
          String(measuredWidth),
        ),
      );
      act(() => {
        measuredWidth = width;
        MeasuredResizeObserver.resize();
      });

      await waitFor(
        () => {
          expect(container.querySelector("svg")?.getAttribute("width")).toBe(
            String(width),
          );
          const bars = container.querySelectorAll(
            ".recharts-bar-rectangle path",
          );
          expect(bars).toHaveLength(chartData.length);
          for (const bar of bars) {
            expect(Number(bar.getAttribute("width"))).toBeGreaterThan(0);
            expect(Number(bar.getAttribute("height"))).toBeGreaterThan(0);
            expect(bar.getAttribute("d")).toBeTruthy();
            expect(bar.getAttribute("d")).not.toContain("NaN");
            expect(bar.getAttribute("fill")).toBe("hsl(var(--chart-1))");
          }
        },
        { timeout: 5000 },
      );
      expect(container.querySelector("svg")?.getAttribute("width")).toBe(
        String(width),
      );
    },
  );
});
