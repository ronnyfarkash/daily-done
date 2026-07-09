# Tasks: Multi-task Scheduling and Calendar Views

**Input**: Design documents from `/specs/002-multi-task-calendar/`

**Prerequisites**: `spec.md`, `plan.md`, `research.md`, `data-model.md`, `quickstart.md`, `ux-design-brief.md`, `checklists/quality.md`

**Tests**: Playwright E2E coverage is required for the critical flow. Vitest unit tests are required for local date helpers, calendar generation, task grouping, status derivation, validation, V2 storage, and V1 migration.

**Organization**: Tasks are grouped by user story so each story can be implemented and tested as an incremental slice. Shared domain, persistence, and shell work is completed first because every story depends on the V2 task-list model.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it touches different files and does not depend on an incomplete task.
- **[Story]**: Maps to the user story in `spec.md`.
- Every task includes exact file paths.

## Path Conventions

- App source: `src/`
- React components: `src/components/`
- Domain helpers: `src/lib/`
- Styles: `src/styles/`
- Unit tests: `tests/unit/`
- Playwright tests: `tests/e2e/`
- Feature artifacts: `specs/002-multi-task-calendar/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare the existing Vite/React/TypeScript app and test harness for V2 tasks without adding backend, auth, notifications, cloud sync, component-library, or calendar-library work.

- [ ] T001 Verify `package.json` retains the existing Vite, React, TypeScript, Vitest, and Playwright scripts and does not add backend, auth, notification, cloud sync, component-library, or calendar-library dependencies.
- [ ] T002 Update `tests/e2e/test-utils.ts` with helpers for clearing Daily Done storage, seeding `daily-done:v2`, seeding legacy `daily-done:v1`, deriving browser-local date keys, setting mobile/desktop viewports, and collecting console errors.
- [ ] T003 [P] Verify `playwright.config.ts` starts the existing Vite dev server for Playwright and keeps tests isolated from persisted browser state.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Replace the single-task domain foundation with the V2 local scheduled-task model, pure date/calendar helpers, localStorage persistence, and shared UI shell. No user story work should begin until this phase is complete.

**Critical**: These tasks intentionally create tests before implementation where practical. The first test tasks should fail until the matching helper files are implemented.

- [ ] T004 [P] Create or replace local-date unit tests in `tests/unit/date.test.ts` for local `YYYY-MM-DD` keys, parsing, comparison, add-days behavior, and Monday-through-Sunday week boundaries.
- [ ] T005 [P] Create calendar-generation unit tests in `tests/unit/calendar.test.ts` for selected-week generation, selected-month generation, leading/trailing month days, today flags, and selected-date flags.
- [ ] T006 [P] Create task-status unit tests in `tests/unit/task-status.test.ts` for `planned`, `due-today`, `missed`, `completed`, future completion blocking, and duplicate completion prevention by task id.
- [ ] T007 [P] Create grouping unit tests in `tests/unit/grouping.test.ts` for grouping tasks by local date, daily relevance sorting, day summaries, week summaries, and month summaries.
- [ ] T008 [P] Replace validation unit tests in `tests/unit/validation.test.ts` for trimmed task-title validation, scheduled-date validation, and 10-character trimmed proof-note validation.
- [ ] T009 [P] Replace V2 storage unit tests in `tests/unit/storage.test.ts` for reading/writing `daily-done:v2`, preserving task fields, handling unavailable localStorage, and not reporting failed writes as saved.
- [ ] T010 Define the V2 domain types in `src/lib/types.ts`, including `AppStateV2`, `ScheduledTask`, `TaskStatus`, `ScheduledTaskWithStatus`, `DayViewModel`, `DaySummary`, `WeekViewModel`, `MonthViewModel`, `MonthWeek`, `MonthDaySummary`, and storage-result types.
- [ ] T011 Implement local date helpers in `src/lib/date.ts` for browser-local today keys, key validation, parsing, comparison, add/subtract days, month keys, and Monday-through-Sunday week boundaries.
- [ ] T012 Implement lightweight calendar helpers in `src/lib/calendar.ts` for selected-week models and selected-month models without adding a calendar library.
- [ ] T013 Implement task status and completion guard helpers in `src/lib/taskStatus.ts` for derived status, completable/editable flags, duplicate-completion checks, and user-facing status labels.
- [ ] T014 Implement task grouping and derived view-model helpers in `src/lib/grouping.ts` for day, week, and month summaries based on `ScheduledTask.scheduledDate`.
- [ ] T015 Update validation helpers in `src/lib/validation.ts` for task title, scheduled date, proof note, and action-level completion validation.
- [ ] T016 Replace the storage adapter in `src/lib/storage.ts` with V2 localStorage read/write/update helpers that use `daily-done:v2` and return recoverable errors for read/write failures.
- [ ] T017 [P] Extend design tokens in `src/styles/tokens.css` for calm status surfaces, focus rings, compact task cards, calendar day cells, segmented controls, validation errors, and primary/secondary/quiet button hierarchy.
- [ ] T018 Update base layout and responsive primitives in `src/styles/global.css` for a 375px mobile-first single-column layout, constrained desktop width, wrapping long text, and no horizontal scrolling.
- [ ] T019 [P] Create the segmented view control component in `src/components/ViewSwitcher.tsx` with accessible labels, selected state, and keyboard-operable `Day`, `Week`, and `Month` options.
- [ ] T020 [P] Create the date navigation component in `src/components/DateNavigator.tsx` with accessible previous/next period controls, selected date/period text, and a `Today` action.
- [ ] T021 [P] Create the storage feedback component in `src/components/StorageAlert.tsx` for recoverable localStorage read/write/migration errors and retry copy.
- [ ] T022 Refactor `src/components/AppShell.tsx` to provide the calm app frame, header, skip-friendly main region, and mobile-first content container for the V2 views.
- [ ] T023 Refactor `src/App.tsx` to initialize V2 app state, selected local date, refreshed browser-local today state on load/page focus, default daily view mode, storage error handling, and shared handlers without reintroducing the old single-task settings model.

**Checkpoint**: V2 data, local date, grouping, storage, shell, and shared controls are ready for user-story implementation.

---

## Phase 3: User Story 1 - Plan and Verify Multiple Tasks for a Day (Priority: P1) MVP

**Goal**: A user can open the default daily view, create multiple tasks for one local date, verify each due task independently with a valid proof note, and see completed tasks as read-only.

**Independent Test**: Start with empty localStorage, create two tasks for today, attempt invalid proof notes, complete one task with a valid note, confirm only that task is completed and read-only, then reload and confirm the state persists.

### Tests for User Story 1

- [ ] T024 [US1] Create Playwright tests in `tests/e2e/multi-task-flows.spec.ts` for the default daily view empty state, creating two tasks for today, invalid proof-note validation, completing one due task independently, duplicate completion prevention, read-only completed proof, persistence after reload, keyboard operation for this flow, and console-error collection.

### Implementation for User Story 1

- [ ] T025 [US1] Create the add/edit task form component in `src/components/TaskForm.tsx` with visible `Task title` and `Scheduled date` labels, helper text, validation messages, `Save task`, `Cancel`, initial focus, and submit/cancel callbacks.
- [ ] T026 [US1] Create the proof-note component in `src/components/ProofNoteForm.tsx` for one open verification flow at a time, with visible `Proof note` label, helper text, validation errors, `Mark complete`, `Cancel`, and focus return on invalid notes.
- [ ] T027 [US1] Create the task card component in `src/components/TaskCard.tsx` with due-today and completed states, status text, independent `Verify` action, read-only proof display, no duplicate completion path, and accessible task action names.
- [ ] T028 [US1] Create the daily task view in `src/components/DailyView.tsx` with selected-date heading, daily empty state copy, one primary `Add task` action, compact task list, daily completion summary, and no horizontal scrolling at 375px.
- [ ] T029 [US1] Wire create-task, open-proof, cancel-proof, complete-task, duplicate-completion guard, and reload-safe persistence handlers in `src/App.tsx` for tasks scheduled on the selected local date.
- [ ] T030 [US1] Add daily-view, task-card, task-form, proof-form, completed-state, and validation-error styling in `src/styles/global.css`.
- [ ] T031 [US1] Run `npm run test -- --run tests/unit/date.test.ts tests/unit/task-status.test.ts tests/unit/grouping.test.ts tests/unit/validation.test.ts tests/unit/storage.test.ts` using `package.json` scripts and fix only failures related to the V2 daily-flow foundation in `src/lib/`.
- [ ] T032 [US1] Run `npx playwright test tests/e2e/multi-task-flows.spec.ts` and fix only US1 flow failures in `src/App.tsx`, `src/components/DailyView.tsx`, `src/components/TaskCard.tsx`, `src/components/TaskForm.tsx`, `src/components/ProofNoteForm.tsx`, `src/lib/storage.ts`, or `src/styles/global.css`.

**Checkpoint**: User Story 1 is a complete MVP slice for multiple due tasks and intentional per-task completion.

---

## Phase 4: User Story 2 - Schedule and Edit Future Tasks (Priority: P2)

**Goal**: A user can create and edit tasks for future local dates, see future tasks as planned, and cannot complete them before their scheduled date. Past incomplete tasks show as missed and remain completable.

**Independent Test**: Create a future task, navigate to that date, edit its title/date while incomplete, confirm it appears in the correct date view, confirm no early completion path exists before the scheduled date, seed or create a past incomplete task, and complete it as missed with a valid proof note.

### Tests for User Story 2

- [ ] T033 [US2] Extend `tests/e2e/multi-task-flows.spec.ts` with Playwright coverage for future task creation, future task editing, early-completion blocking, planned-state copy, missed-state display, missed-task completion, persistence after reload, keyboard operation for edit/cancel, and console-error collection.
- [ ] T034 [P] [US2] Extend `tests/unit/task-status.test.ts` with edge cases for future tasks that become due today when the supplied current local date changes, past incomplete tasks that are missed, and completed tasks that remain completed regardless of scheduled date.

### Implementation for User Story 2

- [ ] T035 [US2] Extend `src/components/TaskCard.tsx` with planned and missed task states, planned helper copy, missed `Still open` copy, edit action for incomplete tasks, and no future completion action.
- [ ] T036 [US2] Extend `src/components/TaskForm.tsx` to support editing incomplete task title and scheduled date, preserving entered values after validation errors and moving focus to the first invalid field.
- [ ] T037 [US2] Wire selected-date navigation, future task creation, incomplete task edits, rescheduling, refreshed local-today checks before completion, missed-task completion, and future completion rejection in `src/App.tsx`.
- [ ] T038 [US2] Extend `src/lib/storage.ts` with task update helpers that preserve `createdAt`, update `updatedAt`, reject edits to completed tasks, and persist rescheduled tasks under the same task id.
- [ ] T039 [US2] Extend `src/styles/global.css` with planned, missed, editing, blocked-completion, and long-title wrapping styles that remain calm and readable.
- [ ] T040 [US2] Run `npm run test -- --run tests/unit/task-status.test.ts tests/unit/validation.test.ts tests/unit/storage.test.ts` using `package.json` scripts and fix only US2 helper/storage failures in `src/lib/`.
- [ ] T041 [US2] Run `npx playwright test tests/e2e/multi-task-flows.spec.ts` and fix only future-task, missed-task, edit-flow, or locator/timing failures in `src/App.tsx`, `src/components/TaskCard.tsx`, `src/components/TaskForm.tsx`, `src/components/DateNavigator.tsx`, or `src/styles/global.css`.

**Checkpoint**: User Stories 1 and 2 support today, future, and missed task behavior without early completion.

---

## Phase 5: User Story 3 - Review Tasks by Week and Month (Priority: P3)

**Goal**: A user can switch between daily, weekly, and monthly views, see grouped task summaries, and select dates from week/month views to return to daily view for that local date.

**Independent Test**: Seed or create tasks across several dates, switch to weekly view, verify seven Monday-through-Sunday day sections, select a day into daily view, switch to monthly view, verify a lightweight month overview with task counts/status, and select a day into daily view.

### Tests for User Story 3

- [ ] T042 [US3] Create Playwright tests in `tests/e2e/calendar-views.spec.ts` for daily/week/month switching, weekly grouped days, Monday-through-Sunday order, weekly date selection into daily view, monthly overview counts/status, monthly date selection into daily view, empty week/month states with an `Add task` action, mobile 375px layout, desktop layout, keyboard date selection, and console-error collection.
- [ ] T043 [P] [US3] Extend `tests/unit/calendar.test.ts` with month boundary cases for adjacent-month days and selected month keys.
- [ ] T044 [P] [US3] Extend `tests/unit/grouping.test.ts` with week summary and month summary count/status cases for mixed planned, due-today, missed, and completed tasks.

### Implementation for User Story 3

- [ ] T045 [US3] Create the weekly planning view in `src/components/WeeklyView.tsx` with selected-week heading, previous/next week controls through `DateNavigator`, seven chronological day sections, task previews, empty state with one `Add task` action, status summaries, and accessible `Open <date>` day actions.
- [ ] T046 [US3] Create the monthly planning view in `src/components/MonthlyView.tsx` with selected-month heading, previous/next month controls through `DateNavigator`, lightweight grid or agenda overview, per-day task counts/status, empty state with one `Add task` action, and accessible day-selection actions.
- [ ] T047 [US3] Wire `ViewSwitcher`, daily/weekly/monthly mode changes, period navigation, and week/month day selection in `src/App.tsx`, ensuring selecting a week/month day sets `selectedDate` and opens daily view.
- [ ] T048 [US3] Extend `src/styles/global.css` with segmented control, weekly stack, monthly overview, tappable day cell, selected day, today marker, and responsive desktop layouts that do not become dashboard-like.
- [ ] T049 [US3] Verify all week and month day controls expose accessible date/count/status names in `src/components/WeeklyView.tsx` and `src/components/MonthlyView.tsx`.
- [ ] T050 [US3] Run `npm run test -- --run tests/unit/calendar.test.ts tests/unit/grouping.test.ts tests/unit/date.test.ts` using `package.json` scripts and fix only calendar/grouping failures in `src/lib/calendar.ts`, `src/lib/grouping.ts`, or `src/lib/date.ts`.
- [ ] T051 [US3] Run `npx playwright test tests/e2e/calendar-views.spec.ts` and fix only calendar-view behavior, responsive, keyboard, locator, or timing failures in `src/App.tsx`, `src/components/WeeklyView.tsx`, `src/components/MonthlyView.tsx`, `src/components/ViewSwitcher.tsx`, `src/components/DateNavigator.tsx`, or `src/styles/global.css`.

**Checkpoint**: Daily, weekly, and monthly views work as lightweight planning summaries with date selection back to daily view.

---

## Phase 6: User Story 4 - Preserve Existing Daily Done Data (Priority: P4)

**Goal**: A returning user with readable single-task `daily-done:v1` data can open the expanded app without crashes, false task state, or lost readable completion data.

**Independent Test**: Seed legacy V1 data with completions, load the app without V2 state, verify migrated completed tasks preserve date/title/proof/completed timestamp, verify today's active legacy task migrates only when no same-day completion exists, then seed corrupt V1 data and verify the app starts empty and usable.

### Tests for User Story 4

- [ ] T052 [US4] Create migration unit tests in `tests/unit/migration.test.ts` for readable V1 completions, active V1 settings, no extra same-day active task when today's completion exists, deterministic legacy ids, collision suffixes, corrupt V1 safe ignore, and V1 data left untouched.
- [ ] T053 [US4] Create Playwright tests in `tests/e2e/migration.spec.ts` for seeding readable `daily-done:v1`, loading with no V2 state, verifying migrated completed tasks in daily/week/month summaries, verifying no legacy streak/history panel requirement, seeding corrupt V1, verifying no crash or false tasks, and collecting console errors.

### Implementation for User Story 4

- [ ] T054 [US4] Implement V1-to-V2 migration helpers in `src/lib/migration.ts` for `daily-done:v1` parsing, readable completion conversion, active task conversion for today, deterministic ids, collision suffixes, corrupt-data safe ignore, and non-mutating V1 reads.
- [ ] T055 [US4] Integrate migration into the `src/lib/storage.ts` read path so V2 is read first, V1 is migrated only when V2 is absent, migrated V2 writes must succeed before reporting success, and corrupt legacy data starts from empty state safely.
- [ ] T056 [US4] Surface recoverable migration or storage write failures through `src/components/StorageAlert.tsx` and `src/App.tsx` without showing false saved or completed tasks.
- [ ] T057 [US4] Run `npm run test -- --run tests/unit/migration.test.ts tests/unit/storage.test.ts` using `package.json` scripts and fix only migration/storage failures in `src/lib/migration.ts` or `src/lib/storage.ts`.
- [ ] T058 [US4] Run `npx playwright test tests/e2e/migration.spec.ts` and fix only migration behavior, locator/timing, or storage-alert failures in `src/App.tsx`, `src/lib/storage.ts`, `src/lib/migration.ts`, `src/components/StorageAlert.tsx`, or `tests/e2e/test-utils.ts`.

**Checkpoint**: Legacy single-task data is migrated or ignored safely, and the expanded app remains usable.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Remove stale single-task assumptions, complete UX/accessibility polish from the design brief, and run final verification.

- [ ] T059 Remove obsolete one-task components and imports from `src/components/ChangeTaskConfirmation.tsx`, `src/components/CompletionSummary.tsx`, `src/components/HistoryList.tsx`, `src/components/TaskSetupForm.tsx`, `src/components/TodayCard.tsx`, and `src/App.tsx` after V2 components fully replace them.
- [ ] T060 Remove obsolete one-task domain helpers or update all imports from `src/lib/history.ts`, `src/lib/streak.ts`, `src/lib/types.ts`, and `src/lib/storage.ts` so the final code has no active single-task streak/history model.
- [ ] T061 Replace or delete obsolete one-task E2E specs in `tests/e2e/change-task.spec.ts`, `tests/e2e/configure-complete.spec.ts`, `tests/e2e/critical-flows.spec.ts`, and `tests/e2e/return-review.spec.ts` after equivalent V2 Playwright coverage exists.
- [ ] T062 Replace or delete obsolete one-task unit specs in `tests/unit/history.test.ts`, `tests/unit/streak.test.ts`, and `tests/unit/task-change.test.ts` after equivalent V2 unit coverage exists.
- [ ] T063 [P] Review all visible copy in `src/components/DailyView.tsx`, `src/components/WeeklyView.tsx`, `src/components/MonthlyView.tsx`, `src/components/TaskCard.tsx`, `src/components/TaskForm.tsx`, and `src/components/ProofNoteForm.tsx` against `specs/002-multi-task-calendar/ux-design-brief.md` for calm, focused, personal, trustworthy, and lightweight tone.
- [ ] T064 [P] Review mobile-first visual polish in `src/styles/tokens.css` and `src/styles/global.css` for generous spacing, soft hierarchy, minimal color, clear status differences, visible focus, button hierarchy, and no dashboard-like density.
- [ ] T065 Verify accessible labels, error associations, selected state, keyboard focus order, and read-only proof semantics across `src/components/ViewSwitcher.tsx`, `src/components/DateNavigator.tsx`, `src/components/TaskForm.tsx`, `src/components/ProofNoteForm.tsx`, `src/components/WeeklyView.tsx`, and `src/components/MonthlyView.tsx`.
- [ ] T066 Verify long task titles and proof notes wrap without overlap or horizontal scrolling at 375px by checking `src/styles/global.css` and the Playwright flows in `tests/e2e/multi-task-flows.spec.ts` and `tests/e2e/calendar-views.spec.ts`.
- [ ] T067 Run `npm run test` using `package.json` scripts and fix any remaining unit-test failures in `src/lib/date.ts`, `src/lib/calendar.ts`, `src/lib/grouping.ts`, `src/lib/taskStatus.ts`, `src/lib/validation.ts`, `src/lib/storage.ts`, or `src/lib/migration.ts`.
- [ ] T068 Run `npm run build` using `package.json` scripts and fix any TypeScript, Vite, or unused-file failures in `src/App.tsx`, `src/components/`, `src/lib/`, or `src/styles/`.
- [ ] T069 Run `npm run test:e2e` using `package.json` scripts and fix remaining product behavior failures in `src/` or locator/timing issues in `tests/e2e/`.
- [ ] T070 Run a real-browser UX QA pass with Playwright or `$playwright-interactive` using `specs/002-multi-task-calendar/ux-design-brief.md` to check 375px mobile, desktop, daily/weekly/monthly states, add task, validation, completion, persistence, migration, keyboard-only navigation, and console errors.
- [ ] T071 Complete the scope audit from `specs/002-multi-task-calendar/quickstart.md` and verify `package.json`, `src/`, and `tests/` contain no backend, auth, notifications, cloud sync, AI verification, sharing, recurring-task engine, drag-and-drop calendar, project-management, component-library, or large calendar-library additions; treat `specs/001-build-daily-done/` as legacy baseline/migration reference only, not as a blocker to the approved 002 multi-task scope.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1: Setup** has no prerequisites.
- **Phase 2: Foundational** depends on Phase 1 and blocks every user story.
- **Phase 3: US1** depends on Phase 2 and is the MVP.
- **Phase 4: US2** depends on Phase 2 and benefits from US1 task-card/form work.
- **Phase 5: US3** depends on Phase 2 and can proceed after shared date/grouping helpers exist.
- **Phase 6: US4** depends on Phase 2 and can proceed independently after V2 storage exists.
- **Phase 7: Polish** depends on the selected user stories being complete.

### User Story Dependencies

- **US1 (P1)**: Start after Foundation. Delivers the MVP and validates multiple same-day tasks plus per-task proof completion.
- **US2 (P2)**: Start after Foundation. Reuses US1 form/card patterns and adds future, edit, and missed behavior.
- **US3 (P3)**: Start after Foundation. Reuses calendar/grouping helpers and can be implemented in parallel with US2 or US4 after shared helpers exist.
- **US4 (P4)**: Start after Foundation. Reuses storage boundaries and can be implemented in parallel with US2 or US3 if files are coordinated.

### Within Each User Story

- Write the Playwright tests before implementation for that story.
- Write or extend unit tests before helper changes where practical.
- Implement domain logic before UI integration when UI depends on derived status or grouping.
- Implement UI components before app-level wiring when the component contract is clear.
- Run the story-specific unit and Playwright commands before moving to the next story.

---

## Parallel Opportunities

- Phase 2 test files T004 through T009 can be written in parallel.
- CSS tokens T017, shared controls T019 through T021, and shell work T022 can be worked on in parallel after shared type names are settled.
- US2 task-status tests T034 can run in parallel with US2 Playwright test extension T033.
- US3 unit tests T043 and T044 can run in parallel with US3 Playwright test T042.
- US3 components T045 and T046 can be built in parallel after `src/lib/calendar.ts` and `src/lib/grouping.ts` exist.
- US4 unit tests T052 and Playwright tests T053 can be written in parallel.
- Polish copy review T063 and visual polish T064 can run in parallel after core UI is implemented.

---

## Parallel Example: User Story 3

```text
Task: "T042 [US3] Create Playwright tests in tests/e2e/calendar-views.spec.ts"
Task: "T043 [P] [US3] Extend tests/unit/calendar.test.ts"
Task: "T044 [P] [US3] Extend tests/unit/grouping.test.ts"
```

After the tests exist and foundational helpers are implemented:

```text
Task: "T045 [US3] Create src/components/WeeklyView.tsx"
Task: "T046 [US3] Create src/components/MonthlyView.tsx"
```

---

## Implementation Strategy

### MVP First

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 (US1) only.
3. Validate with unit tests and `tests/e2e/multi-task-flows.spec.ts`.
4. Stop for review if only the MVP slice is desired.

### Incremental Delivery

1. Add US1 for multiple same-day tasks and proof-note verification.
2. Add US2 for future, edit, blocked early completion, and missed behavior.
3. Add US3 for weekly and monthly planning summaries.
4. Add US4 for V1 migration safety.
5. Complete polish and final verification.

### Scope Guard

- Do not create backend routes, server APIs, auth, accounts, database, cloud sync, notifications, AI verification, sharing, recurring tasks, drag-and-drop calendar behavior, project-management metadata, component libraries, or a large calendar dependency.
- Store all authoritative user data in browser localStorage.
- Keep daily view as the default and primary work surface.
- Keep weekly and monthly views lightweight summaries that select dates into daily view.
