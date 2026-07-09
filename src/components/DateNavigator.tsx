import type { ViewMode } from '../lib/types';

interface DateNavigatorProps {
  mode: ViewMode;
  label: string;
  onPrevious(): void;
  onNext(): void;
  onToday(): void;
}

function periodLabel(mode: ViewMode): string {
  if (mode === 'week') {
    return 'week';
  }
  if (mode === 'month') {
    return 'month';
  }
  return 'day';
}

export function DateNavigator({
  mode,
  label,
  onPrevious,
  onNext,
  onToday,
}: DateNavigatorProps) {
  const period = periodLabel(mode);

  return (
    <div className="date-navigator" aria-label={`${period} navigation`}>
      <button
        className="icon-button"
        type="button"
        onClick={onPrevious}
        aria-label={`Previous ${period}`}
      >
        <span aria-hidden="true">&lt;</span>
      </button>
      <p className="date-label">{label}</p>
      <button
        className="icon-button"
        type="button"
        onClick={onNext}
        aria-label={`Next ${period}`}
      >
        <span aria-hidden="true">&gt;</span>
      </button>
      <button className="button button-secondary button-small" type="button" onClick={onToday}>
        Today
      </button>
    </div>
  );
}
