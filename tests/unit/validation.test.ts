import { describe, expect, it } from 'vitest';
import {
  validateProofNote,
  validateScheduledDate,
  validateTaskTitle,
} from '../../src/lib/validation';

describe('validation helpers', () => {
  it('trims and accepts non-empty task titles', () => {
    expect(validateTaskTitle('  Write  ')).toEqual({ valid: true, value: 'Write' });
  });

  it('rejects empty task titles with product copy', () => {
    expect(validateTaskTitle('   ')).toEqual({ valid: false, error: 'Enter a task title.' });
  });

  it('validates scheduled local dates', () => {
    expect(validateScheduledDate('2026-07-09')).toEqual({
      valid: true,
      value: '2026-07-09',
    });
    expect(validateScheduledDate('2026-02-31')).toEqual({
      valid: false,
      error: 'Choose a valid date.',
    });
    expect(validateScheduledDate('')).toEqual({
      valid: false,
      error: 'Choose a valid date.',
    });
  });

  it('rejects empty proof notes with product copy', () => {
    expect(validateProofNote('   ')).toEqual({
      valid: false,
      error: 'Add a proof note before marking complete.',
    });
  });

  it('rejects proof notes shorter than 10 trimmed characters', () => {
    expect(validateProofNote(' short ')).toEqual({
      valid: false,
      error: 'Write at least 10 characters.',
    });
  });

  it('accepts valid proof notes after trimming', () => {
    expect(validateProofNote('  Wrote pages today  ')).toEqual({
      valid: true,
      value: 'Wrote pages today',
    });
  });
});
