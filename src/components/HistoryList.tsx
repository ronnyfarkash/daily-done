import { formatDateForDisplay, formatTimeForDisplay } from '../lib/date';
import type { CompletionRecord, CurrentStreak } from '../lib/types';

interface HistoryListProps {
  completions: CompletionRecord[];
  streak: CurrentStreak;
}

export function HistoryList({ completions, streak }: HistoryListProps) {
  const dayLabel = streak.count === 1 ? 'day' : 'days';

  return (
    <section className="history-layout" aria-label="History and streak">
      <div className="card card-muted streak-card">
        <h2 className="section-title">Current streak</h2>
        <p className="streak-count" data-testid="streak-count">
          {streak.count} {dayLabel}
        </p>
        <p className="meta">
          {streak.throughDate
            ? `Through ${formatDateForDisplay(streak.throughDate)}`
            : 'Complete a day to start your streak.'}
        </p>
      </div>
      <div className="card card-muted">
        <h2 className="section-title">Recent completions</h2>
        {completions.length === 0 ? (
          <p className="history-note">Complete a day to start your history.</p>
        ) : (
          <ol className="history-list" data-testid="history-list">
            {completions.map((completion) => (
              <li
                key={completion.localDate}
                className="history-item"
                data-testid="history-item"
              >
                <p className="history-title">
                  {formatDateForDisplay(completion.localDate)}
                </p>
                <p className="meta">
                  {completion.taskNameAtCompletion} at{' '}
                  {formatTimeForDisplay(completion.completedAt)}
                </p>
                <p className="history-note">{completion.proofNote}</p>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
