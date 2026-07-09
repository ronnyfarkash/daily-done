import type { ViewMode } from '../lib/types';

interface ViewSwitcherProps {
  value: ViewMode;
  onChange(value: ViewMode): void;
}

const OPTIONS: Array<{ value: ViewMode; label: string }> = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
];

export function ViewSwitcher({ value, onChange }: ViewSwitcherProps) {
  return (
    <div className="view-switcher" aria-label="Calendar view">
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          className="view-switcher-button"
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
