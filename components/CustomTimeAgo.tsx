// components/CustomTimeAgo.tsx

'use client';

import { formatDistanceToNowStrict } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';

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
  refreshIntervalSec = 1,
}: CustomTimeAgoProps) {
  // Memoize the passed date so we don’t cause
  // re-renders if the parent re-creates the Date object
  const memoDate = useMemo(() => date, [date]);

  // Convert from seconds to milliseconds
  const refreshIntervalMs = refreshIntervalSec * 1000;

  // Initialize state with the current distance
  const [timeAgo, setTimeAgo] = useState(() => formatDistanceToNowStrict(memoDate, { addSuffix }));

  useEffect(() => {
    // If live is false, don't auto-update
    if (!live) return;

    const interval = setInterval(() => {
      setTimeAgo(formatDistanceToNowStrict(memoDate, { addSuffix }));
    }, refreshIntervalMs);

    return () => clearInterval(interval);
  }, [addSuffix, live, memoDate, refreshIntervalMs]);

  return <time dateTime={memoDate.toISOString()}>{timeAgo}</time>;
}
