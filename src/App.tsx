import { useRef, useState } from 'react';
import { AppShell } from './components/AppShell';
import { ChangeTaskConfirmation } from './components/ChangeTaskConfirmation';
import { CompletionSummary } from './components/CompletionSummary';
import { HistoryList } from './components/HistoryList';
import { TaskSetupForm } from './components/TaskSetupForm';
import { TodayCard } from './components/TodayCard';
import { formatDateForDisplay, getLocalDateKey } from './lib/date';
import { getRecentCompletions } from './lib/history';
import {
  addCompletion,
  changeTask,
  findCompletionForDate,
  readAppState,
  setTaskSettings,
  writeAppState,
} from './lib/storage';
import { calculateCurrentStreak } from './lib/streak';
import type { AppState, StorageErrorInfo } from './lib/types';
import { validateProofNote, validateTaskName } from './lib/validation';

function loadInitialState(): { appState: AppState; storageError: StorageErrorInfo | null } {
  const result = readAppState();

  if (result.ok) {
    return { appState: result.value, storageError: null };
  }

  return { appState: result.value, storageError: result.error };
}

export default function App() {
  const [initialState] = useState(loadInitialState);
  const [appState, setAppState] = useState<AppState>(initialState.appState);
  const [storageError, setStorageError] = useState<StorageErrorInfo | null>(
    initialState.storageError,
  );
  const [setupOpen, setSetupOpen] = useState(false);
  const [completedJustNow, setCompletedJustNow] = useState(false);
  const [taskDraft, setTaskDraft] = useState(appState.settings?.taskName ?? '');
  const [taskError, setTaskError] = useState<string | null>(null);
  const [proofDraft, setProofDraft] = useState('');
  const [proofError, setProofError] = useState<string | null>(null);
  const [changeTaskOpen, setChangeTaskOpen] = useState(false);
  const [changeTaskDraft, setChangeTaskDraft] = useState(appState.settings?.taskName ?? '');
  const [changeTaskError, setChangeTaskError] = useState<string | null>(null);

  const taskInputRef = useRef<HTMLInputElement>(null);
  const proofInputRef = useRef<HTMLTextAreaElement>(null);
  const changeTaskInputRef = useRef<HTMLInputElement>(null);
  const changeTaskButtonRef = useRef<HTMLButtonElement>(null);

  const todayLocalDate = getLocalDateKey();
  const todayLabel = formatDateForDisplay(todayLocalDate);
  const todayCompletion = findCompletionForDate(appState, todayLocalDate);
  const recentCompletions = getRecentCompletions(appState.completions);
  const streak = calculateCurrentStreak(appState.completions, todayLocalDate);

  function persist(nextState: AppState): boolean {
    const result = writeAppState(nextState);

    if (!result.ok) {
      setStorageError(result.error);
      return false;
    }

    setAppState(nextState);
    setStorageError(null);
    return true;
  }

  function handleRetryStorage() {
    const result = readAppState();

    if (!result.ok) {
      setStorageError(result.error);
      return;
    }

    setAppState(result.value);
    setTaskDraft(result.value.settings?.taskName ?? '');
    setChangeTaskDraft(result.value.settings?.taskName ?? '');
    setStorageError(null);
  }

  function openSetup() {
    setTaskDraft(appState.settings?.taskName ?? '');
    setTaskError(null);
    setSetupOpen(true);
  }

  function saveTask() {
    const validation = validateTaskName(taskDraft);

    if (!validation.valid) {
      setTaskError(validation.error);
      taskInputRef.current?.focus();
      return;
    }

    const nextState = setTaskSettings(appState, validation.value);

    if (persist(nextState)) {
      setTaskDraft(validation.value);
      setSetupOpen(false);
      setTaskError(null);
      setCompletedJustNow(false);
      window.requestAnimationFrame(() => proofInputRef.current?.focus());
    }
  }

  function completeToday() {
    const validation = validateProofNote(proofDraft);

    if (!validation.valid) {
      setProofError(validation.error);
      proofInputRef.current?.focus();
      return;
    }

    const completionDate = getLocalDateKey();
    const nextState = addCompletion(appState, completionDate, validation.value);

    if (persist(nextState)) {
      setProofDraft('');
      setProofError(null);
      setCompletedJustNow(true);
    }
  }

  function openChangeTask() {
    setChangeTaskDraft(appState.settings?.taskName ?? '');
    setChangeTaskError(null);
    setChangeTaskOpen(true);
  }

  function cancelChangeTask() {
    setChangeTaskOpen(false);
    setChangeTaskError(null);
    window.requestAnimationFrame(() => changeTaskButtonRef.current?.focus());
  }

  function confirmChangeTask() {
    const validation = validateTaskName(changeTaskDraft);

    if (!validation.valid) {
      setChangeTaskError(validation.error);
      changeTaskInputRef.current?.focus();
      return;
    }

    const nextState = changeTask(appState, validation.value);

    if (persist(nextState)) {
      setChangeTaskDraft(validation.value);
      setTaskDraft(validation.value);
      setChangeTaskOpen(false);
      setChangeTaskError(null);
      window.requestAnimationFrame(() => changeTaskButtonRef.current?.focus());
    }
  }

  const isFirstRun = !appState.settings;
  const showSetupForm = setupOpen;

  return (
    <AppShell>
      {storageError ? (
        <section className="alert" role="alert" aria-live="assertive">
          <p>{storageError.message}</p>
          <div className="button-row">
            <button className="button button-secondary" type="button" onClick={handleRetryStorage}>
              Retry
            </button>
          </div>
        </section>
      ) : null}

      {isFirstRun && !setupOpen ? (
        <section className="card" aria-labelledby="empty-title">
          <div className="stack">
            <h2 id="empty-title" className="card-title">
              No daily task yet.
            </h2>
            <p className="helper-text">Choose the one thing you want to verify each day.</p>
            <p className="history-note">Your completions will appear here after you finish a day.</p>
          </div>
          <div className="button-row">
            <button className="button button-primary" type="button" onClick={openSetup}>
              Set daily task
            </button>
          </div>
        </section>
      ) : null}

      {showSetupForm ? (
        <TaskSetupForm
          title={appState.settings ? 'Edit daily task' : 'Set your daily task'}
          value={taskDraft}
          submitLabel={appState.settings ? 'Save task' : 'Save task'}
          error={taskError}
          inputRef={taskInputRef}
          autoFocus={setupOpen || isFirstRun}
          onChange={setTaskDraft}
          onSubmit={saveTask}
          onCancel={appState.settings ? () => setSetupOpen(false) : undefined}
        />
      ) : null}

      {appState.settings && !setupOpen && todayCompletion ? (
        <CompletionSummary
          todayLabel={todayLabel}
          completion={todayCompletion}
          activeTaskName={appState.settings.taskName}
          changeButtonRef={changeTaskButtonRef}
          focusOnMount={completedJustNow}
          onChangeTask={openChangeTask}
        />
      ) : null}

      {appState.settings && !setupOpen && !todayCompletion ? (
        <TodayCard
          todayLabel={todayLabel}
          taskName={appState.settings.taskName}
          proofNote={proofDraft}
          proofError={proofError}
          proofInputRef={proofInputRef}
          onProofChange={setProofDraft}
          onComplete={completeToday}
          onEditTask={openSetup}
        />
      ) : null}

      {changeTaskOpen ? (
        <ChangeTaskConfirmation
          value={changeTaskDraft}
          error={changeTaskError}
          inputRef={changeTaskInputRef}
          onChange={setChangeTaskDraft}
          onConfirm={confirmChangeTask}
          onCancel={cancelChangeTask}
        />
      ) : null}

      {!isFirstRun || appState.completions.length > 0 ? (
        <HistoryList completions={recentCompletions} streak={streak} />
      ) : null}
    </AppShell>
  );
}
