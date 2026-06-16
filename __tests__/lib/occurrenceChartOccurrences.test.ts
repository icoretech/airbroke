// @vitest-environment node

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  buildOccurrenceChartOccurrencesData,
  getOccurrenceChartOccurrencesData,
} from "@/lib/queries/occurrenceChartOccurrences";

const { findManyMock } = vi.hoisted(() => ({
  findManyMock: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  db: {
    hourlyOccurrence: {
      findMany: findManyMock,
    },
  },
}));

describe("occurrence chart occurrence queries", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-03-20T12:34:56.789Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it("queries the last 14 days for one occurrence and zero-fills hourly data", async () => {
    findManyMock.mockResolvedValue([
      {
        interval_start: new Date("2025-03-06T13:00:00.000Z"),
        count: BigInt(5),
      },
      {
        interval_start: new Date("2025-03-20T11:00:00.000Z"),
        count: BigInt(2),
      },
    ]);

    const chartData = await getOccurrenceChartOccurrencesData("occ-123");

    expect(findManyMock).toHaveBeenCalledWith({
      where: {
        occurrence_id: "occ-123",
        interval_start: {
          gte: new Date("2025-03-06T12:34:56.789Z"),
        },
        interval_end: {
          lte: new Date("2025-03-20T12:34:56.789Z"),
        },
      },
      orderBy: {
        interval_start: "asc",
      },
      select: {
        interval_start: true,
        count: true,
      },
    });
    expect(chartData).toHaveLength(336);
    expect(chartData[0]).toEqual({
      date: Date.UTC(2025, 2, 6, 12),
      count: 0,
    });
    expect(chartData[1]).toEqual({
      date: Date.UTC(2025, 2, 6, 13),
      count: 5,
    });
    expect(chartData.at(-1)).toEqual({
      date: Date.UTC(2025, 2, 20, 11),
      count: 2,
    });
  });

  it("builds chart data from date strings as well as Date instances", () => {
    const chartData = buildOccurrenceChartOccurrencesData(
      [
        {
          interval_start: "2025-03-06T12:00:00.000Z",
          count: 3,
        },
      ],
      new Date("2025-03-06T12:34:56.789Z"),
    );

    expect(chartData[0]).toEqual({
      date: Date.UTC(2025, 2, 6, 12),
      count: 3,
    });
  });
});
