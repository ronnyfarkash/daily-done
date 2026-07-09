import { describe, expect, it } from 'vitest';
import {
  addDays,
  compareLocalDates,
  getLocalDateKey,
  getMonthKey,
  getWeekDates,
  isValidLocalDateKey,
  parseLocalDateKey,
} from '../../src/lib/date';

describe('local date helpers', () => {
  it('formats a Date using the browser local calendar day', () => {
    expect(getLocalDateKey(new Date(2026, 0, 5, 23, 30))).toBe('2026-01-05');
  });

  it('parses local date keys at local midday to avoid timezone boundary drift', () => {
    const parsed = parseLocalDateKey('2026-07-09');

    expect(parsed.getFullYear()).toBe(2026);
    expect(parsed.getMonth()).toBe(6);
    expect(parsed.getDate()).toBe(9);
    expect(parsed.getHours()).toBe(12);
  });

  it('validates only real YYYY-MM-DD local date keys', () => {
    expect(isValidLocalDateKey('2026-02-28')).toBe(true);
    expect(isValidLocalDateKey('2026-02-31')).toBe(false);
    expect(isValidLocalDateKey('2026-2-1')).toBe(false);
    expect(isValidLocalDateKey('not-a-date')).toBe(false);
  });

  it('adds and subtracts local calendar days across month and year boundaries', () => {
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28');
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
  });

  it('compares local date keys chronologically', () => {
    expect(compareLocalDates('2026-07-08', '2026-07-09')).toBeLessThan(0);
    expect(compareLocalDates('2026-07-09', '2026-07-08')).toBeGreaterThan(0);
    expect(compareLocalDates('2026-07-09', '2026-07-09')).toBe(0);
  });

  it('returns deterministic Monday-through-Sunday week dates', () => {
    expect(getWeekDates('2026-07-09')).toEqual([
      '2026-07-06',
      '2026-07-07',
      '2026-07-08',
      '2026-07-09',
      '2026-07-10',
      '2026-07-11',
      '2026-07-12',
    ]);
  });

  it('returns month keys from local date keys', () => {
    expect(getMonthKey('2026-07-09')).toBe('2026-07');
  });
});
