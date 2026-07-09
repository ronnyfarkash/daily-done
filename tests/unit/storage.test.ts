import { describe, expect, it } from 'vitest';
import {
  addCompletion,
  createEmptyState,
  readAppState,
  setTaskSettings,
  STORAGE_KEY,
  writeAppState,
  type StorageLike,
} from '../../src/lib/storage';

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

describe('localStorage adapter', () => {
  it('reads an empty state when no saved data exists', () => {
    const result = readAppState(memoryStorage());

    expect(result.ok).toBe(true);
    expect(result.value).toEqual(createEmptyState());
  });

  it('writes and reads a valid app state', () => {
    const storage = memoryStorage();
    const state = setTaskSettings(createEmptyState(), 'Write', '2026-07-08T08:00:00.000Z');

    expect(writeAppState(state, storage)).toEqual({ ok: true });
    expect(readAppState(storage).value).toEqual(state);
  });

  it('returns a corrupt storage result for unreadable saved payloads', () => {
    const result = readAppState(memoryStorage({ [STORAGE_KEY]: '{not json' }));

    expect(result.ok).toBe(false);
    expect(result.ok ? null : result.error.type).toBe('corrupt');
    expect(result.value).toEqual(createEmptyState());
  });

  it('returns a corrupt storage result for duplicate local dates', () => {
    const duplicateState = {
      version: 1,
      settings: {
        taskName: 'Write',
        createdAt: '2026-07-08T08:00:00.000Z',
        updatedAt: '2026-07-08T08:00:00.000Z',
      },
      completions: [
        {
          localDate: '2026-07-08',
          taskNameAtCompletion: 'Write',
          proofNote: 'Completed writing',
          completedAt: '2026-07-08T09:00:00.000Z',
        },
        {
          localDate: '2026-07-08',
          taskNameAtCompletion: 'Write',
          proofNote: 'Completed again',
          completedAt: '2026-07-08T10:00:00.000Z',
        },
      ],
    };

    const result = readAppState(
      memoryStorage({ [STORAGE_KEY]: JSON.stringify(duplicateState) }),
    );

    expect(result.ok).toBe(false);
    expect(result.ok ? null : result.error.type).toBe('corrupt');
  });

  it('returns unavailable or write-error when storage throws', () => {
    expect(readAppState(throwingStorage).ok).toBe(false);
    const state = setTaskSettings(createEmptyState(), 'Write');
    const result = writeAppState(state, throwingStorage);

    expect(result.ok).toBe(false);
    expect(result.ok ? null : result.error.type).toBe('write-error');
  });

  it('prevents duplicate completion records for the same local date', () => {
    const withTask = setTaskSettings(createEmptyState(), 'Write');
    const completed = addCompletion(withTask, '2026-07-08', 'Completed writing');
    const duplicate = addCompletion(completed, '2026-07-08', 'Completed again');

    expect(duplicate.completions).toHaveLength(1);
    expect(duplicate.completions[0].proofNote).toBe('Completed writing');
  });
});
