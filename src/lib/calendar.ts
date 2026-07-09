import {
  addDays,
  getMonthEndDate,
  getMonthKey,
  getMonthStartDate,
  getWeekDates,
  parseLocalDateKey,
} from './date';
import type { DaySummary, MonthDaySummary, MonthViewModel, MonthWeek, WeekViewModel } from './types';

function emptyStatusSummary(totalCount = 0, completedCount = 0): string {
  if (totalCount === 0) {
    return 'No tasks';
  }

  const taskLabel = totalCount === 1 ? 'task' : 'tasks';
  return `${totalCount} ${taskLabel}, ${completedCount} completed`;
}

function emptyDaySummary(date: string, selectedDate: string, todayLocalDate: string): DaySummary {
  return {
    date,
    tasks: [],
    totalCount: 0,
    completedCount: 0,
    incompleteCount: 0,
    plannedCount: 0,
    dueTodayCount: 0,
    missedCount: 0,
    statusSummary: emptyStatusSummary(),
    isToday: date === todayLocalDate,
    isSelected: date === selectedDate,
  };
}

export function buildWeekCalendar(selectedDate: string, todayLocalDate: string): WeekViewModel {
  const dates = getWeekDates(selectedDate);

  return {
    startDate: dates[0],
    endDate: dates[6],
    days: dates.map((date) => emptyDaySummary(date, selectedDate, todayLocalDate)),
  };
}

export function getMonthGridDates(monthKey: string): string[] {
  const monthStart = getMonthStartDate(monthKey);
  const monthEnd = getMonthEndDate(monthKey);
  const gridStart = getWeekDates(monthStart)[0];
  const gridEnd = getWeekDates(monthEnd)[6];
  const dates: string[] = [];

  for (let date = gridStart; date <= gridEnd; date = addDays(date, 1)) {
    dates.push(date);
  }

  return dates;
}

function emptyMonthDaySummary(
  date: string,
  selectedMonthKey: string,
  selectedDate: string,
  todayLocalDate: string,
): MonthDaySummary {
  return {
    date,
    dayNumber: parseLocalDateKey(date).getDate(),
    monthKey: getMonthKey(date),
    isInSelectedMonth: getMonthKey(date) === selectedMonthKey,
    isToday: date === todayLocalDate,
    isSelected: date === selectedDate,
    totalCount: 0,
    completedCount: 0,
    incompleteCount: 0,
    plannedCount: 0,
    dueTodayCount: 0,
    missedCount: 0,
    statusSummary: emptyStatusSummary(),
  };
}

export function buildMonthCalendar(
  monthKeyOrSelectedDate: string,
  selectedDate: string,
  todayLocalDate: string,
): MonthViewModel {
  const monthKey = monthKeyOrSelectedDate.length === 7
    ? monthKeyOrSelectedDate
    : getMonthKey(monthKeyOrSelectedDate);
  const days = getMonthGridDates(monthKey).map((date) =>
    emptyMonthDaySummary(date, monthKey, selectedDate, todayLocalDate),
  );
  const weeks: MonthWeek[] = [];

  for (let index = 0; index < days.length; index += 7) {
    const weekDays = days.slice(index, index + 7);
    weeks.push({
      startDate: weekDays[0].date,
      endDate: weekDays[6].date,
      days: weekDays,
    });
  }

  return { monthKey, weeks, days };
}
