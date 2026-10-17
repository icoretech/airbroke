// @vitest-environment node

import { afterEach, describe, expect, it, vi } from "vitest";
import {
  getHourlyOccurrenceWindow,
  HOUR_IN_MS,
  HOURLY_OCCURRENCE_BUCKETS,
} from "@/lib/queries/hourlyOccurrenceWindow";
import { buildOccurrenceChartOccurrencesData } from "@/lib/queries/occurrenceChartOccurrences";

afterEach(() => vi.unstubAllEnvs());

describe("hourly occurrence UTC window", () => {
  it.each([
    {
      now: "2026-10-17T21:52:55.000Z",
      start: "2026-10-03T22:00:00.000Z",
      end: "2026-10-17T22:00:00.000Z",
    },
    {
      now: "2026-10-17T21:00:00.000Z",
      start: "2026-10-03T22:00:00.000Z",
      end: "2026-10-17T22:00:00.000Z",
    },
    {
      now: "2026-03-29T03:30:00+02:00",
      start: "2026-03-15T02:00:00.000Z",
      end: "2026-03-29T02:00:00.000Z",
    },
    {
      now: "2026-10-25T02:30:00+01:00",
      start: "2026-10-11T02:00:00.000Z",
      end: "2026-10-25T02:00:00.000Z",
    },
  ])(
    "includes the current hour with exact boundaries at $now",
    ({ now, start, end }) => {
      vi.stubEnv("TZ", "Europe/Rome");
      const window = getHourlyOccurrenceWindow(new Date(now));
      expect(window.startDate.toISOString()).toBe(start);
      expect(window.endDate.toISOString()).toBe(end);
      expect(window.endDate.getTime() - window.startDate.getTime()).toBe(
        HOURLY_OCCURRENCE_BUCKETS * HOUR_IN_MS,
      );
      const buckets = buildOccurrenceChartOccurrencesData([], window.startDate);
      expect(buckets).toHaveLength(336);
      expect(new Set(buckets.map((point) => point.date)).size).toBe(336);
      expect(buckets.at(-1)?.date).toBe(window.endDate.getTime() - HOUR_IN_MS);
      expect(
        buckets.every(
          (point, index) =>
            point.date === window.startDate.getTime() + index * HOUR_IN_MS,
        ),
      ).toBe(true);
    },
  );
});
