import { FormEvent, RefObject } from 'react';

interface ProofNoteFormProps {
  value: string;
  error?: string | null;
  inputRef?: RefObject<HTMLTextAreaElement | null>;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

export function ProofNoteForm({
  value,
  error,
  inputRef,
  onChange,
  onSubmit,
}: ProofNoteFormProps) {
  const fieldId = 'proof-note';
  const helperId = 'proof-note-helper';
  const errorId = 'proof-note-error';

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <form className="stack" onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label htmlFor={fieldId}>Proof note</label>
        <textarea
          ref={inputRef}
          id={fieldId}
          name="proof-note"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-describedby={`${helperId}${error ? ` ${errorId}` : ''}`}
          aria-invalid={Boolean(error)}
        />
        <p id={helperId} className="helper-text">
          Write a short note about what you did.
        </p>
        {error ? (
          <p id={errorId} className="error-text">
            {error}
          </p>
        ) : null}
      </div>
      <div className="button-row">
        <button className="button button-primary" type="submit">
          Mark done
        </button>
      </div>
    </form>
  );
}
