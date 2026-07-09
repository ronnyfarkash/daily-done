import { describe, expect, it } from 'vitest';
import { buildMonthCalendar, buildWeekCalendar } from '../../src/lib/calendar';

describe('calendar generation', () => {
  it('builds a selected week from Monday through Sunday', () => {
    const week = buildWeekCalendar('2026-07-09', '2026-07-09');

    expect(week.startDate).toBe('2026-07-06');
    expect(week.endDate).toBe('2026-07-12');
    expect(week.days.map((day) => day.date)).toEqual([
      '2026-07-06',
      '2026-07-07',
      '2026-07-08',
      '2026-07-09',
      '2026-07-10',
      '2026-07-11',
      '2026-07-12',
    ]);
    expect(week.days.find((day) => day.date === '2026-07-09')?.isSelected).toBe(true);
  });

  it('builds a month overview with leading and trailing Monday-week days', () => {
    const month = buildMonthCalendar('2026-02', '2026-02-14', '2026-02-14');

    expect(month.monthKey).toBe('2026-02');
    expect(month.days[0].date).toBe('2026-01-26');
    expect(month.days.at(-1)?.date).toBe('2026-03-01');
    expect(month.days).toHaveLength(35);
    expect(month.weeks).toHaveLength(5);
    expect(month.days.find((day) => day.date === '2026-02-14')?.isSelected).toBe(true);
    expect(month.days.find((day) => day.date === '2026-01-31')?.isInSelectedMonth).toBe(false);
    expect(month.days.find((day) => day.date === '2026-02-01')?.isInSelectedMonth).toBe(true);
  });
});
