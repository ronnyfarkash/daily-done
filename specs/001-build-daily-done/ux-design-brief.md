# UX Design Brief: Daily Done

**Feature**: Build Daily Done  
**Source Spec**: [spec.md](./spec.md)  
**Purpose**: Define the complete design direction for implementation without using Figma.

## Product Personality

Daily Done should feel calm, focused, trustworthy, and encouraging. It is a
small personal verification ritual for one person, not a busy habit tracker,
enterprise dashboard, or productivity scoreboard.

The product should help the user answer one question: "Did I do the thing
today?" Completion should feel intentional because the user self-attests with a
short proof/reflection note.

- **Calm**: quiet layout, no visual noise, no pressure.
- **Focused**: one daily task and one primary action per state.
- **Trustworthy**: clear date, clear completion status, persistent local history.
- **Encouraging**: completion feels satisfying without badges, confetti, guilt,
  or streak obsession.

## Visual Style

Use a clean card-based layout with generous spacing, soft hierarchy, and minimal
color. The interface should feel warm and personal while staying crisp,
readable, and dependable.

- Use one main card for today's task and completion state.
- Keep history and streak visually secondary below the main card.
- Use subtle borders, quiet background contrast, and restrained shadows if any.
- Use one accent color for the primary action and completed status.
- Use neutral text hierarchy: clear title, readable body, muted helper text.
- Completion may use a check indicator, status text, or softened accent surface,
  but it must not rely on color alone.
- Avoid dense grids, multiple competing cards, badges, charts, loud gradients,
  decorative clutter, and generic dashboard composition.

## Mobile-First Layout

Design for 375px width first.

- Use a single-column page with a readable content width and comfortable page
  padding.
- Keep app identity, today's local date, the main task card, and the current
  primary action easy to find.
- Group the proof note field, helper text, validation error, and completion
  action together.
- Put history and streak below today's card.
- Use comfortable touch targets and clear spacing between controls.
- Prevent horizontal scrolling.
- Long task names and proof notes must wrap cleanly without overlapping content
  or resizing controls unpredictably.

## Desktop Layout

Desktop should preserve the same focused product shape rather than expanding
into a dashboard.

- Center the experience in a readable max-width container.
- Keep today's task card as the dominant element.
- History and streak may remain below the main card or move to a quiet
  secondary column if space allows.
- Do not add desktop-only workflows, analytics panels, or extra management UI.
- Preserve the same labels, states, keyboard order, and interaction model used
  on mobile.

## Behavioral Design Rules

- "Verify completed" means self-attestation through a valid proof/reflection
  note. The app does not independently verify real-world completion.
- "Today" means the browser/device local calendar date at page load and
  completion time, never UTC.
- A completion record is unique by local calendar date.
- If today's local date already has a completion record, the completion form is
  unavailable and the completed state is shown.
- Changing the active task affects future incomplete days only. Historical
  completion records keep their original task name and proof note.

## First-Time Empty State

Purpose: Help a new user understand the app and create one daily task.

Content:

- State message: "No daily task yet."
- Supporting copy: "Choose the one thing you want to verify each day."
- Primary action: "Set daily task."
- Quiet history placeholder: "Your completions will appear here after you finish
  a day."

Behavior:

- Show only the setup path and minimal context.
- Do not show empty analytics, disabled dashboard widgets, or long onboarding
  text.
- The first impression should be understandable within 5 seconds.

## Task Setup State

Purpose: Let the user define the one task Daily Done will track.

Fields and controls:

- Visible label: "Daily task"
- Helper text: "Keep it specific enough to verify."
- Primary action: "Save task"

Validation:

- Empty task names are rejected.
- Error copy: "Enter a task name."
- The error appears near the field and is associated with it for assistive
  technology.

Focus:

- When setup opens, focus moves to the task name field.
- After saving, focus moves to the next meaningful heading or proof note field.

## Today Incomplete State

Purpose: Make today's task and intentional proof-note requirement clear.

Content:

- Today's local date.
- Current task name.
- Status text: "Not completed today."
- Proof note field with visible label: "Proof note"
- Helper text: "Write a short note about what you did."
- Primary action: "Mark done"
- Secondary action: "Edit task" if today's completion has not been recorded.

Behavior:

- Completion is not a casual checkbox. The proof note is the verification step.
- The proof note field and primary action should be visually grouped.
- The primary action should be visually dominant, with one obvious path forward.

## Proof-Note Validation Error State

Purpose: Prevent accidental or low-intent completion.

Trigger:

- The user submits an empty proof note.
- The user submits a proof note shorter than 10 characters after trimming
  whitespace.

Error copy:

- Empty note: "Add a proof note before marking done."
- Too short: "Write at least 10 characters."

Behavior:

- Keep the user's entered text.
- Keep or return focus to the proof note field.
- Associate the error message with the proof note field.
- Do not record completion until the note is valid.

## Completed Today State

Purpose: Confirm completion and preserve today's proof.

Content:

- Today's local date.
- Task name snapshot recorded at completion.
- Status text: "Completed today."
- Completion timestamp in local readable time.
- Proof note shown read-only.
- Secondary action: "Change task"

Behavior:

- Hide or disable the completion form after completion.
- Do not allow editing today's proof note.
- Prevent duplicate completion for the same local calendar day.
- The state change should feel satisfying but quiet: no confetti, badges,
  streak celebration, or noisy animation.

## History/Streak State

Purpose: Provide confidence and context without turning Daily Done into a
tracker.

Content:

- Current streak count.
- Recent completion history for at least the last 7 completed local calendar
  days when available.
- Each history item includes local date, task name snapshot, and proof note or a
  readable note preview.

Hierarchy:

- History and streak are secondary to today's task.
- Use quiet headings such as "Current streak" and "Recent completions."
- Avoid charts, leaderboards, badges, progress rings, gamified progress bars,
  and dense metrics.

Empty history:

- Use minimal copy: "Complete a day to start your history."

## Change-Task Confirmation State

Purpose: Let the user change focus without damaging trust in historical
completion records.

Entry:

- Low-emphasis action: "Change task"

Confirmation content:

- Title: "Change daily task?"
- Explanation: "Your past completions will stay in history."
- New task field if changing directly, or a clear next step to enter the new
  task.
- Primary action: "Confirm change"
- Secondary action: "Cancel"

Behavior:

- Historical records remain unchanged.
- If today is incomplete, editing the active task is allowed before completion.
- If today is complete, changing the active task must not alter today's task
  snapshot or proof note.
- Focus moves into the confirmation UI when opened.
- Cancel or Escape returns focus to the triggering control.

## Accessible Labels And Keyboard Navigation

- Every input and control must have a clear accessible name.
- Labels for "Daily task" and "Proof note" must remain visible or be explicitly
  associated with their fields.
- Validation errors must be associated with the relevant field.
- Completed status, validation errors, and read-only note state must be
  perceivable without relying on color alone.
- Keyboard users must be able to configure a task, edit an incomplete task,
  enter a proof note, submit completion, review history, open change-task
  confirmation, confirm, and cancel.
- Visible focus must be present on every interactive control.
- Confirmation UI must manage focus predictably and return focus on cancel.
- Touch targets should be comfortable at 375px width.
- Read-only proof notes should be visually distinct from editable inputs.

## Microcopy Guidelines

Voice:

- Friendly, minimal, direct, and reassuring.
- Prefer short sentences and plain language.
- Avoid shame, hype, productivity jargon, enterprise language, and social
  pressure.

Preferred copy:

- "Set your daily task"
- "No daily task yet."
- "What did you complete today?"
- "Write a short note about what you did."
- "Mark done"
- "Completed today"
- "Your past completions will stay in history."
- "Write at least 10 characters."

Avoid:

- "Crush your goals"
- "Maximize productivity"
- "Failure"
- "Engagement"
- "Dashboard"
- "Habit stack"

## Playwright UX Review Checklist

Run these checks after implementation in a real browser:

- [ ] At 375px width, the first-time empty state is understandable within 5
      seconds and has one obvious primary action.
- [ ] At 375px width, task setup works without horizontal scrolling or hidden
      required actions.
- [ ] At 375px width, today's incomplete state clearly shows local date, task,
      proof note, validation guidance, and primary action.
- [ ] At desktop width, the page remains focused and does not become a busy
      dashboard.
- [ ] Keyboard-only navigation can configure a task, edit an incomplete task,
      enter a proof note, submit completion, inspect history, and open/cancel
      change-task confirmation.
- [ ] Empty proof note submission shows a visible field-level error and does not
      record completion.
- [ ] Short proof note submission shows a visible field-level error and does not
      record completion.
- [ ] After validation errors, focus remains on or returns to the proof note
      field.
- [ ] Valid completion changes the UI to a calm completed state and shows the
      proof note read-only.
- [ ] Reloading after completion preserves completed status, proof note, history,
      and streak.
- [ ] When today's local date already has a completion record, the completion
      form is unavailable and duplicate completion cannot be created.
- [ ] Changing the daily task requires confirmation and preserves historical
      task-name snapshots and proof notes.
- [ ] Long task names and notes wrap without overlap, truncation of critical
      content, or broken layout.
- [ ] All interactive controls have accessible names.
- [ ] Visible focus is present on all interactive controls.
- [ ] Status and errors are understandable without relying on color alone.
- [ ] No obvious console errors appear during the critical flow.
