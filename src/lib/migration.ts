import { APP_STATE_VERSION, type AppStateV2, type ScheduledTask } from './types';
import { isValidLocalDateKey } from './date';
import { validateProofNote, validateTaskTitle } from './validation';

interface LegacySettingsLike {
  taskName?: unknown;
  createdAt?: unknown;
  updatedAt?: unknown;
}

interface LegacyCompletionLike {
  localDate?: unknown;
  taskNameAtCompletion?: unknown;
  proofNote?: unknown;
  completedAt?: unknown;
}

interface LegacyStateLike {
  version?: unknown;
  settings?: unknown;
  completions?: unknown;
}

function asObject(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' ? (value as Record<string, unknown>) : null;
}

function uniqueId(base: string, used: Set<string>): string {
  if (!used.has(base)) {
    used.add(base);
    return base;
  }

  let suffix = 2;
  while (used.has(`${base}-${suffix}`)) {
    suffix += 1;
  }

  const id = `${base}-${suffix}`;
  used.add(id);
  return id;
}

function migrateCompletion(
  completion: LegacyCompletionLike,
  usedIds: Set<string>,
): ScheduledTask | null {
  if (
    typeof completion.localDate !== 'string' ||
    typeof completion.taskNameAtCompletion !== 'string' ||
    typeof completion.proofNote !== 'string' ||
    typeof completion.completedAt !== 'string' ||
    !isValidLocalDateKey(completion.localDate)
  ) {
    return null;
  }

  const title = validateTaskTitle(completion.taskNameAtCompletion);
  const proofNote = validateProofNote(completion.proofNote);
  if (!title.valid || !proofNote.valid) {
    return null;
  }

  return {
    id: uniqueId(`legacy-completion-${completion.localDate}`, usedIds),
    title: title.value,
    scheduledDate: completion.localDate,
    createdAt: completion.completedAt,
    updatedAt: completion.completedAt,
    completedAt: completion.completedAt,
    proofNote: proofNote.value,
  };
}

function migrateSettings(
  settings: LegacySettingsLike | null,
  todayLocalDate: string,
  usedIds: Set<string>,
): ScheduledTask | null {
  if (!settings) {
    return null;
  }

  if (
    typeof settings.taskName !== 'string' ||
    typeof settings.createdAt !== 'string' ||
    typeof settings.updatedAt !== 'string'
  ) {
    return null;
  }

  const title = validateTaskTitle(settings.taskName);
  if (!title.valid) {
    return null;
  }

  return {
    id: uniqueId(`legacy-active-${todayLocalDate}`, usedIds),
    title: title.value,
    scheduledDate: todayLocalDate,
    createdAt: settings.createdAt,
    updatedAt: settings.updatedAt,
    completedAt: null,
    proofNote: null,
  };
}

export function migrateLegacyState(value: unknown, todayLocalDate: string): AppStateV2 | null {
  const state = asObject(value) as LegacyStateLike | null;

  if (!state || state.version !== 1 || !Array.isArray(state.completions)) {
    return null;
  }

  const usedIds = new Set<string>();
  const tasks: ScheduledTask[] = [];

  for (const rawCompletion of state.completions) {
    const completion = asObject(rawCompletion) as LegacyCompletionLike | null;
    if (!completion) {
      return null;
    }

    const migrated = migrateCompletion(completion, usedIds);
    if (!migrated) {
      return null;
    }

    tasks.push(migrated);
  }

  const hasTodayCompletion = tasks.some(
    (task) => task.scheduledDate === todayLocalDate && task.completedAt,
  );
  const rawSettings = state.settings === null || state.settings === undefined
    ? null
    : (asObject(state.settings) as LegacySettingsLike | null);

  if (state.settings !== null && state.settings !== undefined && !rawSettings) {
    return null;
  }

  if (!hasTodayCompletion) {
    const activeTask = migrateSettings(rawSettings, todayLocalDate, usedIds);
    if (activeTask) {
      tasks.push(activeTask);
    }
  }

  return {
    version: APP_STATE_VERSION,
    tasks,
  };
}
