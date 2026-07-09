import { describe, expect, it } from 'vitest';
import { validateProofNote, validateTaskName } from '../../src/lib/validation';

describe('validation helpers', () => {
  it('trims and accepts non-empty task names', () => {
    expect(validateTaskName('  Write  ')).toEqual({ valid: true, value: 'Write' });
  });

  it('rejects empty task names', () => {
    expect(validateTaskName('   ')).toEqual({ valid: false, error: 'Enter a task name.' });
  });

  it('rejects empty proof notes', () => {
    expect(validateProofNote('   ')).toEqual({
      valid: false,
      error: 'Add a proof note before marking done.',
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
