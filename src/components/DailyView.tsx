import { formatDateForDisplay } from '../lib/date';
import type { DayViewModel } from '../lib/types';
import { TaskCard } from './TaskCard';
import type { TaskFormValues } from './TaskForm';

interface DailyViewProps {
  view: DayViewModel;
  proofTaskId: string | null;
  editingTaskId: string | null;
  onAddTask(): void;
  onVerify(taskId: string): void;
  onComplete(taskId: string, proofNote: string): void;
  onCancelProof(taskId: string): void;
  onEdit(taskId: string): void;
  onSaveEdit(taskId: string, values: TaskFormValues): void;
  onCancelEdit(taskId: string): void;
}

export function DailyView({
  view,
  proofTaskId,
  editingTaskId,
  onAddTask,
  onVerify,
  onComplete,
  onCancelProof,
  onEdit,
  onSaveEdit,
  onCancelEdit,
}: DailyViewProps) {
  const dateLabel = formatDateForDisplay(view.date);

  return (
    <section className="view-section" aria-labelledby="daily-view-title">
      <div className="view-header">
        <div>
          <p className="eyebrow">Daily view</p>
          <h2 id="daily-view-title" className="section-title focus-target" tabIndex={-1}>
            {dateLabel}
          </h2>
        </div>
        <button className="button button-primary" type="button" onClick={onAddTask}>
          Add task
        </button>
      </div>

      {view.tasks.length === 0 ? (
        <div className="card card-muted empty-state">
          <h3 className="card-title">No tasks for this day.</h3>
          <p className="helper-text">Plan one thing you want to verify.</p>
        </div>
      ) : (
        <div className="task-list">
          {view.tasks.map((item) => (
            <TaskCard
              key={item.task.id}
              item={item}
              proofOpen={proofTaskId === item.task.id}
              editing={editingTaskId === item.task.id}
              onVerify={onVerify}
              onComplete={onComplete}
              onCancelProof={onCancelProof}
              onEdit={onEdit}
              onSaveEdit={onSaveEdit}
              onCancelEdit={onCancelEdit}
            />
          ))}
        </div>
      )}

      <p className="summary-line">{view.summaryLabel}</p>
    </section>
  );
}
