import { useEffect, useId, useRef, useState } from 'react';
import { validateScheduledDate, validateTaskTitle } from '../lib/validation';

export interface TaskFormValues {
  title: string;
  scheduledDate: string;
}

interface TaskFormProps {
  title: string;
  initialTitle?: string;
  initialDate: string;
  submitLabel?: string;
  onSubmit(values: TaskFormValues): void;
  onCancel(): void;
}

export function TaskForm({
  title,
  initialTitle = '',
  initialDate,
  submitLabel = 'Save task',
  onSubmit,
  onCancel,
}: TaskFormProps) {
  const titleId = useId();
  const titleErrorId = useId();
  const dateId = useId();
  const dateErrorId = useId();
  const [taskTitle, setTaskTitle] = useState(initialTitle);
  const [scheduledDate, setScheduledDate] = useState(initialDate);
  const [taskTitleError, setTaskTitleError] = useState<string | null>(null);
  const [scheduledDateError, setScheduledDateError] = useState<string | null>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleInputRef.current?.focus();
  }, []);

  function handleSubmit() {
    const titleResult = validateTaskTitle(taskTitle);
    const dateResult = validateScheduledDate(scheduledDate);

    setTaskTitleError(titleResult.valid ? null : titleResult.error);
    setScheduledDateError(dateResult.valid ? null : dateResult.error);

    if (!titleResult.valid) {
      titleInputRef.current?.focus();
      return;
    }

    if (!dateResult.valid) {
      dateInputRef.current?.focus();
      return;
    }

    onSubmit({ title: titleResult.value, scheduledDate: dateResult.value });
  }

  return (
    <section className="card form-card" aria-labelledby={titleId}>
      <h2 id={titleId} className="section-title">
        {title}
      </h2>
      <div className="field">
        <label htmlFor={`${titleId}-field`}>Task title</label>
        <input
          id={`${titleId}-field`}
          ref={titleInputRef}
          value={taskTitle}
          onChange={(event) => setTaskTitle(event.target.value)}
          aria-invalid={taskTitleError ? 'true' : 'false'}
          aria-describedby={taskTitleError ? titleErrorId : undefined}
        />
        {taskTitleError ? (
          <p id={titleErrorId} className="error-text">
            {taskTitleError}
          </p>
        ) : null}
      </div>
      <div className="field">
        <label htmlFor={dateId}>Scheduled date</label>
        <input
          id={dateId}
          ref={dateInputRef}
          type="date"
          value={scheduledDate}
          onChange={(event) => setScheduledDate(event.target.value)}
          aria-invalid={scheduledDateError ? 'true' : 'false'}
          aria-describedby={scheduledDateError ? dateErrorId : `${dateId}-helper`}
        />
        <p id={`${dateId}-helper`} className="helper-text">
          Choose the local date this task belongs to.
        </p>
        {scheduledDateError ? (
          <p id={dateErrorId} className="error-text">
            {scheduledDateError}
          </p>
        ) : null}
      </div>
      <div className="button-row">
        <button className="button button-primary" type="button" onClick={handleSubmit}>
          {submitLabel}
        </button>
        <button className="button button-secondary" type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </section>
  );
}
