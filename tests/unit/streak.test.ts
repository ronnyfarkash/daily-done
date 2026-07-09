import { describe, expect, it } from 'vitest';
import { calculateCurrentStreak } from '../../src/lib/streak';
import type { CompletionRecord } from '../../src/lib/types';

function record(localDate: string): CompletionRecord {
  return {
    localDate,
    taskNameAtCompletion: 'Write',
    proofNote: 'Completed enough work',
    completedAt: `${localDate}T12:00:00.000Z`,
  };
}

describe('current streak', () => {
  it('counts backward from today when today is complete', () => {
    const streak = calculateCurrentStreak(
      [record('2026-07-08'), record('2026-07-07'), record('2026-07-06')],
      '2026-07-08',
    );

    expect(streak).toEqual({ count: 3, throughDate: '2026-07-08' });
  });

  it('counts backward from yesterday when today is incomplete', () => {
    const streak = calculateCurrentStreak(
      [record('2026-07-07'), record('2026-07-06')],
      '2026-07-08',
    );

    expect(streak).toEqual({ count: 2, throughDate: '2026-07-07' });
  });

  it('returns zero when neither today nor yesterday is complete', () => {
    const streak = calculateCurrentStreak([record('2026-07-05')], '2026-07-08');

    expect(streak).toEqual({ count: 0, throughDate: null });
  });
});
