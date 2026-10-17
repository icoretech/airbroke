// @vitest-environment node

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { db } from "@/lib/db";
import { getOccurrenceChartOccurrencesData } from "@/lib/queries/occurrenceChartOccurrences";
import { getHourlyOccurrenceRateForLast14Days } from "@/lib/queries/occurrences";
import { cachedProjectChartOccurrencesData } from "@/lib/queries/projectChartOccurrences";
import {
  createNotice,
  createOccurrence,
  createProject,
} from "../factories/prismaFactories";

vi.mock("next/cache", () => ({ cacheLife: vi.fn(), cacheTag: vi.fn() }));

const projectIds: string[] = [];
const now = new Date("2026-10-17T21:52:55.000Z");
const currentHour = Date.UTC(2026, 9, 17, 21);
const oldestHour = Date.UTC(2026, 9, 3, 22);
const hour = 60 * 60 * 1000;

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(now);
});

afterEach(async () => {
  vi.useRealTimers();
  await db.project.deleteMany({ where: { id: { in: projectIds.splice(0) } } });
});

describe("hourly chart query boundaries with PostgreSQL", () => {
  it("includes the current hour and oldest bucket, excludes older/future buckets, and preserves project sums", async () => {
    const project = await createProject();
    projectIds.push(project.id);
    const notice = await createNotice(project.id);
    const occurrence = await createOccurrence(notice.id, { updated_at: now });
    const otherOccurrence = await createOccurrence(notice.id, {
      updated_at: now,
    });
    // Keep the actual trigger-created current-hour rows and give them known
    // counts; additional fixtures exercise exact hourly window boundaries.
    await db.hourlyOccurrence.updateMany({
      where: { occurrence_id: occurrence.id },
      data: { count: BigInt(4) },
    });
    await db.hourlyOccurrence.updateMany({
      where: { occurrence_id: otherOccurrence.id },
      data: { count: BigInt(336) },
    });
    await db.hourlyOccurrence.createMany({
      data: [
        {
          occurrence_id: occurrence.id,
          interval_start: new Date(oldestHour),
          interval_end: new Date(oldestHour + hour),
          count: BigInt(332),
        },
        {
          occurrence_id: occurrence.id,
          interval_start: new Date(oldestHour - hour),
          interval_end: new Date(oldestHour),
          count: BigInt(10000),
        },
        {
          occurrence_id: occurrence.id,
          interval_start: new Date(currentHour + hour),
          interval_end: new Date(currentHour + 2 * hour),
          count: BigInt(10000),
        },
      ],
    });

    const occurrenceData = await getOccurrenceChartOccurrencesData(
      occurrence.id,
    );
    const projectData = await cachedProjectChartOccurrencesData(project.id);
    const rate = await getHourlyOccurrenceRateForLast14Days(project.id);

    expect(occurrenceData).toHaveLength(336);
    expect(occurrenceData[0]).toEqual({ date: oldestHour, count: 332 });
    expect(occurrenceData.at(-1)).toEqual({ date: currentHour, count: 4 });
    expect(
      occurrenceData.reduce((total, point) => total + point.count, 0),
    ).toBe(336);
    expect(projectData).toHaveLength(336);
    expect(projectData[0]).toEqual({ date: oldestHour, count: 332 });
    expect(projectData.at(-1)).toEqual({ date: currentHour, count: 340 });
    expect(projectData.reduce((total, point) => total + point.count, 0)).toBe(
      672,
    );
    expect(rate).toBe(2);
    expect(projectData.map((point) => point.date)).toEqual(
      occurrenceData.map((point) => point.date),
    );
  });
});
