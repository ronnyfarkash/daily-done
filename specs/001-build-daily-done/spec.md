# Feature Specification: Build Daily Done

**Feature Branch**: `001-build-daily-done`

**Created**: 2026-07-09

**Status**: Draft

**Input**: User description: "Create a simple local-first web app that helps a single person verify completion of one daily task with an intentional proof note, recent history, and a current streak."

## Clarifications

### Session 2026-07-09

- Q: What does "verify completed" mean for Daily Done? → A: User self-attestation via a required proof/reflection note; no external or AI verification.
- Q: How is the local calendar day determined? → A: Use the browser/device local calendar date at load and completion time; never UTC.
- Q: How are duplicate completions prevented? → A: Completion records are unique by local date; an existing record locks today's completion form.
- Q: What happens when the task changes? → A: The active task changes going forward while historical completion snapshots remain unchanged.
- Q: What must accessibility and Playwright acceptance cover? → A: Labels, keyboard flow, focus behavior, validation errors, responsive layout, persistence, duplicate prevention, and task-change confirmation.
- Q: What happens when localStorage cannot be read or written? → A: The app shows a persistent storage error, preserves current input when possible, offers retry, and never shows a completion as saved until persistence succeeds.

## Constitution Alignment *(mandatory)*

- **Scope Boundary**: The feature is a single-user personal daily-task verification app. It does not require login, accounts, backend services, cloud sync, notifications, social sharing, AI-based real-world verification, or multi-task habit tracking. Gamification is limited to a simple current streak and recent completion history.
- **Local Data**: The configured daily task and completion records are stored in browser localStorage. Completion records include the local calendar date, task name at completion time, proof/reflection note, and completion timestamp.
- **UX Quality**: The experience is mobile-first, calm, trustworthy, focused, and satisfying. It uses one primary action per state, accessible form labels, keyboard navigation, visible validation errors, clear empty states, read-only completed notes, and an uncluttered layout that works at 375px mobile width and desktop width.
- **Approval Gate**: This specification stops for explicit user approval before planning begins.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Configure and Complete Today (Priority: P1)

A new user opens Daily Done, defines one daily task, sees today's date and task, enters a proof/reflection note as self-attested verification, and marks the task complete for the current local calendar day.

**Why this priority**: This is the core value of the app. Without task setup, proof entry, validation, and completion, the app cannot verify daily work.

**Independent Test**: Can be tested end-to-end by starting with no configured task, creating a task, attempting an invalid proof note, then completing today with a valid proof note and seeing the completed state.

**Acceptance Scenarios**:

1. **Given** no daily task exists, **When** the user opens the app, **Then** the app shows a clear empty state with one primary action to define a daily task.
2. **Given** the user enters a non-empty task name, **When** they save it, **Then** the home screen shows today's local date, the task name, and an incomplete status.
3. **Given** today's task is incomplete, **When** the user submits an empty proof note or a note shorter than 10 characters after trimming whitespace, **Then** the app prevents completion and shows a clear validation error.
4. **Given** today's task is incomplete, **When** the user submits a valid proof note, **Then** the app records today's self-attested completion and shows a calm completed state with the note read-only.

---

### User Story 2 - Return and Review Progress (Priority: P2)

A returning user can reload the app and see whether today's task is already complete, along with recent completion history and the current streak.

**Why this priority**: Daily Done must be dependable across reloads and must make progress visible without becoming a busy habit tracker.

**Independent Test**: Can be tested by completing today, reloading the page, checking the completed state, confirming duplicate completion is blocked, and reviewing history and streak.

**Acceptance Scenarios**:

1. **Given** the user completed today's task, **When** they reload the page on the same local calendar day, **Then** the app still shows today as completed and displays the proof note as read-only.
2. **Given** today's completion already exists, **When** the user returns to the home screen for the same local calendar day, **Then** the completion form is unavailable and no duplicate completion can be created.
3. **Given** the user has completion records, **When** they view the home screen, **Then** the app shows a simple recent history list for at least the last 7 completed days and a current streak count based on consecutive local calendar days.

---

### User Story 3 - Change the Daily Task Safely (Priority: P3)

A user can edit the task name before completing today or reset/change the daily task later without deleting historical completions.

**Why this priority**: The app needs to adapt when the user's daily focus changes while preserving the integrity of prior completion records.

**Independent Test**: Can be tested by editing the task before completion, completing today, then using the reset/change-task flow and confirming history remains intact.

**Acceptance Scenarios**:

1. **Given** today's task is not complete, **When** the user edits the task name, **Then** the updated task name appears on the home screen before completion.
2. **Given** today's task is complete, **When** the user views today's completion, **Then** the proof note cannot be edited.
3. **Given** the user chooses to reset or change the daily task, **When** they confirm the action, **Then** the active task changes for future incomplete days and previous completion records remain visible in history with their original task names and notes.

### Edge Cases

- The proof note contains only spaces or fewer than 10 characters after trimming whitespace.
- The user reloads after completing today.
- The user attempts to complete the same task more than once on the same local calendar day.
- The local calendar day changes after a previous completion.
- The user's browser/device timezone changes; the app uses the current browser/device local date for new actions while preserving already recorded local dates.
- The user changes the task after one or more historical completions exist.
- The user changes the task after today's completion; today's completion remains read-only and still references the task name recorded at completion time.
- No history exists yet.
- The browser's local storage is unavailable, corrupt, or cannot save the task or completion; the app shows a persistent storage error, preserves current input when possible, offers retry, and does not show a task or completion as saved until persistence succeeds.
- Long task names or long proof notes must not break the mobile layout.
- Keyboard focus must remain understandable after validation errors, completion, and task-change confirmation.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST support a single primary daily task for one person using the app on their own device.
- **FR-002**: The system MUST show a clear empty state before any daily task is configured, with one primary action to define the task.
- **FR-003**: The user MUST be able to configure a daily task by entering a non-empty task name.
- **FR-004**: The system MUST show the user's local calendar date, configured daily task, and today's completion status on the home screen.
- **FR-005**: The user MUST be able to edit the active task name before today's completion is recorded.
- **FR-006**: The system MUST define verification as user self-attestation through a required proof/reflection note before marking today's task complete; it MUST NOT attempt external, AI, sensor-based, or real-world verification.
- **FR-007**: The system MUST reject proof notes that are empty or shorter than 10 characters after trimming whitespace.
- **FR-008**: When the user completes today with a valid note, the system MUST record the local calendar date, task name at completion time, proof/reflection note, and completion timestamp.
- **FR-009**: The system MUST store the configured task and completion records locally in the browser using localStorage.
- **FR-010**: The system MUST use the browser/device local calendar date at page load and completion time, not UTC, to determine "today" and daily streak continuity.
- **FR-011**: The system MUST store at most one completion record per local calendar date and MUST make that local date the uniqueness rule for duplicate prevention.
- **FR-012**: After today's completion is recorded, the system MUST show today's proof note as read-only and MUST NOT allow editing it.
- **FR-013**: The system MUST preserve today's completed status, proof note, history, and streak after a page reload on the same device and browser.
- **FR-014**: The system MUST show a simple recent history list for at least the last 7 completed local calendar days.
- **FR-015**: The system MUST show a current streak count based on consecutive completed local calendar days ending today if today is complete, or ending yesterday if today is not yet complete.
- **FR-016**: The user MUST be able to reset or change the daily task through an explicit confirmation step.
- **FR-017**: Changing the daily task MUST NOT delete, rewrite, or relabel historical completion records; each historical record MUST keep the task name and proof note captured at completion time.
- **FR-018**: The interface MUST maintain one obvious primary action for each main state: configure task, submit proof note, acknowledge completed status, or confirm task change.
- **FR-019**: The interface MUST provide accessible labels for all form fields and controls.
- **FR-020**: The interface MUST be keyboard navigable for task setup, proof-note entry, completion, history review, and task-change confirmation/cancellation.
- **FR-021**: Validation errors MUST be visible, specific, associated with the relevant field, and explain how the user can recover.
- **FR-022**: The interface MUST work without horizontal scrolling at 375px mobile width and at desktop width.
- **FR-023**: The product tone MUST be friendly, minimal, and reassuring, avoiding guilt, hype, enterprise language, and busy habit-tracker patterns.
- **FR-024**: The visual experience MUST feel calm, trustworthy, focused, and quietly satisfying, with history and streak presented as secondary supporting information.
- **FR-025**: The feature MUST have Playwright end-to-end coverage for the critical flow: configure task, reject invalid note, complete today, reload completed state, prevent duplicate completion, and change task without deleting history.
- **FR-026**: After a validation error, the interface MUST keep or return focus to the field that needs correction; after task-change confirmation opens, focus MUST move to the confirmation UI and return predictably when canceled.
- **FR-027**: Completed status, validation errors, and read-only proof-note state MUST be perceivable without relying on color alone.
- **FR-028**: If localStorage is unavailable, corrupt, or cannot save, the system MUST show a persistent storage error, preserve current user input when possible, provide a retry path, and MUST NOT show a task or completion as saved until the write succeeds.

### Key Entities *(include if feature involves data)*

- **Daily Task**: The user's active daily task. Key attributes include task name and whether it has been configured. The active task can change over time, but changing it only affects future incomplete days.
- **Completion Record**: A self-attested record that a task was completed for one local calendar day. Key attributes include unique local date, task name snapshot, proof/reflection note, and completion timestamp. Once recorded, the task name snapshot and note remain unchanged.
- **Current Streak**: A derived count of consecutive local calendar days with completion records. It is calculated from completion history and is not a separate user-entered item.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A new user can understand the empty state and configure their first daily task in under 1 minute.
- **SC-002**: A user can mark today's task complete with a valid proof note in under 30 seconds after the task is configured.
- **SC-003**: 100% of invalid proof notes that are empty or shorter than 10 trimmed characters are rejected with a visible recovery message.
- **SC-004**: After a valid completion, reloading the page on the same local calendar day still shows today as completed with the proof note visible and read-only.
- **SC-005**: The app creates no more than one completion record for any single local calendar day.
- **SC-006**: A user with at least 7 completed days can see at least the 7 most recent completed days in history.
- **SC-007**: The current streak count correctly reflects consecutive completed local calendar days for the user's history.
- **SC-008**: A user can change the active daily task while previously recorded completions remain visible and unchanged.
- **SC-009**: The primary flow is usable at 375px mobile width and desktop width without horizontal scrolling or hidden required actions.
- **SC-010**: All primary controls can be reached and operated with a keyboard and have clear accessible names.
- **SC-011**: Playwright verification can complete the critical flow at 375px mobile width and desktop width, including invalid-note validation, completion persistence after reload, duplicate prevention, and task-change confirmation.
- **SC-012**: After validation errors and task-change confirmation/cancellation, keyboard focus is placed predictably on the field or control needed to continue.
- **SC-013**: If localStorage read/write fails, the user sees a persistent recovery message and no unsaved completion is presented as completed.

## Assumptions

- The primary user is one person using one browser profile on their own device.
- "Today" means the calendar day in the user's local browser/device timezone at page load and completion time.
- Proof-note minimum length is evaluated after trimming leading and trailing whitespace.
- "Verify completed" means the user intentionally self-attests completion by entering a valid proof/reflection note; the app does not independently verify real-world completion.
- Each completion is identified by its local calendar date. If the browser/device timezone changes later, existing completion dates are preserved as recorded.
- If a completion already exists for the current local calendar date, the app treats today as complete and does not expose another completion submission path.
- Completion history remains available as long as the user's browser localStorage data remains available.
- Storage error recovery is limited to retrying browser localStorage access; the app does not introduce alternate persistence, backend sync, or export/import flows.
- The history list may show more than 7 completion days, but it must show at least the 7 most recent completed days when available.
- The app remains intentionally small: no login, server, cloud sync, notifications, social sharing, AI-based real-world verification, or multi-task habit tracking.
