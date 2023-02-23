import { Duration } from 'src/shared/enums';

export function resolveDuration(
  duration: Duration,
  from: string,
  to: string
): {
  from: string;
  to: string;
} {
  const toDate = duration === Duration.CUSTOM ? new Date(to) : new Date();
  const fromDate = duration === Duration.CUSTOM ? new Date(from) : new Date();

  switch (duration) {
    case Duration.LAST_WEEK:
      fromDate.setDate(fromDate.getDate() - 7);
      break;
    case Duration.LAST_MONTH:
      fromDate.setDate(fromDate.getDate() - 30);
      break;
    case Duration.LAST_90_DAYS:
      fromDate.setDate(fromDate.getDate() - 90);
      break;
  }

  return {
    from: getFormattedDate(fromDate),
    to: getFormattedDate(toDate),
  };
}

// returns in YYYY-MM-DD format
function getFormattedDate(date: Date): string {
  return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
}
