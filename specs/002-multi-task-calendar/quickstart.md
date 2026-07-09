# Quickstart: Multi-task Scheduling and Calendar Views

## Purpose

Use this guide to validate the multi-task scheduling and calendar views feature
after implementation. It is a run and verification guide, not an implementation
task list.

## Prerequisites

- Dependencies installed with `npm install`.
- Browser binaries available for Playwright.
- The app uses the existing Vite, React, TypeScript, Vitest, and Playwright
  setup.
- Data is stored only in browser localStorage.

## Commands

```bash
npm run build
npm run test
npm run test:e2e
```

Expected results:

- Build completes without TypeScript or Vite errors.
- Unit tests pass for date helpers, week/month generation, grouping, status
  derivation, validation, migration, and storage behavior.
- Playwright tests pass for daily, weekly, monthly, future-task, completion,
  persistence, migration, mobile layout, keyboard, and console-error flows.

## Manual Browser Validation

Start the dev server:

```bash
npm run dev
```

Open the local URL printed by Vite.

### 1. Daily View Default

1. Clear Daily Done localStorage for a fresh run.
2. Open the app.
3. Verify the app opens in daily view.
4. Verify the `Day`, `Week`, `Month` control is visible.
5. Verify the selected local date is clear.
6. Verify the daily empty state says there are no tasks for the day and exposes
   one primary `Add task` action.

### 2. Create Multiple Tasks Today

1. In daily view, choose `Add task`.
2. Create a task for today's local date.
3. Create a second task for today's local date.
4. Verify both tasks appear on the daily view.
5. Verify each task has its own status and action.

### 3. Proof-note Validation

1. Choose `Verify` on one due-today task.
2. Submit an empty proof note.
3. Verify completion is blocked and a visible proof-note error appears.
4. Submit a proof note shorter than 10 trimmed characters.
5. Verify completion is still blocked.
6. Verify focus remains on or returns to the proof-note field.

### 4. Complete One Task Independently

1. Submit a valid proof note for one due-today task.
2. Verify that task becomes completed.
3. Verify the proof note is read-only.
4. Verify the second task remains incomplete and independently actionable.
5. Reload the page.
6. Verify completed state, proof note, and incomplete second task persist.

### 5. Create and Review a Future Task

1. Add a task with a future scheduled local date.
2. Navigate to that date in daily view.
3. Verify the task appears as planned.
4. Verify it can be edited while incomplete.
5. Verify it does not expose early completion.
6. If an edge path attempts early completion, verify the task remains unchanged
   and feedback explains it can be completed on its scheduled date.

### 6. Missed Task Behavior

1. Seed or create an incomplete task scheduled before today's local date.
2. Open daily view for that date.
3. Verify the task shows a missed state without shame-heavy copy.
4. Verify the task can be completed with a valid proof note.
5. Verify it becomes completed and read-only.

### 7. Local Day Refresh

1. With seeded tasks around today's local date, reload the app and verify
   planned, due-today, and missed states match the browser-local current date.
2. Return focus to the page or trigger a status-sensitive action such as
   completion.
3. Verify the app re-evaluates the browser-local current date rather than
   relying on stale UTC or load-time-only status.

### 8. Weekly View

1. Create tasks across multiple days in the same week.
2. Switch to weekly view.
3. Verify seven day sections appear Monday through Sunday in chronological
   order.
4. Verify each day shows task count and completion summary.
5. Select a day.
6. Verify the app opens daily view for that selected local date.

### 9. Monthly View

1. Create tasks across multiple dates in the selected month.
2. Switch to monthly view.
3. Verify the month overview shows per-day counts and completion status.
4. Verify the view does not expose drag-and-drop, recurrence, reminders, time
   slots, or project-management controls.
5. Select a day.
6. Verify the app opens daily view for that selected local date.

### 10. Legacy Migration

1. Seed browser localStorage with readable V1 `daily-done:v1` data containing a
   completed single-task record.
2. Load the app with no V2 state.
3. Verify the app does not crash.
4. Verify the legacy completion appears as a completed scheduled task with the
   original local date, task title, proof note, and completion timestamp.
5. Verify no separate legacy streak/history panel is required; historical
   completions appear through daily, weekly, and monthly task summaries.
6. Seed corrupt or unsupported V1 data.
7. Load the app with no V2 state.
8. Verify the app remains usable and does not show false saved or completed
   tasks.

### 11. Responsive and Keyboard Checks

1. Use a 375px viewport.
2. Verify daily, weekly, and monthly views have no horizontal scrolling.
3. Verify task titles and proof notes wrap cleanly.
4. Use only keyboard navigation to switch views, move dates, select a day, add a
   task, edit an incomplete task, enter proof, complete a task, and inspect a
   completed proof note.
5. Verify visible focus is present on every interactive control.

### 12. Console Check

During the critical flows above, verify no obvious console errors appear.

## Scope Audit

Confirm the implementation did not add:

- Login or accounts.
- Backend services.
- Database or server-side storage.
- Cloud sync.
- Notifications.
- AI verification.
- Sharing or social features.
- Recurring task engine.
- Drag-and-drop calendar.
- Complex project-management features.
- Component library or large calendar library without explicit justification.

## Definition of Done

The feature is done only when:

- `npm run build` passes.
- `npm run test` passes.
- `npm run test:e2e` passes.
- Playwright verifies the critical flow in a real browser.
- Mobile and desktop layout checks pass.
- Keyboard/accessibility checks pass for the required controls.
- No obvious console errors appear during the verified flows.
