# Quickstart: Build Daily Done

## Purpose

Validate the Daily Done implementation end-to-end against the spec, UX brief,
and constitution. This guide describes expected commands and scenarios for the
implementation phase; it does not define implementation tasks.

## Prerequisites

- Node.js installed.
- Project dependencies installed with `npm install` after the implementation
  adds Vite/React/TypeScript/Vitest dependencies and scripts.
- Playwright browsers installed if not already present:

```bash
npx playwright install
```

## Expected Project Commands

Implementation should provide these scripts:

```bash
npm run dev
npm run build
npm run test
npm run test:e2e
```

`npm run test` should run Vitest unit tests for pure helpers when present.
`npm run test:e2e` should run Playwright tests against the local Vite app.

## Manual Validation Flow

1. Start the app:

   ```bash
   npm run dev
   ```

2. Open the local app URL shown by Vite.

3. With no local data, verify:
   - Empty state says no daily task exists.
   - One primary action is available to set the task.
   - History/streak content is quiet and secondary.

4. Configure a task:
   - Enter a non-empty task name.
   - Save it.
   - Confirm today's local date, task name, and incomplete status are visible.

5. Validate proof note errors:
   - Submit an empty proof note.
   - Submit a proof note shorter than 10 trimmed characters.
   - Confirm completion is blocked and errors are visible near the proof field.
   - Confirm focus remains on or returns to the proof field.

6. Complete today:
   - Submit a valid proof note.
   - Confirm completed state shows today's local date, task snapshot,
     completion time, and read-only proof note.
   - Confirm the completion form is no longer available.

7. Validate persistence:
   - Reload the page.
   - Confirm completed state, proof note, history, and streak persist.

8. Validate duplicate prevention:
   - Confirm there is no path to create another completion for the same local
     date.

9. Validate storage recovery:
   - Simulate failed or unavailable localStorage where practical.
   - Confirm the app shows a persistent storage error, preserves current input
     when possible, offers retry, and does not show completion as saved until a
     write succeeds.

10. Validate task change:
   - Open change-task confirmation.
   - Cancel and confirm focus returns predictably.
   - Reopen, confirm a new task name, and verify historical completions keep
     their original task snapshots and notes.

## Playwright Validation

Run:

```bash
npm run test:e2e
```

Required E2E coverage:

- First-time task setup.
- Missing proof note validation.
- Too-short proof note validation.
- Successful completion.
- Persistence after reload.
- Duplicate completion prevention.
- Task change confirmation preserving history.
- 375px mobile layout.
- Desktop layout.
- Keyboard-only critical path.
- No obvious console errors during the critical flow.

Each Playwright scenario should clear the `daily-done:v1` localStorage key
before setup. Scenarios requiring history or streak state should seed records
explicitly through the UI or a documented test helper.

If `playwright-interactive` is available, use it for an additional real-browser
UX review of the same critical flow, mobile viewport, desktop viewport,
keyboard path, and console-error expectations.

## Unit Validation

Run:

```bash
npm run test
```

Expected helper coverage when helpers exist:

- Local date key generation.
- Consecutive-day streak calculation.
- Streak ending today when today is complete.
- Streak ending yesterday when today is incomplete.
- Duplicate detection by local date.
- Recent-history ordering and selection.
- Storage recovery behavior for unavailable/corrupt localStorage.

Date and streak unit tests should use explicit local date keys or a supplied
`todayLocalDate` value instead of waiting for real calendar changes.

## Done Criteria

Before implementation is considered done:

- App builds successfully.
- Unit tests pass where helper logic exists.
- Playwright E2E critical flow passes in a real browser.
- Mobile and desktop layout checks pass.
- No obvious console errors appear during the critical flow.
- UX review with product-designer and Playwright evidence confirms the UI
  follows [ux-design-brief.md](./ux-design-brief.md).
