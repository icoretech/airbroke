export const HOURLY_OCCURRENCE_BUCKETS = 14 * 24;
export const HOUR_IN_MS = 60 * 60 * 1000;

// The half-open window contains 335 completed UTC hours plus the current hour.
export function getHourlyOccurrenceWindow(now = new Date()) {
  const currentHour = Math.floor(now.getTime() / HOUR_IN_MS) * HOUR_IN_MS;
  return {
    startDate: new Date(
      currentHour - (HOURLY_OCCURRENCE_BUCKETS - 1) * HOUR_IN_MS,
    ),
    endDate: new Date(currentHour + HOUR_IN_MS),
  };
}
