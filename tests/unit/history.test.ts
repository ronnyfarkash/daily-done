import { describe, expect, it } from 'vitest';
import { getRecentCompletions } from '../../src/lib/history';
import type { CompletionRecord } from '../../src/lib/types';

function record(localDate: string): CompletionRecord {
  return {
    localDate,
    taskNameAtCompletion: `Task ${localDate}`,
    proofNote: 'Completed history item',
    completedAt: `${localDate}T10:00:00.000Z`,
  };
}

describe('history helpers', () => {
  it('sorts completions newest first and limits to seven by default', () => {
    const completions = [
      record('2026-07-01'),
      record('2026-07-08'),
      record('2026-07-03'),
      record('2026-07-04'),
      record('2026-07-02'),
      record('2026-07-05'),
      record('2026-07-06'),
      record('2026-07-07'),
    ];

    expect(getRecentCompletions(completions).map((item) => item.localDate)).toEqual([
      '2026-07-08',
      '2026-07-07',
      '2026-07-06',
      '2026-07-05',
      '2026-07-04',
      '2026-07-03',
      '2026-07-02',
    ]);
  });
});
