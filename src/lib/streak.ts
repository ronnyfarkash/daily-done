import { addDays } from './date';
import type { CompletionRecord, CurrentStreak } from './types';

export function hasCompletionForDate(
  completions: CompletionRecord[],
  localDate: string,
): boolean {
  return completions.some((completion) => completion.localDate === localDate);
}

export function calculateCurrentStreak(
  completions: CompletionRecord[],
  todayLocalDate: string,
): CurrentStreak {
  const completedDates = new Set(completions.map((completion) => completion.localDate));
  const startDate = completedDates.has(todayLocalDate)
    ? todayLocalDate
    : addDays(todayLocalDate, -1);

  if (!completedDates.has(startDate)) {
    return { count: 0, throughDate: null };
  }

  let count = 0;
  let cursor = startDate;

  while (completedDates.has(cursor)) {
    count += 1;
    cursor = addDays(cursor, -1);
  }

  return { count, throughDate: startDate };
}
