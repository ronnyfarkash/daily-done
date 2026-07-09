import type { RefObject } from 'react';
import { ProofNoteForm } from './ProofNoteForm';

interface TodayCardProps {
  todayLabel: string;
  taskName: string;
  proofNote: string;
  proofError?: string | null;
  proofInputRef?: RefObject<HTMLTextAreaElement | null>;
  onProofChange: (value: string) => void;
  onComplete: () => void;
  onEditTask: () => void;
}

export function TodayCard({
  todayLabel,
  taskName,
  proofNote,
  proofError,
  proofInputRef,
  onProofChange,
  onComplete,
  onEditTask,
}: TodayCardProps) {
  return (
    <section className="card" aria-labelledby="today-title">
      <div className="stack">
        <p className="eyebrow">{todayLabel}</p>
        <h2 id="today-title" className="card-title">
          Today
        </h2>
        <p className="task-name">{taskName}</p>
        <p className="status status-incomplete">Not completed today.</p>
      </div>
      <ProofNoteForm
        value={proofNote}
        error={proofError}
        inputRef={proofInputRef}
        onChange={onProofChange}
        onSubmit={onComplete}
      />
      <div className="button-row">
        <button className="button button-quiet" type="button" onClick={onEditTask}>
          Edit task
        </button>
      </div>
    </section>
  );
}
