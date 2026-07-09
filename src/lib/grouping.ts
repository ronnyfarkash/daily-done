import { buildMonthCalendar, buildWeekCalendar } from './calendar';
import { compareLocalDates } from './date';
import { getTaskDisplayState } from './taskStatus';
import type {
  DaySummary,
  DayViewModel,
  MonthDaySummary,
  MonthViewModel,
  ScheduledTask,
  ScheduledTaskWithStatus,
  TaskStatus,
  WeekViewModel,
} from './types';

const STATUS_SORT: Record<TaskStatus, number> = {
  missed: 0,
  'due-today': 1,
  planned: 2,
  completed: 3,
};

export function groupTasksByDate(tasks: ScheduledTask[]): Map<string, ScheduledTask[]> {
  const grouped = new Map<string, ScheduledTask[]>();

  for (const task of tasks) {
    const existing = grouped.get(task.scheduledDate) ?? [];
    grouped.set(task.scheduledDate, [...existing, task]);
  }

  return grouped;
}

function sortTasksForDisplay(
  tasks: ScheduledTaskWithStatus[],
): ScheduledTaskWithStatus[] {
  return [...tasks].sort((a, b) => {
    const statusDifference = STATUS_SORT[a.status] - STATUS_SORT[b.status];
    if (statusDifference !== 0) {
      return statusDifference;
    }

    const dateDifference = compareLocalDates(a.task.scheduledDate, b.task.scheduledDate);
    if (dateDifference !== 0) {
      return dateDifference;
    }

    return a.task.createdAt.localeCompare(b.task.createdAt) || a.task.id.localeCompare(b.task.id);
  });
}

function countStatus(tasks: ScheduledTaskWithStatus[], status: TaskStatus): number {
  return tasks.filter((task) => task.status === status).length;
}

function summaryLabel(totalCount: number, completedCount: number): string {
  if (totalCount === 0) {
    return 'No tasks';
  }

  return `${completedCount} of ${totalCount} completed`;
}

function statusSummary(totalCount: number, completedCount: number): string {
  if (totalCount === 0) {
    return 'No tasks';
  }

  const taskLabel = totalCount === 1 ? 'task' : 'tasks';
  return `${totalCount} ${taskLabel}, ${completedCount} completed`;
}

export function buildDayView(
  tasks: ScheduledTask[],
  selectedDate: string,
  todayLocalDate: string,
): DayViewModel {
  const displayTasks = sortTasksForDisplay(
    tasks
      .filter((task) => task.scheduledDate === selectedDate)
      .map((task) => getTaskDisplayState(task, todayLocalDate)),
  );
  const totalCount = displayTasks.length;
  const completedCount = countStatus(displayTasks, 'completed');
  const plannedCount = countStatus(displayTasks, 'planned');
  const dueTodayCount = countStatus(displayTasks, 'due-today');
  const missedCount = countStatus(displayTasks, 'missed');

  return {
    date: selectedDate,
    tasks: displayTasks,
    totalCount,
    completedCount,
    incompleteCount: totalCount - completedCount,
    plannedCount,
    dueTodayCount,
    missedCount,
    hasMissedTasks: missedCount > 0,
    summaryLabel: summaryLabel(totalCount, completedCount),
  };
}

function buildDaySummary(
  tasks: ScheduledTask[],
  date: string,
  selectedDate: string,
  todayLocalDate: string,
): DaySummary {
  const dayView = buildDayView(tasks, date, todayLocalDate);

  return {
    date,
    tasks: dayView.tasks,
    totalCount: dayView.totalCount,
    completedCount: dayView.completedCount,
    incompleteCount: dayView.incompleteCount,
    plannedCount: dayView.plannedCount,
    dueTodayCount: dayView.dueTodayCount,
    missedCount: dayView.missedCount,
    statusSummary: statusSummary(dayView.totalCount, dayView.completedCount),
    isToday: date === todayLocalDate,
    isSelected: date === selectedDate,
  };
}

export function buildWeekView(
  tasks: ScheduledTask[],
  selectedDate: string,
  todayLocalDate: string,
): WeekViewModel {
  const calendar = buildWeekCalendar(selectedDate, todayLocalDate);

  return {
    startDate: calendar.startDate,
    endDate: calendar.endDate,
    days: calendar.days.map((day) => buildDaySummary(tasks, day.date, selectedDate, todayLocalDate)),
  };
}

function buildMonthDaySummary(
  tasks: ScheduledTask[],
  day: MonthDaySummary,
  selectedDate: string,
  todayLocalDate: string,
): MonthDaySummary {
  const summary = buildDaySummary(tasks, day.date, selectedDate, todayLocalDate);

  return {
    ...day,
    isToday: day.date === todayLocalDate,
    isSelected: day.date === selectedDate,
    totalCount: summary.totalCount,
    completedCount: summary.completedCount,
    incompleteCount: summary.incompleteCount,
    plannedCount: summary.plannedCount,
    dueTodayCount: summary.dueTodayCount,
    missedCount: summary.missedCount,
    statusSummary: summary.statusSummary,
  };
}

export function buildMonthView(
  tasks: ScheduledTask[],
  selectedDate: string,
  todayLocalDate: string,
): MonthViewModel {
  const calendar = buildMonthCalendar(selectedDate, selectedDate, todayLocalDate);
  const days = calendar.days.map((day) =>
    buildMonthDaySummary(tasks, day, selectedDate, todayLocalDate),
  );

  return {
    monthKey: calendar.monthKey,
    days,
    weeks: calendar.weeks.map((week) => ({
      startDate: week.startDate,
      endDate: week.endDate,
      days: week.days.map((weekDay) =>
        days.find((day) => day.date === weekDay.date) ?? weekDay,
      ),
    })),
  };
}
