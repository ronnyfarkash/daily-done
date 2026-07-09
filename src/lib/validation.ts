export type ValidationResult =
  | { valid: true; value: string }
  | { valid: false; error: string };

export function validateTaskName(taskName: string): ValidationResult {
  const trimmed = taskName.trim();

  if (!trimmed) {
    return { valid: false, error: 'Enter a task name.' };
  }

  return { valid: true, value: trimmed };
}

export function validateProofNote(proofNote: string): ValidationResult {
  const trimmed = proofNote.trim();

  if (!trimmed) {
    return { valid: false, error: 'Add a proof note before marking done.' };
  }

  if (trimmed.length < 10) {
    return { valid: false, error: 'Write at least 10 characters.' };
  }

  return { valid: true, value: trimmed };
}
