# Feature Specification: Multi-task Scheduling and Calendar Views

**Feature Branch**: `002-multi-task-calendar`

**Created**: 2026-07-09

**Status**: Draft

**Input**: User description: "Expand Daily Done from a single daily task into a local-first multi-task planning and verification app. Preserve proof-note verification while allowing multiple scheduled tasks, future task creation, month planning, and daily, weekly, and monthly views."

## Clarifications

### Session 2026-07-09

- Q: When can tasks be completed? → A: Due-today tasks and past missed tasks can be completed with a valid proof note; future tasks cannot be completed early; completed tasks remain read-only.
- Q: How do future tasks and monthly planning behave? → A: Future tasks are planned items that can be created and edited before their scheduled date, while monthly planning is a lightweight month overview with per-day counts/status and day selection, not a full calendar system.
- Q: How should old single-task localStorage data migrate? → A: Readable legacy data migrates into scheduled task records when possible; unsupported or corrupt legacy data is ignored safely without breaking the app or presenting false saved/completed data.
- Q: What is the default view and how do calendar views interact? → A: Daily view is the default; weekly and monthly views summarize tasks and selecting a date from either view sets the selected local date and opens the daily view for that date.
- Q: What must Playwright test? → A: Playwright must cover the default daily view, multiple tasks today, future planning/editing, blocked early completion, missed-task display/completion, week/month date selection, validation, persistence, migration, responsive layout, keyboard access, and console errors.
- Q: What happens to the original single-task streak/history UI? → A: It is replaced by daily, weekly, and monthly task summaries; migrated historical completions remain visible as completed scheduled tasks, but no streak display is required for this feature.
- Q: What week-start rule should planning use? → A: Weeks start on Monday and end on Sunday for deterministic weekly and monthly views; display labels may still use the user's local language/date formatting.
- Q: How does this feature relate to the approved 001 single-task feature? → A: The 001 feature is the legacy baseline and migration source. This 002 feature supersedes the prior one-task/non-multi-task product scope for implementation, while preserving localStorage, proof-note verification, accessibility, testing, and no-backend/no-auth/no-cloud constraints.
- Q: What if the local calendar day changes while the app is open? → A: The app must re-evaluate the browser-local "today" before status-sensitive actions and when the page regains focus, so planned, due-today, and missed states do not rely on stale UTC or load-time-only assumptions.

## Constitution Alignment *(mandatory)*

- **Scope Boundary**: The feature remains a single-user personal planning and verification app. It does not require login, accounts, backend services, cloud sync, notifications, sharing, AI verification, recurring task automation, drag-and-drop calendars, or complex project-management behavior. The scope expands from one daily task to multiple local scheduled tasks while preserving the core verification ritual.
- **Local Data**: Scheduled tasks, selected dates/views, completion timestamps, proof/reflection notes, and migrated legacy Daily Done records are stored locally in the browser. Existing single-task local data must be migrated or handled gracefully without breaking the app.
- **UX Quality**: The experience is mobile-first, calm, trustworthy, focused, and uncluttered. Daily view is the simplest default. Weekly and monthly views support planning and date selection without becoming a complex calendar app. All controls have accessible labels, visible focus, keyboard support, clear empty states, and clear validation errors.
- **History/Streak Scope**: The original single-task streak/history presentation is superseded by per-day, per-week, and per-month task summaries. Historical completions remain accessible as migrated completed tasks, but streak calculation and streak UI are not required for this feature.
- **Approval Gate**: This specification stops for explicit user approval before planning begins.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Plan and Verify Multiple Tasks for a Day (Priority: P1)

A user opens Daily Done to the daily view, creates more than one task for the selected local date, and verifies each due task independently with a proof/reflection note.

**Why this priority**: This preserves the existing core value of intentional completion while removing the single-task limit.

**Independent Test**: Can be tested by opening a clean app, creating two tasks for today, attempting invalid proof notes, completing one task, confirming the other remains incomplete, then completing the second task.

**Acceptance Scenarios**:

1. **Given** no tasks exist for the selected date, **When** the user opens the daily view, **Then** the app shows a clear empty state and one primary action to add a task.
2. **Given** the user creates two valid task titles for today, **When** the daily view refreshes, **Then** both tasks appear under today's local date with separate incomplete statuses.
3. **Given** a due task is incomplete, **When** the user submits an empty proof note or a proof note shorter than 10 characters after trimming whitespace, **Then** the app prevents completion and shows a clear validation error for that task.
4. **Given** two due tasks exist for today, **When** the user completes one task with a valid proof note, **Then** only that task becomes completed and read-only while the other task remains available for verification.
5. **Given** a task is already completed, **When** the user views it again on the same device, **Then** the task cannot be completed a second time and its proof note is shown read-only.

---

### User Story 2 - Schedule and Edit Future Tasks (Priority: P2)

A user can create tasks for future local dates and adjust incomplete planned tasks before they are completed.

**Why this priority**: Future planning is required for month-level task planning and makes the app useful beyond today's checklist.

**Independent Test**: Can be tested by creating a task for a future date, navigating to that date, editing the incomplete task, and confirming the app blocks early completion before the scheduled date.

**Acceptance Scenarios**:

1. **Given** the user is on the daily view, **When** they add a task and choose a future local date, **Then** the task is saved for that future date and appears when that date is selected.
2. **Given** a future task exists, **When** the user views it before its scheduled date, **Then** the app shows it as planned and does not offer a completion submission path.
3. **Given** a future task is incomplete, **When** the user edits its title or scheduled date, **Then** the updated task appears in the correct date view and remains incomplete.
4. **Given** a future task's scheduled date becomes today, **When** the user views today's daily view, **Then** the task is shown as due today and can be verified with a valid proof note.

---

### User Story 3 - Review Tasks by Week and Month (Priority: P3)

A user can switch between daily, weekly, and monthly views to understand planned work, completion status, and days needing attention.

**Why this priority**: Calendar views are required for planning across weeks and months while keeping daily verification as the simplest default workflow.

**Independent Test**: Can be tested by creating tasks on several dates, switching among daily, weekly, and monthly views, and selecting dates from weekly and monthly views to inspect the tasks for that date.

**Acceptance Scenarios**:

1. **Given** tasks exist across several dates, **When** the user switches to weekly view, **Then** the app shows the selected week with tasks grouped by local calendar day.
2. **Given** the weekly view is visible, **When** the user selects a day in the week, **Then** the app sets that local date as selected and opens the daily view for that date.
3. **Given** tasks exist in a selected month, **When** the user switches to monthly view, **Then** the app shows a month grid or month overview with task counts and completion status by day.
4. **Given** the monthly view is visible, **When** the user selects a day in the month, **Then** the app sets that local date as selected and opens the daily view for that date.
5. **Given** a week or month has no tasks, **When** the user views that period, **Then** the app shows a calm empty state with one clear action to add a task.

---

### User Story 4 - Preserve Existing Daily Done Data (Priority: P4)

A returning user with data from the original single-task Daily Done app can open the expanded app without the old data breaking the experience.

**Why this priority**: The feature is a change on top of an implemented app, so existing local data must not cause a crash, false completion state, or unusable screen.

**Independent Test**: Can be tested by seeding existing single-task Daily Done data, loading the expanded app, and confirming the app either presents migrated equivalent task records or ignores unsupported legacy data safely without a crash or false task state.

**Acceptance Scenarios**:

1. **Given** readable data from the original single-task version exists in browser storage, **When** the expanded app loads, **Then** the app converts or presents that data as scheduled task and completion history without crashing.
2. **Given** old data contains a completed daily task, **When** migration succeeds, **Then** the completion remains associated with its original local date, task title snapshot, proof note, and completion timestamp.
3. **Given** old data is corrupt, unsupported, or cannot be migrated, **When** the app loads, **Then** the app ignores that data safely, remains usable, and does not falsely claim tasks were saved or completed.

### Edge Cases

- The user creates multiple tasks with similar or identical titles on the same local date.
- The user attempts to create a task with an empty title or a scheduled date that is missing or invalid.
- The user attempts to complete a future task before its scheduled local date.
- A task's scheduled local date is in the past and the task is still incomplete; it is shown as missed and can still be completed with a valid proof note.
- The user attempts to complete an already completed task.
- The user reloads after creating future tasks, completing one of several due tasks, switching views, or selecting a date.
- The local calendar day changes while the app is open.
- The user's browser/device timezone changes; existing scheduled local dates and completion records remain as recorded.
- A selected day, week, or month has no tasks.
- A month starts or ends mid-week and includes leading or trailing days from adjacent months in a grid.
- Long task titles and long proof notes must not break the 375px mobile layout.
- Browser local storage is unavailable, full, corrupt, or contains legacy data from the old version; readable legacy data is migrated and unsupported legacy data is ignored safely.
- Keyboard focus must remain understandable after validation errors, task creation, view switching, date selection, completion, and migration/recovery messages.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST support multiple scheduled tasks for the same local calendar date.
- **FR-002**: The user MUST be able to create a scheduled task with a non-empty title and a scheduled local date in `YYYY-MM-DD` format.
- **FR-003**: The user MUST be able to create tasks for today, past dates, or future dates, subject to completion rules.
- **FR-004**: The user MUST be able to edit an incomplete task's title and scheduled local date before the task is completed.
- **FR-005**: Completed tasks MUST be read-only except for non-destructive viewing of the task title, scheduled date, completion timestamp, and proof note.
- **FR-006**: The system MUST provide a daily view that shows tasks for one selected local calendar date.
- **FR-007**: The daily view MUST be the default view when the user opens the app.
- **FR-008**: The system MUST provide a weekly view that shows the selected week with tasks grouped by local calendar day.
- **FR-009**: The system MUST provide a lightweight monthly view that shows a month grid or month overview with task counts and completion status by local calendar day without introducing recurring tasks, reminders, drag-and-drop, or project-management features.
- **FR-010**: The user MUST be able to switch between daily, weekly, and monthly views.
- **FR-011**: The user MUST be able to select a day from the weekly view, set that local date as selected, and open the daily view for that date.
- **FR-012**: The user MUST be able to select a day from the monthly view, set that local date as selected, and open the daily view for that date.
- **FR-013**: Each task MUST have its own independent completion status.
- **FR-014**: The system MUST define verification as user self-attestation through a required proof/reflection note for the specific task being completed.
- **FR-015**: The system MUST reject proof notes that are empty or shorter than 10 characters after trimming whitespace.
- **FR-016**: The system MUST prevent a task from being marked complete more than once.
- **FR-017**: The system MUST prevent a future task from being marked complete before its scheduled local date.
- **FR-018**: The system MUST allow a due-today or missed incomplete task to be completed independently with a valid proof note.
- **FR-019**: When a task is completed, the system MUST record the completion timestamp and proof note for that task without changing other tasks on the same date.
- **FR-020**: The system MUST derive task status from scheduled local date and completion state as planned, due today, completed, or missed.
- **FR-021**: The system MUST show clear visual and textual differences between planned, due today, completed, and missed tasks without relying on color alone.
- **FR-022**: The system MUST store all task and completion data locally in the browser and MUST NOT require login, backend services, cloud sync, notifications, sharing, AI verification, or multi-user support.
- **FR-023**: The system MUST migrate readable existing single-task Daily Done data into equivalent scheduled task/completion records when possible, and MUST ignore unsupported or corrupt legacy data safely without breaking the app or presenting false saved/completed data.
- **FR-024**: The system MUST preserve original local dates, task title snapshots, proof notes, and completion timestamps when migrating completed legacy records.
- **FR-025**: The system MUST show clear empty states for days, weeks, and months with no tasks.
- **FR-026**: The interface MUST maintain one obvious primary action for each main screen state, such as adding a task, saving a task, selecting a date, or verifying a task.
- **FR-027**: All form fields and controls MUST have accessible labels and visible focus indicators.
- **FR-028**: The interface MUST be keyboard navigable for task creation, task editing, proof-note entry, completion, view switching, date selection, and reviewing completed tasks.
- **FR-029**: Validation errors MUST be visible, specific, associated with the relevant field or task, and explain how the user can recover.
- **FR-030**: The interface MUST work without horizontal scrolling at 375px mobile width and at desktop width.
- **FR-031**: Playwright end-to-end tests MUST cover the default daily view, creating multiple tasks for today, creating and editing a future task, blocking early future completion, showing and completing missed tasks, selecting dates from weekly and monthly views, proof-note validation, completed-task persistence after reload, legacy data migration or safe ignore behavior, mobile and desktop responsive layout, keyboard access, and absence of obvious console errors.
- **FR-032**: The system MUST replace the original single-task streak/history presentation with daily, weekly, and monthly task summaries for this feature; migrated completed history remains visible as completed scheduled tasks, but streak display is out of scope.
- **FR-033**: The system MUST re-evaluate the browser-local current date before status-sensitive actions and when the page regains focus, so task statuses stay correct if the local calendar day changes while the app is open.

### Key Entities *(include if feature involves data)*

- **Scheduled Task**: A user-created task planned for one local calendar date. Key attributes include task id, title, scheduled local date, created timestamp, updated timestamp, completed timestamp if complete, and proof note if complete.
- **Task Completion**: The completed state of a scheduled task. It is tied to one task, includes the proof/reflection note and completion timestamp, and cannot be created twice for the same task.
- **Calendar Date**: A local calendar day in `YYYY-MM-DD` format used for scheduling, grouping, due/missed status, and date selection.
- **Calendar View**: The user's current planning perspective: daily, weekly, or monthly. It determines how tasks are grouped and how dates are selected, but task data remains tied to scheduled local dates.
- **Legacy Daily Done Data**: Existing data from the single-task version. Readable legacy task settings and completion records are converted or presented as scheduled task records where possible; unsupported or corrupt legacy payloads are ignored safely and never treated as saved or completed work.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A new user can create two tasks for today from the default daily view in under 2 minutes.
- **SC-002**: A user can create a future task, navigate to its scheduled date, and see it as planned in under 2 minutes.
- **SC-003**: 100% of proof notes that are empty or shorter than 10 characters after trimming whitespace are rejected with a visible recovery message.
- **SC-004**: 100% of attempts to complete a future task before its scheduled local date are blocked with clear feedback.
- **SC-005**: A completed task cannot produce a second completion record or second completed state through normal user interaction.
- **SC-006**: After a reload on the same device and browser, scheduled tasks, selected-day task lists, completed statuses, completion timestamps, and proof notes remain visible.
- **SC-007**: The daily, weekly, and monthly views each expose date-specific task information without requiring horizontal scrolling at 375px mobile width or desktop width.
- **SC-008**: A user can switch between daily, weekly, and monthly views and select a date from weekly or monthly view without losing task data or context.
- **SC-009**: Existing readable single-task Daily Done data loads without crashing and preserves completed task title, local date, proof note, and completion timestamp where those fields exist; unsupported or corrupt legacy data is ignored safely without false saved or completed tasks.
- **SC-010**: All primary controls for task creation, view switching, date selection, proof entry, and completion can be reached and operated with a keyboard and have clear accessible names.
- **SC-011**: Playwright verification covers creating multiple tasks for today, creating and editing a future task, viewing by day/week/month, selecting a date from weekly/monthly view into daily view, blocking invalid proof notes, blocking early future completion, showing and completing missed tasks, completing due tasks independently, persistence after reload, responsive layout, keyboard access, console-error checks, and migration or safe ignore behavior for old local data.
- **SC-012**: The app remains within the accepted product scope: no accounts, backend, cloud sync, notifications, sharing, AI verification, recurring engine, drag-and-drop calendar, or project-management features.

## Assumptions

- A single person uses the app in one browser profile on their own device.
- "Today" and all scheduled dates use the browser/device local calendar date, not UTC.
- Tasks are date-based only; this feature does not introduce time-of-day scheduling.
- Tasks are one-off scheduled items; this feature does not include recurring tasks.
- A task can be completed on its scheduled local date or after its scheduled date if it was missed, but never before its scheduled date.
- Incomplete tasks may be edited until completed. Completed tasks remain read-only.
- Multiple tasks may share the same title and scheduled date because each task has its own identity.
- Weekly view uses a deterministic Monday-through-Sunday week. Date identity remains the local `YYYY-MM-DD` date, and display labels may use the user's local date formatting.
- Monthly view may show leading and trailing days from adjacent months when using a grid, but the selected month remains clear.
- The app opens to daily view by default. It may remember a selected date only if doing so does not override daily view as the default.
- Weekly and monthly views are planning summaries; selecting a day from either view opens the daily view for that local date.
- Existing single-task data from the original Daily Done app is treated as legacy local data and should be migrated when readable. Corrupt or unsupported data should be ignored safely rather than crashing or creating false task state.
- The approved 002 feature supersedes the 001 single-task/non-multi-task scope. The 001 artifacts remain useful only as implementation baseline, legacy-data reference, and migration test input.
- The original streak/history UI is intentionally replaced by calendar-based task summaries; no streak count is required in the multi-task feature.
- Data remains available only as long as the user's browser local storage remains available.
