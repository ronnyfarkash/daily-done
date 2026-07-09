import { describe, expect, it } from 'vitest';
import { addDays, getLocalDateKey, isValidLocalDateKey } from '../../src/lib/date';

describe('local date helpers', () => {
  it('formats a Date using the local calendar day', () => {
    expect(getLocalDateKey(new Date(2026, 0, 5, 23, 30))).toBe('2026-01-05');
  });

  it('adds and subtracts local calendar days from a YYYY-MM-DD key', () => {
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28');
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
  });

  it('validates real local date keys', () => {
    expect(isValidLocalDateKey('2026-02-28')).toBe(true);
    expect(isValidLocalDateKey('2026-02-31')).toBe(false);
    expect(isValidLocalDateKey('2026-2-1')).toBe(false);
  });
});
