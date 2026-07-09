import { isValidLocalDateKey } from './date';

export type ValidationResult =
  | { valid: true; value: string }
  | { valid: false; error: string };

export function validateTaskTitle(taskTitle: string): ValidationResult {
  const trimmed = taskTitle.trim();

  if (!trimmed) {
    return { valid: false, error: 'Enter a task title.' };
  }

  return { valid: true, value: trimmed };
}

export function validateTaskName(taskName: string): ValidationResult {
  return validateTaskTitle(taskName);
}

export function validateScheduledDate(scheduledDate: string): ValidationResult {
  const trimmed = scheduledDate.trim();

  if (!trimmed || !isValidLocalDateKey(trimmed)) {
    return { valid: false, error: 'Choose a valid date.' };
  }

  return { valid: true, value: trimmed };
}

export function validateProofNote(proofNote: string): ValidationResult {
  const trimmed = proofNote.trim();

  if (!trimmed) {
    return { valid: false, error: 'Add a proof note before marking complete.' };
  }

  if (trimmed.length < 10) {
    return { valid: false, error: 'Write at least 10 characters.' };
  }

  return { valid: true, value: trimmed };
}
