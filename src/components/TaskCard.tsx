import { formatDateForDisplay, formatTimeForDisplay } from '../lib/date';
import type { ScheduledTaskWithStatus } from '../lib/types';
import { ProofNoteForm } from './ProofNoteForm';
import { TaskForm, type TaskFormValues } from './TaskForm';

interface TaskCardProps {
  item: ScheduledTaskWithStatus;
  proofOpen: boolean;
  editing: boolean;
  onVerify(taskId: string): void;
  onComplete(taskId: string, proofNote: string): void;
  onCancelProof(taskId: string): void;
  onEdit(taskId: string): void;
  onSaveEdit(taskId: string, values: TaskFormValues): void;
  onCancelEdit(taskId: string): void;
}

export function taskSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function TaskCard({
  item,
  proofOpen,
  editing,
  onVerify,
  onComplete,
  onCancelProof,
  onEdit,
  onSaveEdit,
  onCancelEdit,
}: TaskCardProps) {
  const { task, status, statusLabel, isCompletable, isEditable } = item;
  const scheduledDateLabel = formatDateForDisplay(task.scheduledDate);

  if (editing) {
    return (
      <TaskForm
        title={`Edit ${task.title}`}
        initialTitle={task.title}
        initialDate={task.scheduledDate}
        onSubmit={(values) => onSaveEdit(task.id, values)}
        onCancel={() => onCancelEdit(task.id)}
      />
    );
  }

  return (
    <article
      className={`task-card task-card-${status}`}
      data-testid={`task-card-${taskSlug(task.title)}`}
      data-task-id={task.id}
      aria-labelledby={`task-${task.id}-title`}
      tabIndex={-1}
    >
      <div className="task-card-main">
        <div className="stack-tight">
          <p className="status-label">{statusLabel}</p>
          <h3 id={`task-${task.id}-title`} className="task-title">
            {task.title}
          </h3>
          <p className="meta">{scheduledDateLabel}</p>
          {status === 'planned' ? (
            <p className="helper-text">Available on its scheduled date.</p>
          ) : null}
          {status === 'missed' ? <p className="helper-text">Still open</p> : null}
          {status === 'completed' && task.completedAt ? (
            <p className="helper-text">Completed at {formatTimeForDisplay(task.completedAt)}</p>
          ) : null}
        </div>
        <div className="task-actions">
          {isCompletable ? (
            <button
              className="button button-secondary"
              type="button"
              onClick={() => onVerify(task.id)}
              aria-label={`Verify ${task.title}`}
            >
              Verify
            </button>
          ) : null}
          {isEditable ? (
            <button
              className="button button-quiet"
              type="button"
              onClick={() => onEdit(task.id)}
              aria-label={`Edit ${task.title}`}
            >
              Edit
            </button>
          ) : null}
        </div>
      </div>

      {proofOpen ? (
        <ProofNoteForm
          taskTitle={task.title}
          scheduledDateLabel={scheduledDateLabel}
          onSubmit={(proofNote) => onComplete(task.id, proofNote)}
          onCancel={() => onCancelProof(task.id)}
        />
      ) : null}

      {status === 'completed' && task.proofNote ? (
        <div className="readonly-section">
          <p className="helper-text">Proof note, read-only</p>
          <p className="readonly-note">{task.proofNote}</p>
        </div>
      ) : null}
    </article>
  );
}
