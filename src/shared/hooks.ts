import { useEffect, useState } from 'react';
import { CustomFieldValues } from 'src/components/FilterBar/types';
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

export function useDeviations(sortBy: string, filterBy: string[], duration: Duration, customFieldValues: CustomFieldValues[]): number {

  const [deviations, setDeviations] = useState<number>(0);

  useEffect(() => {
    let devs = 0;
    if(duration !== Duration.LAST_WEEK) ++devs;
    if(sortBy !== '') ++devs;
    if(filterBy.length !== 0) ++devs;

    customFieldValues.forEach(customField => {
      if(customField.type === 'multi_select' && customField.value?.length !== 0) ++devs;
      else if(customField.type === 'text' && customField.value !== '') ++devs;
    })

    setDeviations(devs);
  }, [duration, sortBy, filterBy, customFieldValues]);

  return deviations;
}