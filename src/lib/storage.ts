import { isValidLocalDateKey } from './date';
import { validateProofNote, validateTaskName } from './validation';
import {
  APP_STATE_VERSION,
  type AppState,
  type CompletionRecord,
  type StorageErrorInfo,
  type StorageReadResult,
  type StorageWriteResult,
} from './types';

export const STORAGE_KEY = 'daily-done:v1';

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export function createEmptyState(): AppState {
  return {
    version: APP_STATE_VERSION,
    settings: null,
    completions: [],
  };
}

function getBrowserStorage(): StorageLike | null {
  if (typeof window === 'undefined' || !window.localStorage) {
    return null;
  }

  return window.localStorage;
}

function makeStorageError(type: StorageErrorInfo['type'], message: string): StorageErrorInfo {
  return { type, message };
}

function validateAppState(value: unknown): value is AppState {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const state = value as AppState;

  if (state.version !== APP_STATE_VERSION) {
    return false;
  }

  if (state.settings !== null) {
    const taskResult = validateTaskName(state.settings?.taskName ?? '');
    if (
      !taskResult.valid ||
      typeof state.settings.createdAt !== 'string' ||
      typeof state.settings.updatedAt !== 'string'
    ) {
      return false;
    }
  }

  if (!Array.isArray(state.completions)) {
    return false;
  }

  const dates = new Set<string>();

  for (const completion of state.completions) {
    if (!isCompletionRecord(completion) || dates.has(completion.localDate)) {
      return false;
    }

    dates.add(completion.localDate);
  }

  return true;
}

function isCompletionRecord(value: unknown): value is CompletionRecord {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const completion = value as CompletionRecord;
  return (
    isValidLocalDateKey(completion.localDate) &&
    validateTaskName(completion.taskNameAtCompletion).valid &&
    validateProofNote(completion.proofNote).valid &&
    typeof completion.completedAt === 'string'
  );
}

export function readAppState(storage = getBrowserStorage()): StorageReadResult {
  const emptyState = createEmptyState();

  if (!storage) {
    return {
      ok: false,
      value: emptyState,
      error: makeStorageError('unavailable', 'Daily Done cannot read browser storage. Check storage settings and try again.'),
    };
  }

  let raw: string | null;

  try {
    raw = storage.getItem(STORAGE_KEY);
  } catch {
    return {
      ok: false,
      value: emptyState,
      error: makeStorageError('unavailable', 'Daily Done cannot read browser storage. Check storage settings and try again.'),
    };
  }

  if (!raw) {
    return { ok: true, value: emptyState };
  }

  try {
    const parsed = JSON.parse(raw) as unknown;

    if (!validateAppState(parsed)) {
      return {
        ok: false,
        value: emptyState,
        error: makeStorageError('corrupt', 'Daily Done found saved data it cannot read. Check storage settings and try again.'),
      };
    }

    return { ok: true, value: parsed };
  } catch {
    return {
      ok: false,
      value: emptyState,
      error: makeStorageError('corrupt', 'Daily Done found saved data it cannot read. Check storage settings and try again.'),
    };
  }
}

export function writeAppState(
  state: AppState,
  storage = getBrowserStorage(),
): StorageWriteResult {
  if (!storage) {
    return {
      ok: false,
      error: makeStorageError('unavailable', 'Daily Done cannot save in this browser. Check storage settings and try again.'),
    };
  }

  if (!validateAppState(state)) {
    return {
      ok: false,
      error: makeStorageError('write-error', 'Daily Done cannot save invalid local data. Try again.'),
    };
  }

  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(state));
    return { ok: true };
  } catch {
    return {
      ok: false,
      error: makeStorageError('write-error', 'Daily Done cannot save in this browser. Check storage settings and try again.'),
    };
  }
}

export function setTaskSettings(
  state: AppState,
  taskName: string,
  timestamp = new Date().toISOString(),
): AppState {
  const validation = validateTaskName(taskName);

  if (!validation.valid) {
    throw new Error(validation.error);
  }

  return {
    ...state,
    settings: {
      taskName: validation.value,
      createdAt: state.settings?.createdAt ?? timestamp,
      updatedAt: timestamp,
    },
  };
}

export function addCompletion(
  state: AppState,
  localDate: string,
  proofNote: string,
  completedAt = new Date().toISOString(),
): AppState {
  if (!state.settings) {
    throw new Error('A daily task is required before completion.');
  }

  if (state.completions.some((completion) => completion.localDate === localDate)) {
    return state;
  }

  const noteValidation = validateProofNote(proofNote);

  if (!noteValidation.valid) {
    throw new Error(noteValidation.error);
  }

  return {
    ...state,
    completions: [
      ...state.completions,
      {
        localDate,
        taskNameAtCompletion: state.settings.taskName,
        proofNote: noteValidation.value,
        completedAt,
      },
    ],
  };
}

export function changeTask(
  state: AppState,
  taskName: string,
  timestamp = new Date().toISOString(),
): AppState {
  return setTaskSettings(state, taskName, timestamp);
}

export function findCompletionForDate(
  state: AppState,
  localDate: string,
): CompletionRecord | undefined {
  return state.completions.find((completion) => completion.localDate === localDate);
}
