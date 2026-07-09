import type { FormEvent, KeyboardEvent, RefObject } from 'react';
import { useEffect, useRef } from 'react';

interface ChangeTaskConfirmationProps {
  value: string;
  error?: string | null;
  inputRef?: RefObject<HTMLInputElement | null>;
  onChange: (value: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ChangeTaskConfirmation({
  value,
  error,
  inputRef,
  onChange,
  onConfirm,
  onCancel,
}: ChangeTaskConfirmationProps) {
  const fieldId = 'new-daily-task';
  const helperId = 'new-daily-task-helper';
  const errorId = 'new-daily-task-error';
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    window.requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ block: 'start' });
      inputRef?.current?.focus({ preventScroll: true });
    });
  }, [inputRef]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onConfirm();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLFormElement>) {
    if (event.key === 'Escape') {
      event.preventDefault();
      onCancel();
      return;
    }

    if (event.key === 'Tab') {
      const focusableElements = Array.from(
        event.currentTarget.querySelectorAll<HTMLElement>(
          'input, button:not([disabled])',
        ),
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (!firstElement || !lastElement) {
        return;
      }

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }

      if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }

  return (
    <form
      ref={formRef}
      className="card dialog-surface"
      role="dialog"
      aria-modal="true"
      aria-labelledby="change-task-title"
      onSubmit={handleSubmit}
      onKeyDown={handleKeyDown}
      noValidate
    >
      <div className="stack">
        <h2 id="change-task-title" className="card-title">
          Change daily task?
        </h2>
        <p className="helper-text">Your past completions will stay in history.</p>
      </div>
      <div className="field">
        <label htmlFor={fieldId}>New daily task</label>
        <input
          ref={inputRef}
          id={fieldId}
          name="new-daily-task"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-describedby={`${helperId}${error ? ` ${errorId}` : ''}`}
          aria-invalid={Boolean(error)}
          autoComplete="off"
        />
        <p id={helperId} className="helper-text">
          Choose the one thing you want to verify each day.
        </p>
        {error ? (
          <p id={errorId} className="error-text">
            {error}
          </p>
        ) : null}
      </div>
      <div className="button-row">
        <button className="button button-primary" type="submit">
          Confirm change
        </button>
        <button className="button button-secondary" type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
