import { useState, useEffect } from 'react';

/**
 * A hook that provides the current Date and time, updating at a set interval.
 * Default interval is 1000ms (1 second).
 */
export function useCurrentTime(refreshInterval: number = 1000) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, refreshInterval);

    return () => clearInterval(timer);
  }, [refreshInterval]);

  return time;
}
