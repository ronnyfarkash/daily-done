import { describe, expect, it } from 'vitest';
import { buildDayView, buildMonthView, buildWeekView, groupTasksByDate } from '../../src/lib/grouping';
import type { ScheduledTask } from '../../src/lib/types';

function task(id: string, scheduledDate: string, completed = false): ScheduledTask {
  return {
    id,
    title: `Task ${id}`,
    scheduledDate,
    createdAt: `2026-07-0${Math.min(Number(id.replace(/\D/g, '')) || 1, 9)}T08:00:00.000Z`,
    updatedAt: `2026-07-0${Math.min(Number(id.replace(/\D/g, '')) || 1, 9)}T08:00:00.000Z`,
    completedAt: completed ? `${scheduledDate}T09:00:00.000Z` : null,
    proofNote: completed ? `Proof note for ${id}` : null,
  };
}

describe('task grouping and view models', () => {
  it('groups tasks by scheduled local date', () => {
    const grouped = groupTasksByDate([
      task('a', '2026-07-09'),
      task('b', '2026-07-10'),
      task('c', '2026-07-09'),
    ]);

    expect(grouped.get('2026-07-09')?.map((item) => item.id)).toEqual(['a', 'c']);
    expect(grouped.get('2026-07-10')?.map((item) => item.id)).toEqual(['b']);
  });

  it('sorts a day by relevance and derives counts', () => {
    const view = buildDayView(
      [
        task('completed', '2026-07-09', true),
        task('planned', '2026-07-10'),
        task('missed', '2026-07-08'),
        task('due', '2026-07-09'),
      ],
      '2026-07-09',
      '2026-07-09',
    );

    expect(view.tasks.map((item) => item.task.id)).toEqual(['due', 'completed']);
    expect(view.totalCount).toBe(2);
    expect(view.completedCount).toBe(1);
    expect(view.dueTodayCount).toBe(1);
    expect(view.summaryLabel).toBe('1 of 2 completed');
  });

  it('builds weekly summaries with status counts', () => {
    const view = buildWeekView(
      [task('a', '2026-07-06'), task('b', '2026-07-09', true), task('c', '2026-07-12')],
      '2026-07-09',
      '2026-07-09',
    );

    expect(view.days).toHaveLength(7);
    expect(view.days.find((day) => day.date === '2026-07-09')?.completedCount).toBe(1);
    expect(view.days.find((day) => day.date === '2026-07-12')?.plannedCount).toBe(1);
  });

  it('builds month summaries with accessible status summaries', () => {
    const view = buildMonthView(
      [task('a', '2026-07-09'), task('b', '2026-07-09', true), task('c', '2026-07-10')],
      '2026-07-09',
      '2026-07-09',
    );
    const selected = view.days.find((day) => day.date === '2026-07-09');

    expect(view.monthKey).toBe('2026-07');
    expect(selected?.totalCount).toBe(2);
    expect(selected?.completedCount).toBe(1);
    expect(selected?.statusSummary).toContain('2 tasks');
    expect(selected?.statusSummary).toContain('1 completed');
  });
});
