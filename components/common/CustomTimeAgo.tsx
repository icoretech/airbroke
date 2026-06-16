// components/CustomTimeAgo.tsx

"use client";

import { formatDistanceToNowStrict } from "date-fns";
import { useEffect, useState } from "react";

interface CustomTimeAgoProps {
  date: Date;
  addSuffix?: boolean;
  /**
   * Whether the time should update automatically
   * (defaults to true).
   */
  live?: boolean;
  /**
   * The refresh interval in seconds.
   * Defaults to 60 seconds (one minute).
   */
  refreshIntervalSec?: number;
}

export default function CustomTimeAgo({
  date,
  addSuffix = true,
  live = true,
  refreshIntervalSec = 60,
}: CustomTimeAgoProps) {
  const [, setTick] = useState(0);
  const refreshIntervalMs = refreshIntervalSec * 1000;

  useEffect(() => {
    if (!live) return;

    const interval = setInterval(() => {
      setTick((current) => current + 1);
    }, refreshIntervalMs);

    return () => clearInterval(interval);
  }, [live, refreshIntervalMs]);

  const timeAgo = formatDistanceToNowStrict(date, { addSuffix });

  return (
    <time dateTime={date.toISOString()} suppressHydrationWarning>
      {timeAgo}
    </time>
  );
}
