// @vitest-environment node

import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

const getOccurrenceChartOccurrencesDataMock = vi.fn();

vi.mock("@/lib/queries/occurrenceChartOccurrences", () => ({
  getOccurrenceChartOccurrencesData: getOccurrenceChartOccurrencesDataMock,
}));

vi.mock("@/components/common/OccurrenceChart", () => ({
  default: ({
    chartData,
    gradientId,
  }: {
    chartData: Array<{ date: number; count: number }>;
    gradientId?: string;
  }) => <div data-gradient-id={gradientId}>{JSON.stringify(chartData)}</div>,
}));

const { default: OccurrenceChartWrapper } = await import(
  "@/components/occurrence/OccurrenceChartWrapper"
);

describe("OccurrenceChartWrapper", () => {
  it("passes a stable gradient id to the chart", async () => {
    getOccurrenceChartOccurrencesDataMock.mockResolvedValue([
      { date: 1742493600000, count: 3 },
    ]);

    const element = await OccurrenceChartWrapper({
      occurrenceId: "occ-123",
    });
    const html = renderToStaticMarkup(element);

    expect(getOccurrenceChartOccurrencesDataMock).toHaveBeenCalledWith(
      "occ-123",
    );
    expect(html).toContain('data-gradient-id="occurrence-chart-occ-123"');
    expect(html).toContain("&quot;count&quot;:3");
  });
});
