import { FormEvent, RefObject, useEffect } from 'react';

interface TaskSetupFormProps {
  title: string;
  value: string;
  submitLabel: string;
  helperText?: string;
  error?: string | null;
  autoFocus?: boolean;
  inputRef?: RefObject<HTMLInputElement | null>;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onCancel?: () => void;
}

export function TaskSetupForm({
  title,
  value,
  submitLabel,
  helperText = 'Keep it specific enough to verify.',
  error,
  autoFocus = false,
  inputRef,
  onChange,
  onSubmit,
  onCancel,
}: TaskSetupFormProps) {
  const fieldId = 'daily-task';
  const helperId = 'daily-task-helper';
  const errorId = 'daily-task-error';

  useEffect(() => {
    if (autoFocus) {
      inputRef?.current?.focus();
    }
  }, [autoFocus, inputRef]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <form className="card" onSubmit={handleSubmit} noValidate>
      <h2 className="card-title">{title}</h2>
      <div className="field">
        <label htmlFor={fieldId}>Daily task</label>
        <input
          ref={inputRef}
          id={fieldId}
          name="daily-task"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-describedby={`${helperId}${error ? ` ${errorId}` : ''}`}
          aria-invalid={Boolean(error)}
          autoComplete="off"
        />
        <p id={helperId} className="helper-text">
          {helperText}
        </p>
        {error ? (
          <p id={errorId} className="error-text">
            {error}
          </p>
        ) : null}
      </div>
      <div className="button-row">
        <button className="button button-primary" type="submit">
          {submitLabel}
        </button>
        {onCancel ? (
          <button className="button button-secondary" type="button" onClick={onCancel}>
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
}
