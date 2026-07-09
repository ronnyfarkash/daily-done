import { RefObject, useEffect, useRef } from 'react';
import { formatTimeForDisplay } from '../lib/date';
import type { CompletionRecord } from '../lib/types';

interface CompletionSummaryProps {
  todayLabel: string;
  completion: CompletionRecord;
  activeTaskName?: string;
  changeButtonRef?: RefObject<HTMLButtonElement | null>;
  focusOnMount?: boolean;
  onChangeTask: () => void;
}

export function CompletionSummary({
  todayLabel,
  completion,
  activeTaskName,
  changeButtonRef,
  focusOnMount = false,
  onChangeTask,
}: CompletionSummaryProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const nextTaskDiffers =
    activeTaskName && activeTaskName !== completion.taskNameAtCompletion;

  useEffect(() => {
    if (focusOnMount) {
      headingRef.current?.focus();
    }
  }, [focusOnMount]);

  return (
    <section className="card" aria-labelledby="completed-title">
      <div className="stack">
        <p className="eyebrow">{todayLabel}</p>
        <h2
          id="completed-title"
          ref={headingRef}
          className="card-title focus-target"
          tabIndex={-1}
        >
          Completed today.
        </h2>
        <p className="status status-success">Completed today.</p>
        <p className="task-name">{completion.taskNameAtCompletion}</p>
        <p className="meta">Marked done at {formatTimeForDisplay(completion.completedAt)}</p>
        {nextTaskDiffers ? (
          <p className="meta">Next daily task: {activeTaskName}</p>
        ) : null}
      </div>
      <div>
        <p className="helper-text">Read-only proof note</p>
        <p className="readonly-note" aria-label="Read-only proof note">
          {completion.proofNote}
        </p>
      </div>
      <div className="button-row">
        <button
          ref={changeButtonRef}
          className="button button-secondary"
          type="button"
          onClick={onChangeTask}
        >
          Change task
        </button>
      </div>
    </section>
  );
}
