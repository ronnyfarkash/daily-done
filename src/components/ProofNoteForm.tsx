import { useEffect, useId, useRef, useState } from 'react';
import { validateProofNote } from '../lib/validation';

interface ProofNoteFormProps {
  taskTitle: string;
  scheduledDateLabel: string;
  onSubmit(proofNote: string): void;
  onCancel(): void;
}

export function ProofNoteForm({
  taskTitle,
  scheduledDateLabel,
  onSubmit,
  onCancel,
}: ProofNoteFormProps) {
  const fieldId = useId();
  const errorId = useId();
  const [proofNote, setProofNote] = useState('');
  const [error, setError] = useState<string | null>(null);
  const fieldRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fieldRef.current?.focus();
  }, []);

  function handleSubmit() {
    const validation = validateProofNote(proofNote);

    if (!validation.valid) {
      setError(validation.error);
      fieldRef.current?.focus();
      return;
    }

    onSubmit(validation.value);
  }

  return (
    <div className="proof-form" aria-label={`Verification form for ${taskTitle}`}>
      <p className="helper-text">
        {taskTitle} · {scheduledDateLabel}
      </p>
      <div className="field">
        <label htmlFor={fieldId}>Proof note</label>
        <textarea
          id={fieldId}
          ref={fieldRef}
          value={proofNote}
          onChange={(event) => setProofNote(event.target.value)}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? errorId : `${fieldId}-helper`}
        />
        <p id={`${fieldId}-helper`} className="helper-text">
          Write a short note about what you did.
        </p>
        {error ? (
          <p id={errorId} className="error-text">
            {error}
          </p>
        ) : null}
      </div>
      <div className="button-row">
        <button className="button button-primary" type="button" onClick={handleSubmit}>
          Mark complete
        </button>
        <button className="button button-secondary" type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}
