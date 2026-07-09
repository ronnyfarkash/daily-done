import { describe, expect, it } from 'vitest';
import {
  addTask,
  completeTaskInState,
  createEmptyState,
  LEGACY_STORAGE_KEY,
  readAppState,
  STORAGE_KEY,
  updateTask,
  writeAppState,
  type StorageLike,
} from '../../src/lib/storage';
import type { AppStateV2 } from '../../src/lib/types';

function memoryStorage(initial?: Record<string, string>): StorageLike {
  const store = new Map(Object.entries(initial ?? {}));
  return {
    getItem: (key) => store.get(key) ?? null,
    setItem: (key, value) => {
      store.set(key, value);
    },
    removeItem: (key) => {
      store.delete(key);
    },
  };
}

const throwingStorage: StorageLike = {
  getItem: () => {
    throw new Error('unavailable');
  },
  setItem: () => {
    throw new Error('unavailable');
  },
  removeItem: () => undefined,
};

describe('V2 localStorage adapter', () => {
  it('reads an empty V2 state when no saved data exists', () => {
    const result = readAppState(memoryStorage(), '2026-07-09');

    expect(result.ok).toBe(true);
    expect(result.value).toEqual(createEmptyState());
  });

  it('writes and reads a valid V2 app state', () => {
    const storage = memoryStorage();
    const state = addTask(createEmptyState(), {
      title: 'Write',
      scheduledDate: '2026-07-09',
      timestamp: '2026-07-09T08:00:00.000Z',
      id: 'task-1',
    });

    expect(writeAppState(state, storage)).toEqual({ ok: true });
    expect(readAppState(storage, '2026-07-09').value).toEqual(state);
  });

  it('rejects corrupt V2 payloads without creating false tasks', () => {
    const result = readAppState(memoryStorage({ [STORAGE_KEY]: '{not json' }), '2026-07-09');

    expect(result.ok).toBe(false);
    expect(result.value).toEqual(createEmptyState());
    expect(result.ok ? null : result.error.type).toBe('corrupt');
  });

  it('returns unavailable or write-error when storage throws', () => {
    expect(readAppState(throwingStorage, '2026-07-09').ok).toBe(false);
    const state = addTask(createEmptyState(), {
      title: 'Write',
      scheduledDate: '2026-07-09',
      id: 'task-1',
    });
    const result = writeAppState(state, throwingStorage);

    expect(result.ok).toBe(false);
    expect(result.ok ? null : result.error.type).toBe('write-error');
  });

  it('updates incomplete tasks without changing identity or createdAt', () => {
    const state = addTask(createEmptyState(), {
      title: 'Write',
      scheduledDate: '2026-07-09',
      timestamp: '2026-07-09T08:00:00.000Z',
      id: 'task-1',
    });

    const updated = updateTask(state, 'task-1', {
      title: 'Read',
      scheduledDate: '2026-07-10',
      timestamp: '2026-07-09T09:00:00.000Z',
    });

    expect(updated.tasks[0]).toMatchObject({
      id: 'task-1',
      title: 'Read',
      scheduledDate: '2026-07-10',
      createdAt: '2026-07-09T08:00:00.000Z',
      updatedAt: '2026-07-09T09:00:00.000Z',
    });
  });

  it('prevents duplicate completion for the same task id', () => {
    const state = addTask(createEmptyState(), {
      title: 'Write',
      scheduledDate: '2026-07-09',
      timestamp: '2026-07-09T08:00:00.000Z',
      id: 'task-1',
    });
    const completed = completeTaskInState(
      state,
      'task-1',
      'Finished the thing',
      '2026-07-09',
      '2026-07-09T10:00:00.000Z',
    );
    const duplicate = completeTaskInState(
      completed,
      'task-1',
      'Finished it again',
      '2026-07-09',
      '2026-07-09T11:00:00.000Z',
    );

    expect(duplicate.tasks[0].proofNote).toBe('Finished the thing');
    expect(duplicate.tasks[0].completedAt).toBe('2026-07-09T10:00:00.000Z');
  });

  it('migrates readable legacy V1 data when V2 is absent and writes V2', () => {
    const legacy = {
      version: 1,
      settings: {
        taskName: 'Current task',
        createdAt: '2026-07-01T08:00:00.000Z',
        updatedAt: '2026-07-01T08:00:00.000Z',
      },
      completions: [
        {
          localDate: '2026-07-08',
          taskNameAtCompletion: 'Write',
          proofNote: 'Completed writing',
          completedAt: '2026-07-08T09:00:00.000Z',
        },
      ],
    };
    const storage = memoryStorage({ [LEGACY_STORAGE_KEY]: JSON.stringify(legacy) });

    const result = readAppState(storage, '2026-07-09');
    const written = JSON.parse(storage.getItem(STORAGE_KEY) ?? '') as AppStateV2;

    expect(result.ok).toBe(true);
    expect(result.value.tasks.map((task) => task.id)).toEqual([
      'legacy-completion-2026-07-08',
      'legacy-active-2026-07-09',
    ]);
    expect(result.value.tasks[0]).toMatchObject({
      title: 'Write',
      scheduledDate: '2026-07-08',
      proofNote: 'Completed writing',
      completedAt: '2026-07-08T09:00:00.000Z',
    });
    expect(written).toEqual(result.value);
    expect(storage.getItem(LEGACY_STORAGE_KEY)).toBe(JSON.stringify(legacy));
  });
});
