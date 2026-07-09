import { formatDateForDisplay, formatMonthForDisplay } from '../lib/date';
import type { MonthDaySummary, MonthViewModel } from '../lib/types';

interface MonthlyViewProps {
  view: MonthViewModel;
  onAddTask(): void;
  onSelectDay(date: string): void;
}

const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function monthStatusClass(day: MonthDaySummary): string {
  if (day.missedCount > 0) {
    return 'missed';
  }
  if (day.dueTodayCount > 0) {
    return 'due-today';
  }
  if (day.plannedCount > 0) {
    return 'planned';
  }
  if (day.completedCount > 0) {
    return 'completed';
  }
  return 'empty';
}

function dayActionLabel(day: MonthDaySummary): string {
  return `Open ${formatDateForDisplay(day.date)} ${day.date}. ${day.statusSummary}`;
}

function visibleStatusSummary(day: MonthDaySummary): string {
  if (day.totalCount === 0) {
    return 'No tasks';
  }

  if (day.completedCount > 0 && day.incompleteCount > 0) {
    return `${day.completedCount} done, ${day.incompleteCount} open`;
  }

  if (day.completedCount === day.totalCount) {
    return 'All done';
  }

  if (day.missedCount > 0) {
    return 'Missed';
  }

  if (day.dueTodayCount > 0) {
    return 'Due today';
  }

  if (day.plannedCount > 0) {
    return `${day.plannedCount} planned`;
  }

  return `${day.incompleteCount} open`;
}

export function MonthlyView({ view, onAddTask, onSelectDay }: MonthlyViewProps) {
  const hasTasks = view.days.some((day) => day.isInSelectedMonth && day.totalCount > 0);

  return (
    <section className="view-section" aria-labelledby="monthly-view-title">
      <div className="view-header">
        <div>
          <p className="eyebrow">Monthly view</p>
          <h2 id="monthly-view-title" className="section-title focus-target" tabIndex={-1}>
            Month overview: {formatMonthForDisplay(view.monthKey)}
          </h2>
        </div>
        <button className="button button-primary" type="button" onClick={onAddTask}>
          Add task
        </button>
      </div>

      {!hasTasks ? (
        <div className="card card-muted empty-state">
          <h3 className="card-title">No tasks planned this month.</h3>
          <p className="helper-text">Add one task to start shaping the month.</p>
        </div>
      ) : null}

      <div className="month-grid" aria-label={formatMonthForDisplay(view.monthKey)}>
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className="month-weekday">
            {label}
          </div>
        ))}

        {view.days.map((day) => {
          return (
            <button
              key={day.date}
              className={`month-day-button month-day-${monthStatusClass(day)} ${
                day.isInSelectedMonth ? '' : 'month-day-muted'
              }`}
              type="button"
              onClick={() => onSelectDay(day.date)}
              aria-label={dayActionLabel(day)}
              aria-current={day.isToday ? 'date' : undefined}
              aria-pressed={day.isSelected}
            >
              <span className="month-day-number">{day.dayNumber}</span>
              {day.totalCount > 0 ? (
                <span className="month-day-count">
                  {day.totalCount} {day.totalCount === 1 ? 'task' : 'tasks'}
                </span>
              ) : (
                <span className="month-day-count">No tasks</span>
              )}
              <span className="month-day-status">{visibleStatusSummary(day)}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
