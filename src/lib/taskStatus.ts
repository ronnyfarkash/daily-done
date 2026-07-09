import { compareLocalDates } from './date';
import type { ScheduledTask, ScheduledTaskWithStatus, TaskStatus } from './types';
import { validateProofNote } from './validation';

const STATUS_LABELS: Record<TaskStatus, string> = {
  planned: 'Planned',
  'due-today': 'Due today',
  missed: 'Missed',
  completed: 'Completed',
};

export function isTaskCompleted(task: ScheduledTask): boolean {
  return Boolean(task.completedAt && task.proofNote);
}

export function deriveTaskStatus(task: ScheduledTask, todayLocalDate: string): TaskStatus {
  if (isTaskCompleted(task)) {
    return 'completed';
  }

  const comparison = compareLocalDates(task.scheduledDate, todayLocalDate);
  if (comparison > 0) {
    return 'planned';
  }

  if (comparison < 0) {
    return 'missed';
  }

  return 'due-today';
}

export function getTaskDisplayState(
  task: ScheduledTask,
  todayLocalDate: string,
): ScheduledTaskWithStatus {
  const status = deriveTaskStatus(task, todayLocalDate);

  return {
    task,
    status,
    isCompletable: status === 'due-today' || status === 'missed',
    isEditable: status !== 'completed',
    statusLabel: STATUS_LABELS[status],
  };
}

export function completeTask(
  task: ScheduledTask,
  proofNote: string,
  todayLocalDate: string,
  completedAt = new Date().toISOString(),
): ScheduledTask {
  const status = deriveTaskStatus(task, todayLocalDate);

  if (status === 'completed') {
    throw new Error('This task is already completed.');
  }

  if (status === 'planned') {
    throw new Error('This task can be completed on its scheduled date.');
  }

  const validation = validateProofNote(proofNote);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  return {
    ...task,
    completedAt,
    proofNote: validation.value,
    updatedAt: completedAt,
  };
}
