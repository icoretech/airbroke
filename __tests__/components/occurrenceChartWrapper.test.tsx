// @vitest-environment node

import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

const findManyMock = vi.fn();

vi.mock("@/lib/db", () => ({
  db: {
    hourlyOccurrence: {
      findMany: findManyMock,
    },
  },
}));

vi.mock("@/components/OccurrenceChart", () => ({
  default: ({
    chartData,
    gradientId,
  }: {
    chartData: Array<{ date: number; count: number }>;
    gradientId?: string;
  }) => <div data-gradient-id={gradientId}>{JSON.stringify(chartData)}</div>,
}));

const { default: OccurrenceChartWrapper } = await import(
  "@/components/OccurrenceChartWrapper"
);

describe("OccurrenceChartWrapper", () => {
  it("passes a stable gradient id to the chart", async () => {
    findManyMock.mockResolvedValue([]);

    const element = await OccurrenceChartWrapper({
      occurrenceId: "occ-123",
    });
    const html = renderToStaticMarkup(element);

    expect(findManyMock).toHaveBeenCalledTimes(1);
    expect(html).toContain('data-gradient-id="occurrence-chart-occ-123"');
  });
});
