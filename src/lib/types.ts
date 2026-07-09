export const APP_STATE_VERSION = 2;

export type ViewMode = 'day' | 'week' | 'month';

export interface AppPreferences {
  lastSelectedDate?: string;
}

export interface ScheduledTask {
  id: string;
  title: string;
  scheduledDate: string;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  proofNote: string | null;
}

export interface AppStateV2 {
  version: typeof APP_STATE_VERSION;
  tasks: ScheduledTask[];
  preferences?: AppPreferences;
}

export type AppState = AppStateV2;

export type TaskStatus = 'planned' | 'due-today' | 'missed' | 'completed';

export interface ScheduledTaskWithStatus {
  task: ScheduledTask;
  status: TaskStatus;
  isCompletable: boolean;
  isEditable: boolean;
  statusLabel: string;
}

export interface DayViewModel {
  date: string;
  tasks: ScheduledTaskWithStatus[];
  totalCount: number;
  completedCount: number;
  incompleteCount: number;
  plannedCount: number;
  dueTodayCount: number;
  missedCount: number;
  hasMissedTasks: boolean;
  summaryLabel: string;
}

export interface DaySummary {
  date: string;
  tasks: ScheduledTaskWithStatus[];
  totalCount: number;
  completedCount: number;
  incompleteCount: number;
  plannedCount: number;
  dueTodayCount: number;
  missedCount: number;
  statusSummary: string;
  isToday: boolean;
  isSelected: boolean;
}

export interface WeekViewModel {
  startDate: string;
  endDate: string;
  days: DaySummary[];
}

export interface MonthViewModel {
  monthKey: string;
  weeks: MonthWeek[];
  days: MonthDaySummary[];
}

export interface MonthWeek {
  startDate: string;
  endDate: string;
  days: MonthDaySummary[];
}

export interface MonthDaySummary {
  date: string;
  dayNumber: number;
  monthKey: string;
  isInSelectedMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  totalCount: number;
  completedCount: number;
  incompleteCount: number;
  plannedCount: number;
  dueTodayCount: number;
  missedCount: number;
  statusSummary: string;
}

export type StorageErrorType = 'unavailable' | 'corrupt' | 'write-error';

export interface StorageErrorInfo {
  type: StorageErrorType;
  message: string;
}

export type StorageReadResult =
  | { ok: true; value: AppStateV2; migrated?: boolean }
  | { ok: false; error: StorageErrorInfo; value: AppStateV2 };

export type StorageWriteResult =
  | { ok: true }
  | { ok: false; error: StorageErrorInfo };

export interface LegacyDailyTaskSettings {
  taskName: string;
  createdAt: string;
  updatedAt: string;
}

export interface LegacyCompletionRecord {
  localDate: string;
  taskNameAtCompletion: string;
  proofNote: string;
  completedAt: string;
}

export interface LegacyDailyDoneStateV1 {
  version: 1;
  settings: LegacyDailyTaskSettings | null;
  completions: LegacyCompletionRecord[];
}
