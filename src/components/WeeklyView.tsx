import { formatDateForDisplay, formatShortDate } from '../lib/date';
import type { DaySummary, WeekViewModel } from '../lib/types';

interface WeeklyViewProps {
  view: WeekViewModel;
  onAddTask(): void;
  onSelectDay(date: string): void;
}

function dayStatusClass(day: DaySummary): string {
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

function dayActionLabel(day: DaySummary): string {
  const titles = day.tasks.map((item) => item.task.title).join(', ');
  const titlePart = titles ? `. ${titles}` : '';

  return `Open ${formatDateForDisplay(day.date)} ${day.date}. ${day.statusSummary}${titlePart}`;
}

export function WeeklyView({ view, onAddTask, onSelectDay }: WeeklyViewProps) {
  const hasTasks = view.days.some((day) => day.totalCount > 0);

  return (
    <section className="view-section" aria-labelledby="weekly-view-title">
      <div className="view-header">
        <div>
          <p className="eyebrow">Weekly view</p>
          <h2 id="weekly-view-title" className="section-title focus-target" tabIndex={-1}>
            Week of {formatShortDate(view.startDate)}
          </h2>
        </div>
        <button className="button button-primary" type="button" onClick={onAddTask}>
          Add task
        </button>
      </div>

      {!hasTasks ? (
        <div className="card card-muted empty-state">
          <h3 className="card-title">No tasks planned this week.</h3>
          <p className="helper-text">Pick a day and add what you want to verify.</p>
        </div>
      ) : null}

      <div className="weekly-grid">
        {view.days.map((day) => (
          <section
            key={day.date}
            className={`week-day-card week-day-card-${dayStatusClass(day)}`}
            aria-labelledby={`week-day-${day.date}`}
          >
            <button
              className="day-card-button"
              type="button"
              onClick={() => onSelectDay(day.date)}
              aria-label={dayActionLabel(day)}
              aria-pressed={day.isSelected}
            >
              <span id={`week-day-${day.date}`} className="day-card-title">
                {formatShortDate(day.date)}
              </span>
              <span className="day-card-meta">
                {day.isToday ? `Today. ${day.statusSummary}` : day.statusSummary}
              </span>
            </button>

            {day.tasks.length > 0 ? (
              <ul className="task-preview-list" aria-label={`Tasks for ${formatDateForDisplay(day.date)}`}>
                {day.tasks.slice(0, 3).map((item) => (
                  <li key={item.task.id}>
                    <span className={`status-dot status-dot-${item.status}`} aria-hidden="true" />
                    <span>{item.task.title}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="helper-text">Nothing planned.</p>
            )}
          </section>
        ))}
      </div>
    </section>
  );
}
