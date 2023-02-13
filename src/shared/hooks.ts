import { useEffect, useState } from 'react';
import { Duration } from './enums';
import { resolveDuration } from './utils';

export function useDate(duration: Duration) {
  const { from, to } = resolveDuration(Duration.LAST_WEEK, '', '');

  const [toDate, setToDate] = useState<string>(to);
  const [fromDate, setFromDate] = useState<string>(from);

  useEffect(() => {
    const { from, to } = resolveDuration(duration, fromDate, toDate);
    setFromDate(from);
    setToDate(to);
  }, [duration]);

  return { fromDate, toDate, setFromDate, setToDate };
}
