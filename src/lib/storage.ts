import { getLocalDateKey } from './date';
import { migrateLegacyState } from './migration';
import { completeTask } from './taskStatus';
import {
  APP_STATE_VERSION,
  type AppStateV2,
  type ScheduledTask,
  type StorageErrorInfo,
  type StorageReadResult,
  type StorageWriteResult,
} from './types';
import { validateScheduledDate, validateTaskTitle } from './validation';

export const STORAGE_KEY = 'daily-done:v2';
export const LEGACY_STORAGE_KEY = 'daily-done:v1';

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

interface TaskInput {
  title: string;
  scheduledDate: string;
  timestamp?: string;
  id?: string;
}

interface TaskUpdateInput {
  title: string;
  scheduledDate: string;
  timestamp?: string;
}

export function createEmptyState(): AppStateV2 {
  return {
    version: APP_STATE_VERSION,
    tasks: [],
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

function createTaskId(): string {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  return `task-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function isTimestamp(value: unknown): value is string {
  return typeof value === 'string' && !Number.isNaN(Date.parse(value));
}

function isScheduledTask(value: unknown): value is ScheduledTask {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const task = value as ScheduledTask;
  const title = validateTaskTitle(task.title ?? '');
  const scheduledDate = validateScheduledDate(task.scheduledDate ?? '');

  if (
    typeof task.id !== 'string' ||
    !title.valid ||
    !scheduledDate.valid ||
    !isTimestamp(task.createdAt) ||
    !isTimestamp(task.updatedAt)
  ) {
    return false;
  }

  if (task.completedAt === null) {
    return task.proofNote === null;
  }

  if (!isTimestamp(task.completedAt) || typeof task.proofNote !== 'string') {
    return false;
  }

  return task.proofNote.trim().length >= 10;
}

function validateAppState(value: unknown): value is AppStateV2 {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const state = value as AppStateV2;

  if (state.version !== APP_STATE_VERSION || !Array.isArray(state.tasks)) {
    return false;
  }

  const ids = new Set<string>();
  for (const task of state.tasks) {
    if (!isScheduledTask(task) || ids.has(task.id)) {
      return false;
    }
    ids.add(task.id);
  }

  if (
    state.preferences &&
    typeof state.preferences.lastSelectedDate === 'string' &&
    !validateScheduledDate(state.preferences.lastSelectedDate).valid
  ) {
    return false;
  }

  return true;
}

export function readAppState(
  storage = getBrowserStorage(),
  todayLocalDate = getLocalDateKey(),
): StorageReadResult {
  const emptyState = createEmptyState();

  if (!storage) {
    return {
      ok: false,
      value: emptyState,
      error: makeStorageError('unavailable', 'Daily Done cannot read browser storage. Try again.'),
    };
  }

  let rawV2: string | null;

  try {
    rawV2 = storage.getItem(STORAGE_KEY);
  } catch {
    return {
      ok: false,
      value: emptyState,
      error: makeStorageError('unavailable', 'Daily Done cannot read browser storage. Try again.'),
    };
  }

  if (rawV2) {
    try {
      const parsed = JSON.parse(rawV2) as unknown;
      if (!validateAppState(parsed)) {
        return {
          ok: false,
          value: emptyState,
          error: makeStorageError('corrupt', 'Daily Done found saved data it cannot read. Try again.'),
        };
      }

      return { ok: true, value: parsed };
    } catch {
      return {
        ok: false,
        value: emptyState,
        error: makeStorageError('corrupt', 'Daily Done found saved data it cannot read. Try again.'),
      };
    }
  }

  let rawLegacy: string | null;
  try {
    rawLegacy = storage.getItem(LEGACY_STORAGE_KEY);
  } catch {
    return { ok: true, value: emptyState };
  }

  if (!rawLegacy) {
    return { ok: true, value: emptyState };
  }

  try {
    const migrated = migrateLegacyState(JSON.parse(rawLegacy), todayLocalDate);
    if (!migrated) {
      return { ok: true, value: emptyState };
    }

    const writeResult = writeAppState(migrated, storage);
    if (!writeResult.ok) {
      return {
        ok: false,
        value: emptyState,
        error: writeResult.error,
      };
    }

    return { ok: true, value: migrated, migrated: true };
  } catch {
    return { ok: true, value: emptyState };
  }
}

export function writeAppState(
  state: AppStateV2,
  storage = getBrowserStorage(),
): StorageWriteResult {
  if (!storage) {
    return {
      ok: false,
      error: makeStorageError('unavailable', 'Daily Done cannot save in this browser. Try again.'),
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
      error: makeStorageError('write-error', 'Daily Done cannot save in this browser. Try again.'),
    };
  }
}

export function addTask(state: AppStateV2, input: TaskInput): AppStateV2 {
  const title = validateTaskTitle(input.title);
  if (!title.valid) {
    throw new Error(title.error);
  }

  const scheduledDate = validateScheduledDate(input.scheduledDate);
  if (!scheduledDate.valid) {
    throw new Error(scheduledDate.error);
  }

  const timestamp = input.timestamp ?? new Date().toISOString();

  return {
    ...state,
    tasks: [
      ...state.tasks,
      {
        id: input.id ?? createTaskId(),
        title: title.value,
        scheduledDate: scheduledDate.value,
        createdAt: timestamp,
        updatedAt: timestamp,
        completedAt: null,
        proofNote: null,
      },
    ],
  };
}

export function updateTask(
  state: AppStateV2,
  taskId: string,
  input: TaskUpdateInput,
): AppStateV2 {
  const existing = state.tasks.find((task) => task.id === taskId);
  if (!existing) {
    return state;
  }

  if (existing.completedAt) {
    throw new Error('Completed tasks cannot be edited.');
  }

  const title = validateTaskTitle(input.title);
  if (!title.valid) {
    throw new Error(title.error);
  }

  const scheduledDate = validateScheduledDate(input.scheduledDate);
  if (!scheduledDate.valid) {
    throw new Error(scheduledDate.error);
  }

  const timestamp = input.timestamp ?? new Date().toISOString();

  return {
    ...state,
    tasks: state.tasks.map((task) =>
      task.id === taskId
        ? {
            ...task,
            title: title.value,
            scheduledDate: scheduledDate.value,
            updatedAt: timestamp,
          }
        : task,
    ),
  };
}

export function completeTaskInState(
  state: AppStateV2,
  taskId: string,
  proofNote: string,
  todayLocalDate = getLocalDateKey(),
  completedAt = new Date().toISOString(),
): AppStateV2 {
  const existing = state.tasks.find((task) => task.id === taskId);
  if (!existing) {
    return state;
  }

  if (existing.completedAt) {
    return state;
  }

  const completed = completeTask(existing, proofNote, todayLocalDate, completedAt);

  return {
    ...state,
    tasks: state.tasks.map((task) => (task.id === taskId ? completed : task)),
  };
}
