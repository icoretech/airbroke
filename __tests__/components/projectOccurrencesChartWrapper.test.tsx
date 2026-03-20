// @vitest-environment node

import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

const cachedProjectChartOccurrencesDataMock = vi.fn();

vi.mock("@/lib/actions/projectActions", () => ({
  cachedProjectChartOccurrencesData: cachedProjectChartOccurrencesDataMock,
}));

vi.mock("@/components/OccurrenceChart", () => ({
  default: ({
    chartData,
    compact,
    gradientId,
  }: {
    chartData: Array<{ date: number; count: number }>;
    compact?: boolean;
    gradientId?: string;
  }) => (
    <div
      data-compact={compact ? "true" : "false"}
      data-gradient-id={gradientId}
    >
      {JSON.stringify(chartData)}
    </div>
  ),
}));

const { default: OccurrencesChartWrapper } = await import(
  "@/components/project/OccurrencesChartWrapper"
);

describe("OccurrencesChartWrapper", () => {
  it("uses the shared cached project activity query", async () => {
    cachedProjectChartOccurrencesDataMock.mockResolvedValue([
      { date: 1742493600000, count: 3 },
    ]);

    const element = await OccurrencesChartWrapper({
      projectId: "project-123",
      compact: true,
    });
    const html = renderToStaticMarkup(element);

    expect(cachedProjectChartOccurrencesDataMock).toHaveBeenCalledWith(
      "project-123",
    );
    expect(html).toContain('data-compact="true"');
    expect(html).toContain(
      'data-gradient-id="project-chart-project-123-compact"',
    );
    expect(html).toContain("&quot;count&quot;:3");
  });
});
