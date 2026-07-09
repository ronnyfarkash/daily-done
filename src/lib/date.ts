const LOCAL_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

export function getLocalDateKey(date = new Date()): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function isValidLocalDateKey(localDate: string): boolean {
  if (!LOCAL_DATE_PATTERN.test(localDate)) {
    return false;
  }

  const parsed = parseLocalDateKey(localDate);
  return getLocalDateKey(parsed) === localDate;
}

export function parseLocalDateKey(localDate: string): Date {
  const [year, month, day] = localDate.split('-').map(Number);
  return new Date(year, month - 1, day, 12, 0, 0, 0);
}

export function addDays(localDate: string, amount: number): string {
  const date = parseLocalDateKey(localDate);
  date.setDate(date.getDate() + amount);
  return getLocalDateKey(date);
}

export function formatDateForDisplay(localDate: string): string {
  return parseLocalDateKey(localDate).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatTimeForDisplay(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function compareLocalDatesDesc(a: string, b: string): number {
  return b.localeCompare(a);
}
