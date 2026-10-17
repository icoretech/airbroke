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
  }: {
    chartData: Array<{ date: number; count: number }>;
  }) => <div data-chart>{JSON.stringify(chartData)}</div>,
}));

const { default: OccurrenceChartWrapper } = await import(
  "@/components/occurrence/OccurrenceChartWrapper"
);

describe("OccurrenceChartWrapper", () => {
  it("explains an empty chart window instead of rendering empty axes", async () => {
    getOccurrenceChartOccurrencesDataMock.mockResolvedValue([
      { date: 1742493600000, count: 0 },
    ]);
    const html = renderToStaticMarkup(
      await OccurrenceChartWrapper({ occurrenceId: "occ-123" }),
    );
    expect(html).toContain("No recent occurrences");
    expect(html).toContain('data-slot="empty"');
    expect(html).not.toContain("data-chart");
  });

  it("passes the occurrence activity to the chart", async () => {
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
    expect(html).toContain("data-chart");
    expect(html).toContain("&quot;count&quot;:3");
  });
});
