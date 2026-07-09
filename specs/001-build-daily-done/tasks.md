# Tasks: Build Daily Done

**Input**: Design documents from `/specs/001-build-daily-done/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [quickstart.md](./quickstart.md), [ux-design-brief.md](./ux-design-brief.md), [checklists/quality.md](./checklists/quality.md)

**Tests**: Playwright E2E coverage for the critical flow is required. Add focused Vitest unit tests for date, streak, validation, history, and storage behavior.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it touches different files and has no dependency on another incomplete task.
- **[Story]**: User story label for story phases only: `[US1]`, `[US2]`, `[US3]`.
- Every task includes exact repository-relative file paths.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Add a Vite React TypeScript scaffold safely without overwriting Spec Kit files.

- [X] T001 Update `package.json` with Vite, React, TypeScript, Vitest, Playwright scripts (`dev`, `build`, `test`, `test:e2e`) and keep dependencies minimal
- [X] T002 [P] Create `index.html` with the Daily Done root element and mobile viewport metadata
- [X] T003 [P] Create `tsconfig.json` and `tsconfig.node.json` for a Vite React TypeScript app
- [X] T004 [P] Create `vite.config.ts` with React plugin configuration and Vitest unit-test configuration
- [X] T005 [P] Update `playwright.config.ts` with Vite `webServer`, `baseURL`, Chromium desktop project, and 375px mobile project
- [X] T006 [P] Create `tests/e2e/test-utils.ts` with Daily Done localStorage key helpers, storage clearing, seeded state setup, and console-error collection

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish shared domain, persistence, styling, and app shell foundations before user stories.

**Critical**: No user story implementation should begin until this phase is complete.

- [X] T007 [P] Create shared data types for `AppState`, `DailyTaskSettings`, `CompletionRecord`, and storage results in `src/lib/types.ts`
- [X] T008 [P] Create failing unit tests for deterministic local date key behavior in `tests/unit/date.test.ts`
- [X] T009 [P] Create failing unit tests for current streak rules using explicit `todayLocalDate` inputs in `tests/unit/streak.test.ts`
- [X] T010 [P] Create failing unit tests for task-name and proof-note validation in `tests/unit/validation.test.ts`
- [X] T011 [P] Create failing unit tests for localStorage read/write, corrupt payloads, unavailable storage, and duplicate localDate rejection in `tests/unit/storage.test.ts`
- [X] T012 Implement local date helpers with explicit reference-date support in `src/lib/date.ts`
- [X] T013 Implement streak calculation helpers from local date keys in `src/lib/streak.ts`
- [X] T014 [P] Implement task-name and proof-note validation helpers in `src/lib/validation.ts`
- [X] T015 Implement localStorage persistence adapter with stable key `daily-done:v1`, recoverable error results, and no false saved state in `src/lib/storage.ts`
- [X] T016 [P] Create CSS design tokens for color, spacing, type, radius, borders, focus rings, and button hierarchy in `src/styles/tokens.css`
- [X] T017 Create mobile-first global styles, accessible focus styles, form states, cards, and responsive constraints in `src/styles/global.css`
- [X] T018 [P] Create React entry point importing global styles in `src/main.tsx`
- [X] T019 [P] Create the calm centered layout shell component in `src/components/AppShell.tsx`
- [X] T020 Create the initial app state orchestration skeleton with visible storage error, retry path, input preservation where possible, and storage load/error handling in `src/App.tsx`

**Checkpoint**: Foundation ready. User story implementation can now proceed in priority order.

---

## Phase 3: User Story 1 - Configure and Complete Today (Priority: P1) MVP

**Goal**: A new user can configure one daily task, enter a valid proof note, and complete today with a read-only completed state.

**Independent Test**: Start with empty localStorage, configure a task, submit empty and too-short proof notes, submit a valid note, and see the completed state for today's local date.

### Tests for User Story 1

- [X] T021 [P] [US1] Create failing Playwright test for first-time setup, invalid proof-note validation, successful completion, accessible labels, and console-error capture in `tests/e2e/configure-complete.spec.ts`

### Implementation for User Story 1

- [X] T022 [P] [US1] Create empty state and daily task setup form with visible `Daily task` label in `src/components/TaskSetupForm.tsx`
- [X] T023 [P] [US1] Create proof-note form with visible `Proof note` label, helper text, validation slots, and primary action in `src/components/ProofNoteForm.tsx`
- [X] T024 [P] [US1] Create today's task/status card component for local date, task name, and incomplete status in `src/components/TodayCard.tsx`
- [X] T025 [P] [US1] Create completed-state summary with read-only proof note, task snapshot, completion time, and non-color-only status in `src/components/CompletionSummary.tsx`
- [X] T026 [US1] Wire empty, setup, incomplete-today, validation-error, and completed-today states in `src/App.tsx`
- [X] T027 [US1] Persist configured task and today's completion through the storage adapter in `src/App.tsx` and `src/lib/storage.ts`
- [X] T028 [US1] Add focus behavior for setup open, invalid proof note, and completion transition in `src/components/TaskSetupForm.tsx`, `src/components/ProofNoteForm.tsx`, and `src/App.tsx`
- [X] T029 [US1] Style empty, setup, incomplete-today, validation-error, and completed states according to the UX brief in `src/styles/global.css`

**Checkpoint**: User Story 1 is independently functional and testable as the MVP.

---

## Phase 4: User Story 2 - Return and Review Progress (Priority: P2)

**Goal**: A returning user can reload the page, see today's completed state, review recent history, see current streak, and be prevented from completing the same local date twice.

**Independent Test**: Complete today, reload, confirm completion persists, confirm no duplicate completion path exists, and inspect recent history plus current streak.

### Tests for User Story 2

- [X] T030 [P] [US2] Create failing Playwright test for reload persistence, duplicate completion prevention, history display, current streak, mobile 375px layout, and desktop layout in `tests/e2e/return-review.spec.ts`
- [X] T031 [P] [US2] Create failing unit tests for recent-history sorting and seven-day selection in `tests/unit/history.test.ts`

### Implementation for User Story 2

- [X] T032 [P] [US2] Implement recent-history sorting and selection helpers in `src/lib/history.ts`
- [X] T033 [P] [US2] Create quiet history and streak presentation component in `src/components/HistoryList.tsx`
- [X] T034 [US2] Integrate derived current streak, recent history, reload persistence, and duplicate form lockout in `src/App.tsx`
- [X] T035 [US2] Ensure completed state after reload exposes no duplicate submission path in `src/components/CompletionSummary.tsx` and `src/App.tsx`
- [X] T036 [US2] Style history/streak as secondary supporting information with mobile and desktop responsive behavior in `src/styles/global.css`

**Checkpoint**: User Stories 1 and 2 work independently and together.

---

## Phase 5: User Story 3 - Change the Daily Task Safely (Priority: P3)

**Goal**: A user can edit the active task before completion or change it after completion through confirmation without modifying historical completion records.

**Independent Test**: Edit a task before completion, complete today, open change-task confirmation, cancel with focus returning, confirm a new task, and verify existing history keeps original task snapshots and notes.

### Tests for User Story 3

- [X] T037 [P] [US3] Create failing Playwright test for edit-before-completion and change-task confirmation preserving history in `tests/e2e/change-task.spec.ts`
- [X] T038 [P] [US3] Create failing unit tests for task-change behavior preserving completion snapshots in `tests/unit/task-change.test.ts`

### Implementation for User Story 3

- [X] T039 [P] [US3] Create confirmation UI with new task field, `Confirm change`, `Cancel`, and accessible labels in `src/components/ChangeTaskConfirmation.tsx`
- [X] T040 [US3] Implement edit-before-completion behavior in `src/App.tsx` and `src/components/TaskSetupForm.tsx`
- [X] T041 [US3] Implement confirmed task changes that update active settings without mutating completion records in `src/App.tsx` and `src/lib/storage.ts`
- [X] T042 [US3] Add confirmation focus management, cancel focus return, and Escape cancellation in `src/components/ChangeTaskConfirmation.tsx` and `src/App.tsx`
- [X] T043 [US3] Style edit and change-task confirmation states with clear primary/secondary button hierarchy in `src/styles/global.css`

**Checkpoint**: All user stories are independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Finish verification, cleanup, UX review, and constitution checks.

- [X] T044 [P] Remove the default Playwright example test from `tests/example.spec.ts` after Daily Done E2E tests exist
- [X] T045 [P] Update implementation notes and expected commands if needed in `specs/001-build-daily-done/quickstart.md`
- [X] T046 Run `npm run build` and resolve TypeScript or Vite issues in `package.json`, `vite.config.ts`, `tsconfig.json`, and `src/App.tsx`
- [X] T047 Run `npm run test` and resolve unit test failures in `tests/unit/date.test.ts`, `tests/unit/streak.test.ts`, `tests/unit/validation.test.ts`, `tests/unit/storage.test.ts`, `tests/unit/history.test.ts`, and `tests/unit/task-change.test.ts`
- [X] T048 Run `npm run test:e2e` and resolve Playwright failures in `tests/e2e/configure-complete.spec.ts`, `tests/e2e/return-review.spec.ts`, and `tests/e2e/change-task.spec.ts`
- [X] T049 Run final product-designer UX review with Playwright or `$playwright-interactive` if available, covering 375px mobile, desktop, keyboard navigation, accessible labels, focus behavior, and console errors; record results in `specs/001-build-daily-done/ux-review.md`
- [X] T050 Perform final scope audit for no login, backend, database, cloud sync, notifications, social sharing, AI verification, multi-task tracking, component library, or excess gamification in `package.json`, `src/App.tsx`, and `src/components/HistoryList.tsx`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 Setup**: No dependencies; can start immediately.
- **Phase 2 Foundational**: Depends on Phase 1; blocks all user stories.
- **Phase 3 US1**: Depends on Phase 2; delivers MVP.
- **Phase 4 US2**: Depends on Phase 2 and integrates most naturally after US1 because it reviews completion records created by US1.
- **Phase 5 US3**: Depends on Phase 2 and integrates most naturally after US1 because task changes relate to configured/completed task state.
- **Phase 6 Polish**: Depends on all implemented user stories selected for release.

### User Story Dependencies

- **US1 Configure and Complete Today**: MVP; no dependency on US2 or US3 after foundation.
- **US2 Return and Review Progress**: Requires the shared storage/date/streak foundation and completion records; can be developed after US1 or with seeded data.
- **US3 Change the Daily Task Safely**: Requires the shared storage foundation and task settings; can be developed after US1 or with seeded data.

### Within Each User Story

- Write Playwright tests first and confirm they fail before implementation.
- Write unit tests before helper implementation where listed.
- Build UI components before wiring them through `src/App.tsx`.
- Integrate storage and state transitions before styling polish.
- Run the story's independent test before moving to the next priority story.

---

## Parallel Opportunities

- Setup tasks T002 through T006 can run in parallel after T001 ownership is clear.
- Foundational tests T008 through T011 can run in parallel, and independent implementation tasks T014, T016, T018, and T019 can run in parallel.
- US1 component tasks T022 through T025 can run in parallel after the US1 Playwright test exists.
- US2 test tasks T030 and T031 can run in parallel; helper/component tasks T032 and T033 can run in parallel after their tests exist.
- US3 test tasks T037 and T038 can run in parallel; T039 can run in parallel with storage/state work once tests exist.
- Final cleanup tasks T044 and T045 can run in parallel before verification tasks T046 through T050.

## Parallel Example: User Story 1

```text
Task: "T022 [P] [US1] Create empty state and daily task setup form with visible `Daily task` label in `src/components/TaskSetupForm.tsx`"
Task: "T023 [P] [US1] Create proof-note form with visible `Proof note` label, helper text, validation slots, and primary action in `src/components/ProofNoteForm.tsx`"
Task: "T024 [P] [US1] Create today's task/status card component for local date, task name, and incomplete status in `src/components/TodayCard.tsx`"
Task: "T025 [P] [US1] Create completed-state summary with read-only proof note, task snapshot, completion time, and non-color-only status in `src/components/CompletionSummary.tsx`"
```

## Parallel Example: User Story 2

```text
Task: "T030 [P] [US2] Create failing Playwright test for reload persistence, duplicate completion prevention, history display, current streak, mobile 375px layout, and desktop layout in `tests/e2e/return-review.spec.ts`"
Task: "T031 [P] [US2] Create failing unit tests for recent-history sorting and seven-day selection in `tests/unit/history.test.ts`"
Task: "T032 [P] [US2] Implement recent-history sorting and selection helpers in `src/lib/history.ts`"
Task: "T033 [P] [US2] Create quiet history and streak presentation component in `src/components/HistoryList.tsx`"
```

## Parallel Example: User Story 3

```text
Task: "T037 [P] [US3] Create failing Playwright test for edit-before-completion and change-task confirmation preserving history in `tests/e2e/change-task.spec.ts`"
Task: "T038 [P] [US3] Create failing unit tests for task-change behavior preserving completion snapshots in `tests/unit/task-change.test.ts`"
Task: "T039 [P] [US3] Create confirmation UI with new task field, `Confirm change`, `Cancel`, and accessible labels in `src/components/ChangeTaskConfirmation.tsx`"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 setup.
2. Complete Phase 2 foundation.
3. Complete Phase 3 US1.
4. Run `npm run test`, `npm run test:e2e`, and `npm run build`.
5. Stop and validate the MVP flow before adding history/streak or task-change behavior.

### Incremental Delivery

1. Foundation ready: Vite app, tokens, storage, date/streak/validation helpers, and Playwright infrastructure.
2. US1: configure and complete today with proof-note validation.
3. US2: reload persistence, duplicate prevention, history, and streak.
4. US3: edit/change task with confirmation and preserved history.
5. Polish: full build, unit tests, Playwright, browser QA, scope audit.

### Constitution Gates

- Do not begin implementation until tasks are approved and cross-artifact analysis is complete.
- Keep all persistence in localStorage.
- Do not add login, backend, database, cloud sync, notifications, social sharing, AI verification, multi-task tracking, component library, or gamification beyond simple history/streak.
- Done requires build success, unit tests, Playwright E2E in a real browser, responsive mobile/desktop checks, keyboard/accessibility checks, and no obvious console errors.
