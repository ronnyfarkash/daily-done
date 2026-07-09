export const APP_STATE_VERSION = 1;

export interface DailyTaskSettings {
  taskName: string;
  createdAt: string;
  updatedAt: string;
}

export interface CompletionRecord {
  localDate: string;
  taskNameAtCompletion: string;
  proofNote: string;
  completedAt: string;
}

export interface AppState {
  version: typeof APP_STATE_VERSION;
  settings: DailyTaskSettings | null;
  completions: CompletionRecord[];
}

export type StorageErrorType = 'unavailable' | 'corrupt' | 'write-error';

export interface StorageErrorInfo {
  type: StorageErrorType;
  message: string;
}

export type StorageReadResult =
  | { ok: true; value: AppState }
  | { ok: false; error: StorageErrorInfo; value: AppState };

export type StorageWriteResult =
  | { ok: true }
  | { ok: false; error: StorageErrorInfo };

export interface CurrentStreak {
  count: number;
  throughDate: string | null;
}
