import { describe, expect, it } from 'vitest';
import { completeTask, deriveTaskStatus, getTaskDisplayState } from '../../src/lib/taskStatus';
import type { ScheduledTask } from '../../src/lib/types';

function task(overrides: Partial<ScheduledTask> = {}): ScheduledTask {
  return {
    id: 'task-1',
    title: 'Write report',
    scheduledDate: '2026-07-09',
    createdAt: '2026-07-09T08:00:00.000Z',
    updatedAt: '2026-07-09T08:00:00.000Z',
    completedAt: null,
    proofNote: null,
    ...overrides,
  };
}

describe('task status derivation', () => {
  it('derives planned, due-today, missed, and completed states', () => {
    expect(deriveTaskStatus(task({ scheduledDate: '2026-07-10' }), '2026-07-09')).toBe('planned');
    expect(deriveTaskStatus(task({ scheduledDate: '2026-07-09' }), '2026-07-09')).toBe('due-today');
    expect(deriveTaskStatus(task({ scheduledDate: '2026-07-08' }), '2026-07-09')).toBe('missed');
    expect(
      deriveTaskStatus(
        task({ completedAt: '2026-07-09T09:00:00.000Z', proofNote: 'Completed it today' }),
        '2026-07-10',
      ),
    ).toBe('completed');
  });

  it('re-evaluates status from the supplied current local date', () => {
    const future = task({ scheduledDate: '2026-07-10' });

    expect(deriveTaskStatus(future, '2026-07-09')).toBe('planned');
    expect(deriveTaskStatus(future, '2026-07-10')).toBe('due-today');
    expect(deriveTaskStatus(future, '2026-07-11')).toBe('missed');
  });

  it('marks only due-today and missed incomplete tasks as completable', () => {
    expect(getTaskDisplayState(task({ scheduledDate: '2026-07-10' }), '2026-07-09').isCompletable).toBe(false);
    expect(getTaskDisplayState(task({ scheduledDate: '2026-07-09' }), '2026-07-09').isCompletable).toBe(true);
    expect(getTaskDisplayState(task({ scheduledDate: '2026-07-08' }), '2026-07-09').isCompletable).toBe(true);
    expect(
      getTaskDisplayState(
        task({ completedAt: '2026-07-09T09:00:00.000Z', proofNote: 'Completed it today' }),
        '2026-07-09',
      ).isCompletable,
    ).toBe(false);
  });

  it('blocks future completion and duplicate completion by task id', () => {
    expect(() =>
      completeTask(task({ scheduledDate: '2026-07-10' }), 'Finished the thing', '2026-07-09'),
    ).toThrow('This task can be completed on its scheduled date.');

    const completed = completeTask(task(), 'Finished the thing', '2026-07-09', '2026-07-09T10:00:00.000Z');

    expect(completed.completedAt).toBe('2026-07-09T10:00:00.000Z');
    expect(completed.proofNote).toBe('Finished the thing');
    expect(() => completeTask(completed, 'Finished it again', '2026-07-09')).toThrow(
      'This task is already completed.',
    );
  });
});
