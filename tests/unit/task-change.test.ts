import { describe, expect, it } from 'vitest';
import { addCompletion, changeTask, createEmptyState, setTaskSettings } from '../../src/lib/storage';

describe('task changes', () => {
  it('updates active task settings without mutating historical completion snapshots', () => {
    const withTask = setTaskSettings(
      createEmptyState(),
      'Write',
      '2026-07-08T08:00:00.000Z',
    );
    const completed = addCompletion(
      withTask,
      '2026-07-08',
      'Completed the writing',
      '2026-07-08T09:00:00.000Z',
    );
    const changed = changeTask(completed, 'Read', '2026-07-08T10:00:00.000Z');

    expect(changed.settings?.taskName).toBe('Read');
    expect(changed.completions[0].taskNameAtCompletion).toBe('Write');
    expect(changed.completions[0].proofNote).toBe('Completed the writing');
  });
});
