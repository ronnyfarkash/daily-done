const LOCAL_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

export function getLocalDateKey(date = new Date()): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function parseLocalDateKey(localDate: string): Date {
  const [year, month, day] = localDate.split('-').map(Number);
  return new Date(year, month - 1, day, 12, 0, 0, 0);
}

export function isValidLocalDateKey(localDate: string): boolean {
  if (!LOCAL_DATE_PATTERN.test(localDate)) {
    return false;
  }

  const parsed = parseLocalDateKey(localDate);
  return getLocalDateKey(parsed) === localDate;
}

export function addDays(localDate: string, amount: number): string {
  const date = parseLocalDateKey(localDate);
  date.setDate(date.getDate() + amount);
  return getLocalDateKey(date);
}

export function compareLocalDates(a: string, b: string): number {
  return a.localeCompare(b);
}

export function compareLocalDatesDesc(a: string, b: string): number {
  return compareLocalDates(b, a);
}

export function getWeekDates(localDate: string): string[] {
  const date = parseLocalDateKey(localDate);
  const day = date.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const monday = addDays(localDate, mondayOffset);

  return Array.from({ length: 7 }, (_, index) => addDays(monday, index));
}

export function getMonthKey(localDate: string): string {
  return localDate.slice(0, 7);
}

export function getMonthStartDate(monthKey: string): string {
  const [year, month] = monthKey.split('-').map(Number);
  return getLocalDateKey(new Date(year, month - 1, 1, 12, 0, 0, 0));
}

export function getMonthEndDate(monthKey: string): string {
  const [year, month] = monthKey.split('-').map(Number);
  return getLocalDateKey(new Date(year, month, 0, 12, 0, 0, 0));
}

export function formatDateForDisplay(localDate: string): string {
  return parseLocalDateKey(localDate).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatShortDate(localDate: string): string {
  return parseLocalDateKey(localDate).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export function formatMonthForDisplay(monthKey: string): string {
  return parseLocalDateKey(`${monthKey}-01`).toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  });
}

export function formatTimeForDisplay(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });
}
