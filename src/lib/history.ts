import { compareLocalDatesDesc } from './date';
import type { CompletionRecord } from './types';

export function getRecentCompletions(
  completions: CompletionRecord[],
  limit = 7,
): CompletionRecord[] {
  return [...completions]
    .sort((a, b) => compareLocalDatesDesc(a.localDate, b.localDate))
    .slice(0, limit);
}
