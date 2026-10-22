import { act, cleanup, render } from "@testing-library/react";
import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from "vitest";
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
  beforeAll(async () => {
    // Load the real dependency before mounting Next's dynamic chart exports.
    await import("recharts");
  });

  beforeEach(() => {
    // Vitest retains Node's performance clock, while jsdom's RAF timestamp is
    // relative to its window. Recharts needs both to share the same origin.
    vi.useFakeTimers({
      toFake: [
        "performance",
        "requestAnimationFrame",
        "cancelAnimationFrame",
        "setTimeout",
        "clearTimeout",
      ],
    });
  });

  test("uses the same clock origin for RAF and animation timing", async () => {
    const requestedAt = performance.now();
    const frame = new Promise<number>((resolve) =>
      requestAnimationFrame(resolve),
    );
    vi.advanceTimersToNextFrame();
    const frameTime = await frame;
    expect(frameTime).toBeGreaterThanOrEqual(requestedAt);
    expect(frameTime).toBe(performance.now());
  });

  afterEach(async () => {
    cleanup();
    // Unmounting queues Redux batches with RAF and fallback timers. Finish
    // both while the browser globals and their shared clock still exist.
    await vi.runAllTimersAsync();
    const pendingTimers = vi.getTimerCount();
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    expect(pendingTimers).toBe(0);
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
      // Only DOM measurement and the browser clock are supplied. Chart
      // primitives, Next dynamic imports, paths, and animations remain real.
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
        await vi.dynamicImportSettled();
      });

      await act(async () => {
        await vi.runAllTimersAsync();
      });
      expect(container.querySelector("svg")?.getAttribute("width")).toBe(
        String(measuredWidth),
      );
      act(() => {
        measuredWidth = width;
        MeasuredResizeObserver.resize();
      });

      await act(async () => {
        await vi.runAllTimersAsync();
      });
      const bars = container.querySelectorAll(".recharts-bar-rectangle path");
      expect(bars).toHaveLength(chartData.length);
      for (const bar of bars) {
        expect(Number(bar.getAttribute("width"))).toBeGreaterThan(0);
        expect(Number(bar.getAttribute("height"))).toBeGreaterThan(0);
        expect(bar.getAttribute("d")).toBeTruthy();
        expect(bar.getAttribute("d")).not.toContain("NaN");
        expect(bar.getAttribute("fill")).toBe("hsl(var(--chart-1))");
      }
      expect(container.querySelector("svg")?.getAttribute("width")).toBe(
        String(width),
      );
    },
  );
});
