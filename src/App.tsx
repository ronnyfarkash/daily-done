import { useEffect, useMemo, useState } from 'react';
import { AppShell } from './components/AppShell';
import { DailyView } from './components/DailyView';
import { DateNavigator } from './components/DateNavigator';
import { MonthlyView } from './components/MonthlyView';
import { StorageAlert } from './components/StorageAlert';
import { TaskForm, type TaskFormValues } from './components/TaskForm';
import { ViewSwitcher } from './components/ViewSwitcher';
import { WeeklyView } from './components/WeeklyView';
import { addDays, formatDateForDisplay, formatMonthForDisplay, getLocalDateKey, getMonthKey, parseLocalDateKey } from './lib/date';
import { buildDayView, buildMonthView, buildWeekView } from './lib/grouping';
import {
  addTask,
  completeTaskInState,
  createEmptyState,
  readAppState,
  updateTask,
  writeAppState,
} from './lib/storage';
import type { AppStateV2, StorageErrorInfo, ViewMode } from './lib/types';
import { validateScheduledDate } from './lib/validation';

function loadInitialState(todayLocalDate: string): {
  appState: AppStateV2;
  storageError: StorageErrorInfo | null;
} {
  const result = readAppState(undefined, todayLocalDate);

  if (result.ok) {
    return { appState: result.value, storageError: null };
  }

  return { appState: result.value, storageError: result.error };
}

function getInitialSelectedDate(state: AppStateV2, todayLocalDate: string): string {
  const savedDate = state.preferences?.lastSelectedDate;
  const savedDateResult = savedDate ? validateScheduledDate(savedDate) : null;

  return savedDateResult?.valid ? savedDateResult.value : todayLocalDate;
}

function shiftMonth(localDate: string, amount: number): string {
  const parsed = parseLocalDateKey(localDate);
  const day = parsed.getDate();

  parsed.setDate(1);
  parsed.setMonth(parsed.getMonth() + amount);

  const targetYear = parsed.getFullYear();
  const targetMonth = parsed.getMonth();
  const lastDay = new Date(targetYear, targetMonth + 1, 0, 12, 0, 0, 0).getDate();
  parsed.setDate(Math.min(day, lastDay));

  return getLocalDateKey(parsed);
}

function withSelectedDatePreference(state: AppStateV2, selectedDate: string): AppStateV2 {
  return {
    ...state,
    preferences: {
      ...state.preferences,
      lastSelectedDate: selectedDate,
    },
  };
}

export default function App() {
  const [todayLocalDate, setTodayLocalDate] = useState(() => getLocalDateKey());
  const [initialState] = useState(() => loadInitialState(todayLocalDate));
  const [appState, setAppState] = useState<AppStateV2>(initialState.appState);
  const [storageError, setStorageError] = useState<StorageErrorInfo | null>(
    initialState.storageError,
  );
  const [selectedDate, setSelectedDate] = useState(() =>
    getInitialSelectedDate(initialState.appState, todayLocalDate),
  );
  const [viewMode, setViewMode] = useState<ViewMode>('day');
  const [taskFormOpen, setTaskFormOpen] = useState(false);
  const [proofTaskId, setProofTaskId] = useState<string | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [pendingFocusSelector, setPendingFocusSelector] = useState<string | null>(null);

  useEffect(() => {
    function refreshToday() {
      setTodayLocalDate(getLocalDateKey());
    }

    window.addEventListener('focus', refreshToday);
    document.addEventListener('visibilitychange', refreshToday);

    return () => {
      window.removeEventListener('focus', refreshToday);
      document.removeEventListener('visibilitychange', refreshToday);
    };
  }, []);

  useEffect(() => {
    if (!pendingFocusSelector) {
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      document.querySelector<HTMLElement>(pendingFocusSelector)?.focus();
      setPendingFocusSelector(null);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [
    appState,
    editingTaskId,
    pendingFocusSelector,
    proofTaskId,
    selectedDate,
    taskFormOpen,
    viewMode,
  ]);

  const dayView = useMemo(
    () => buildDayView(appState.tasks, selectedDate, todayLocalDate),
    [appState.tasks, selectedDate, todayLocalDate],
  );
  const weekView = useMemo(
    () => buildWeekView(appState.tasks, selectedDate, todayLocalDate),
    [appState.tasks, selectedDate, todayLocalDate],
  );
  const monthView = useMemo(
    () => buildMonthView(appState.tasks, selectedDate, todayLocalDate),
    [appState.tasks, selectedDate, todayLocalDate],
  );

  const navigatorLabel = useMemo(() => {
    if (viewMode === 'month') {
      return formatMonthForDisplay(getMonthKey(selectedDate));
    }

    if (viewMode === 'week') {
      return `${formatDateForDisplay(weekView.startDate)} - ${formatDateForDisplay(weekView.endDate)}`;
    }

    return formatDateForDisplay(selectedDate);
  }, [selectedDate, viewMode, weekView.endDate, weekView.startDate]);

  function persist(nextState: AppStateV2, nextSelectedDate = selectedDate): boolean {
    const stateWithPreferences = withSelectedDatePreference(nextState, nextSelectedDate);
    const result = writeAppState(stateWithPreferences);

    if (!result.ok) {
      setStorageError(result.error);
      return false;
    }

    setAppState(stateWithPreferences);
    setSelectedDate(nextSelectedDate);
    setStorageError(null);
    setActionError(null);
    return true;
  }

  function handleRetryStorage() {
    const freshToday = getLocalDateKey();
    const result = readAppState(undefined, freshToday);

    setTodayLocalDate(freshToday);
    if (!result.ok) {
      setAppState(result.value);
      setStorageError(result.error);
      return;
    }

    setAppState(result.value);
    setSelectedDate(getInitialSelectedDate(result.value, freshToday));
    setStorageError(null);
  }

  function closeTaskForm() {
    setTaskFormOpen(false);
    setEditingTaskId(null);
    setPendingFocusSelector(focusSelectorForView(viewMode));
  }

  function focusSelectorForView(mode: ViewMode): string {
    if (mode === 'week') {
      return '#weekly-view-title';
    }

    if (mode === 'month') {
      return '#monthly-view-title';
    }

    return '#daily-view-title';
  }

  function focusSelectorForTask(taskId: string): string {
    return `[data-task-id="${taskId}"]`;
  }

  function openAddTask() {
    setProofTaskId(null);
    setEditingTaskId(null);
    setActionError(null);
    setTaskFormOpen(true);
  }

  function handleAddTask(values: TaskFormValues) {
    const nextState = addTask(appState, values);
    const nextSelectedDate = values.scheduledDate;
    const existingIds = new Set(appState.tasks.map((task) => task.id));
    const createdTask = nextState.tasks.find((task) => !existingIds.has(task.id));

    if (persist(nextState, nextSelectedDate)) {
      setViewMode('day');
      setTaskFormOpen(false);
      setPendingFocusSelector(
        createdTask ? focusSelectorForTask(createdTask.id) : focusSelectorForView('day'),
      );
    }
  }

  function handleEditTask(taskId: string) {
    setTaskFormOpen(false);
    setProofTaskId(null);
    setActionError(null);
    setEditingTaskId(taskId);
  }

  function handleSaveEdit(taskId: string, values: TaskFormValues) {
    try {
      const nextState = updateTask(appState, taskId, values);
      const nextSelectedDate = values.scheduledDate;

      if (persist(nextState, nextSelectedDate)) {
        setViewMode('day');
        setEditingTaskId(null);
        setPendingFocusSelector(focusSelectorForTask(taskId));
      }
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Daily Done could not save this task.');
    }
  }

  function handleVerify(taskId: string) {
    setTaskFormOpen(false);
    setEditingTaskId(null);
    setActionError(null);
    setProofTaskId(taskId);
  }

  function handleComplete(taskId: string, proofNote: string) {
    const freshToday = getLocalDateKey();
    setTodayLocalDate(freshToday);

    try {
      const nextState = completeTaskInState(appState, taskId, proofNote, freshToday);
      if (persist(nextState)) {
        setProofTaskId(null);
        setPendingFocusSelector(focusSelectorForTask(taskId));
      }
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Daily Done could not mark this task complete.');
    }
  }

  function changeSelectedDate(nextDate: string, nextViewMode = viewMode) {
    const nextState = withSelectedDatePreference(appState, nextDate);
    setSelectedDate(nextDate);
    setViewMode(nextViewMode);
    setTaskFormOpen(false);
    setEditingTaskId(null);
    setProofTaskId(null);
    setActionError(null);
    writeAppState(nextState);
    setAppState(nextState);
    setPendingFocusSelector(focusSelectorForView(nextViewMode));
  }

  function handlePreviousPeriod() {
    if (viewMode === 'month') {
      changeSelectedDate(shiftMonth(selectedDate, -1));
      return;
    }

    changeSelectedDate(addDays(selectedDate, viewMode === 'week' ? -7 : -1));
  }

  function handleNextPeriod() {
    if (viewMode === 'month') {
      changeSelectedDate(shiftMonth(selectedDate, 1));
      return;
    }

    changeSelectedDate(addDays(selectedDate, viewMode === 'week' ? 7 : 1));
  }

  function handleToday() {
    const freshToday = getLocalDateKey();
    setTodayLocalDate(freshToday);
    changeSelectedDate(freshToday);
  }

  function handleSelectDay(date: string) {
    changeSelectedDate(date, 'day');
  }

  function handleViewChange(nextViewMode: ViewMode) {
    setViewMode(nextViewMode);
    setTaskFormOpen(false);
    setEditingTaskId(null);
    setProofTaskId(null);
    setActionError(null);
    setPendingFocusSelector(focusSelectorForView(nextViewMode));
  }

  return (
    <AppShell>
      {storageError ? <StorageAlert error={storageError} onRetry={handleRetryStorage} /> : null}

      {actionError ? (
        <section className="alert" role="alert" aria-live="assertive">
          <p>{actionError}</p>
        </section>
      ) : null}

      <section className="control-panel" aria-label="Planning controls">
        <ViewSwitcher value={viewMode} onChange={handleViewChange} />
        <DateNavigator
          mode={viewMode}
          label={navigatorLabel}
          onPrevious={handlePreviousPeriod}
          onNext={handleNextPeriod}
          onToday={handleToday}
        />
      </section>

      {taskFormOpen ? (
        <TaskForm
          title="Add task"
          initialDate={selectedDate}
          submitLabel="Save task"
          onSubmit={handleAddTask}
          onCancel={closeTaskForm}
        />
      ) : null}

      {viewMode === 'day' ? (
        <DailyView
          view={dayView}
          proofTaskId={proofTaskId}
          editingTaskId={editingTaskId}
          onAddTask={openAddTask}
          onVerify={handleVerify}
          onComplete={handleComplete}
          onCancelProof={(taskId) => {
            setProofTaskId(null);
            setPendingFocusSelector(focusSelectorForTask(taskId));
          }}
          onEdit={handleEditTask}
          onSaveEdit={handleSaveEdit}
          onCancelEdit={(taskId) => {
            setEditingTaskId(null);
            setPendingFocusSelector(focusSelectorForTask(taskId));
          }}
        />
      ) : null}

      {viewMode === 'week' ? (
        <WeeklyView view={weekView} onAddTask={openAddTask} onSelectDay={handleSelectDay} />
      ) : null}

      {viewMode === 'month' ? (
        <MonthlyView view={monthView} onAddTask={openAddTask} onSelectDay={handleSelectDay} />
      ) : null}
    </AppShell>
  );
}
