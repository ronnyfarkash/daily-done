# UX Design Brief: Multi-task Scheduling and Calendar Views

**Feature**: Multi-task Scheduling and Calendar Views  
**Source Spec**: [spec.md](./spec.md)  
**Purpose**: Define the complete design direction for implementation without using Figma.

## Product Personality

Daily Done should still feel calm, focused, personal, trustworthy, and
lightweight. The expanded app is a private planning and verification tool, not
a task-management suite, enterprise calendar, or productivity dashboard.

The product should help the user answer two related questions:

- "What did I plan for this day?"
- "Which planned tasks have I actually verified?"

The experience should feel organized without becoming managerial. Multiple
tasks should feel like a tidy daily list, not a backlog. Calendar views should
support orientation and planning, not scheduling complexity.

Design priorities:

- **Calm**: quiet surfaces, restrained color, no pressure or noisy metrics.
- **Focused**: daily view remains the primary working surface.
- **Personal**: language feels direct, human, and private.
- **Trustworthy**: dates, statuses, saved state, and completed proof notes are
  clear and dependable.
- **Lightweight**: no project-management language, no dense toolbars, no
  enterprise calendar patterns.

Avoid Jira-like cues: issue keys, priority labels, kanban language, assignees,
project metadata, filters, bulk actions, drag handles, dense table layouts, and
analytics-heavy dashboards.

## Main Navigation Between Daily/Weekly/Monthly

Use a compact three-option segmented control for `Day`, `Week`, and `Month`.
Place it near the top of the page below the product header and current date
context. Daily view is selected by default.

Navigation rules:

- Daily view is the default and the primary work surface.
- Weekly view is a short-term planning summary grouped by day.
- Monthly view is a lightweight planning overview with counts and status by day.
- Selecting a date from weekly or monthly view sets that local date as selected
  and opens daily view for that date.
- Keep date movement simple: previous/next period controls and a `Today` action.
- Do not introduce drag-and-drop, recurring controls, reminders, time slots,
  attendee concepts, labels, filters, or project-management metadata.

Visual hierarchy:

- Current selected date or period is more prominent than the navigation chrome.
- The segmented control should be easy to find but visually quieter than the
  selected day's task list.
- Only one filled primary button should be visible at the page level in a normal
  browsing state, usually `Add task`.

## Daily View Layout

Daily view is the first screen and should be understandable within 5 seconds.
It should feel like a calm checklist with intentional verification.

Mobile layout order:

1. App header: `Daily Done` and a brief selected-date context.
2. View segmented control: `Day`, `Week`, `Month`.
3. Date navigation row: previous day, selected date, next day, and `Today` when
   useful.
4. Primary action: `Add task`.
5. Task list for the selected date.
6. Quiet supporting summary: count of completed vs total for that date.

Task list behavior:

- Show tasks as compact task cards or rows with enough separation to scan.
- Put task title first, status second, and action third.
- Sort by user relevance: due today or missed incomplete tasks first,
  incomplete planned tasks next, completed tasks last.
- Use compact status text such as `Due today`, `Planned`, `Missed`, and
  `Completed`.
- Do not show completion forms inline for every task at once. Open one task's
  proof-note flow at a time to prevent clutter.
- Completed tasks show proof note read-only in an expanded detail area or
  disclosure.

Desktop layout:

- Keep the daily task list centered in a readable max-width column.
- A quiet side summary may appear only if it does not compete with the list.
- Do not turn desktop into a dashboard; preserve the same task-first workflow.

## Weekly View Layout

Weekly view is for short-term planning and quick orientation.

Layout:

- Show the selected week title and simple previous/next week controls.
- Present seven day sections in chronological order.
- Each day section shows date, task count, completion summary, and a short list
  or preview of tasks.
- Use a visible button or clickable day section with an accessible name like
  `Open Wednesday, July 15`.
- Selecting any day opens daily view for that local date.

Mobile behavior:

- Use a vertical stack of seven day sections.
- Keep each day section compact: date, status summary, and up to a few task
  titles before using a simple count like `2 more`.
- Avoid horizontal scrolling.

Desktop behavior:

- A seven-column layout is acceptable if it remains readable.
- If columns become cramped, prefer a wider stacked or wrapped layout over tiny
  text.
- Do not add calendar time slots or all-day scheduling lanes.

## Monthly View Layout

Monthly view is for planning and overview, not heavy calendar management.

Layout:

- Show selected month title and simple previous/next month controls.
- Use a month grid or readable month overview.
- Each day cell shows the day number, task count, and an accessible status
  summary.
- Use subtle visual markers for status mix:
  - no tasks
  - planned only
  - due or missed incomplete tasks
  - all tasks completed
  - mixed completed and incomplete
- Selecting a day opens daily view for that date.

Mobile behavior:

- A compact grid may be used if day cells remain tappable and readable.
- If grid cells become too dense at 375px, use a month agenda grouped by week
  while preserving month overview semantics.
- Do not show full task notes or proof notes in the month view.

Desktop behavior:

- A month grid can use more horizontal space but should remain quiet and sparse.
- Avoid dense calendar-app visual weight: no colored blocks filling cells, no
  drag handles, no time scheduling UI.

## Task Card States

Each task has one of four user-facing states. State must be clear through text,
structure, and icon/shape if useful, not color alone.

### Planned

For tasks scheduled after today.

- Status text: `Planned`
- Tone: future-oriented and calm.
- Completion action is not available.
- Editing is available while incomplete.
- Suggested helper copy: `Available on its scheduled date.`

### Due Today

For incomplete tasks scheduled for today's local date.

- Status text: `Due today`
- Verification action is available.
- The action can be a compact secondary `Verify` button on the card.
- When selected, the proof-note form appears and `Mark complete` becomes the
  primary action for the page state.

### Missed

For incomplete tasks scheduled before today's local date.

- Status text: `Missed`
- Completion remains allowed with a valid proof note.
- Tone must avoid shame. Use direct recovery copy such as `Still open`.
- Do not use alarming red as the only missed-state cue.

### Completed

For tasks with a completion timestamp and proof note.

- Status text: `Completed`
- Show completion time or date in a quiet metadata line.
- Proof note is read-only.
- No completion action is available.
- Editing destructive fields is unavailable.
- Completion should feel satisfying but quiet: no confetti, badges, noisy
  animation, or streak celebration.

## Add-Task Flow

The add-task flow should be short and predictable.

Entry points:

- Primary `Add task` action in daily view.
- Contextual `Add task` action in empty week/month states that opens the daily
  add flow for the currently selected or chosen date.

Fields:

- Visible label: `Task title`
- Visible label: `Scheduled date`
- Helper text: `Choose the local date this task belongs to.`

Actions:

- Primary: `Save task`
- Secondary: `Cancel`

Validation:

- Empty title: `Enter a task title.`
- Missing or invalid date: `Choose a valid date.`

Focus:

- Opening the form moves focus to `Task title`.
- If opened for a specific day, prefill the scheduled date with that day.
- Validation returns focus to the field that needs correction.
- Saving returns focus to the created task or the daily heading for the selected
  date.

## Complete-Task Proof-Note Flow

Completion remains intentional. It should never feel like a casual checkbox.

Entry:

- Due-today and missed incomplete task cards expose a `Verify` action.
- Future planned tasks do not expose a completion action.
- Completed tasks do not expose a completion action.

Proof form:

- Show the selected task title and scheduled date.
- Visible label: `Proof note`
- Helper text: `Write a short note about what you did.`
- Primary action: `Mark complete`
- Secondary action: `Cancel`

Validation:

- Empty note: `Add a proof note before marking complete.`
- Too short: `Write at least 10 characters.`
- Preserve entered text after validation errors.
- Associate the error with the proof note field.
- Keep or return focus to the proof note field after an error.

After completion:

- Collapse or replace the form with completed state.
- Show the proof note read-only.
- Leave other tasks on the selected date unchanged.
- Prevent a second completion path for the same task.

## Future-Task Behavior

Future tasks should feel planned, not actionable for completion.

Rules:

- Future tasks can be created and edited before their scheduled date.
- Future tasks cannot be completed early.
- Future task cards show `Planned` status and quiet helper text if needed.
- The app should not display a disabled `Mark complete` button unless the
  reason is immediately clear. Prefer no completion action plus status text.
- When a future task's scheduled date becomes today, it appears as `Due today`.

The visual treatment should signal readiness later, not failure now.

## Empty States

Empty states should be short, useful, and calm.

Daily empty state:

- Title: `No tasks for this day.`
- Supporting copy: `Plan one thing you want to verify.`
- Primary action: `Add task`

Weekly empty state:

- Title: `No tasks this week.`
- Supporting copy: `Add a task to start shaping the week.`
- Primary action: `Add task`

Monthly empty state:

- Title: `No tasks this month.`
- Supporting copy: `Plan a day when you are ready.`
- Primary action: `Add task`

Migration-safe empty state:

- If unsupported legacy data is ignored safely, do not expose technical detail
  unless needed. Use a storage alert only if the app cannot read or save current
  data.

Avoid long onboarding text, dashboard placeholders, empty charts, or disabled
widgets.

## Error States

Errors must be specific, recoverable, and visually close to the source.

Validation errors:

- Task title errors appear under `Task title`.
- Scheduled date errors appear under `Scheduled date`.
- Proof-note errors appear under `Proof note`.
- Errors use text plus styling; color is not the only signal.
- Focus moves to the field needing correction.

Storage errors:

- Show a persistent alert if browser storage cannot be read or written.
- Copy should be plain: `Daily Done cannot save in this browser. Try again.`
- Provide a `Retry` action when useful.
- Never show a task or completion as saved unless the save succeeds.

Blocked future completion:

- If the user tries to complete a future task through an edge path, show clear
  feedback: `This task can be completed on its scheduled date.`
- Focus should return to the task card or planned status message.

Legacy data errors:

- Readable legacy data migrates quietly.
- Unsupported or corrupt legacy data is ignored safely.
- Do not show false migrated tasks or false completed states.

## Responsive Behavior

Design mobile first at 375px width.

Mobile:

- Single-column layout.
- Comfortable touch targets.
- No horizontal scrolling.
- View switcher, date controls, and primary action must fit without crowding.
- Task cards wrap long titles and proof notes cleanly.
- Weekly view uses stacked day sections.
- Monthly view uses a compact grid only if tap targets remain usable; otherwise
  use a month agenda grouped by week.

Tablet:

- Preserve the same workflow.
- Weekly sections may become two columns if readable.
- Daily view remains centered and task-focused.

Desktop:

- Keep content in a constrained, readable width.
- Weekly/monthly views may use grid layouts.
- Avoid filling the screen with dashboard panels.
- Do not introduce desktop-only controls or workflows.

Typography and visual density:

- Use readable body text and compact but not cramped metadata.
- Do not scale font size with viewport width.
- Keep letter spacing normal.
- Use consistent spacing between task cards so multiple tasks feel organized,
  not stacked randomly.

## Accessibility Requirements

- Every interactive control has a clear accessible name.
- The `Day`, `Week`, `Month` segmented control exposes selected state.
- Date navigation buttons have explicit labels such as `Previous day`,
  `Next week`, or `Go to today`.
- Day cells and day sections expose meaningful labels including date, task
  count, and status summary.
- `Task title`, `Scheduled date`, and `Proof note` labels remain visible.
- Field errors are associated with their fields.
- Status is available as text, not color alone.
- Completed proof notes are read-only and announced as read-only where
  appropriate.
- Keyboard users can create tasks, edit incomplete tasks, switch views, move
  dates, select days from week/month views, open and cancel proof-note flow,
  complete due or missed tasks, and inspect completed notes.
- Focus order follows visual order.
- Focus is moved intentionally after opening forms, submitting invalid forms,
  saving tasks, switching views, selecting dates, and completing tasks.
- Escape or cancel closes modal/dialog-style forms if those patterns are used.
- Touch targets are comfortable at 375px width.
- Color contrast meets accessible contrast expectations for text, status
  labels, borders, focus rings, and error states.

## Playwright UX Review Checklist

Run these checks after implementation in a real browser.

- [ ] At 375px width, the app opens to daily view and the first screen is
      understandable within 5 seconds.
- [ ] At 375px width, the `Day`, `Week`, `Month` control is visible, operable,
      and does not crowd the selected date.
- [ ] A user can create two tasks for today from daily view without horizontal
      scrolling or hidden required actions.
- [ ] Multiple tasks on one day scan clearly and do not look like a dense
      project-management backlog.
- [ ] A due-today task exposes verification while a future task does not expose
      early completion.
- [ ] Invalid proof notes show visible field-level errors, preserve text, and
      keep focus on or return focus to `Proof note`.
- [ ] Completing one task changes only that task to completed state and leaves
      other tasks independently actionable.
- [ ] Completed tasks show proof notes read-only and expose no duplicate
      completion path.
- [ ] A missed task is visually distinct, avoids shame-heavy copy, and can be
      completed with a valid proof note.
- [ ] Future tasks show planned state, can be edited before completion, and
      cannot be marked complete early.
- [ ] Weekly view shows seven days grouped clearly; selecting a day opens daily
      view for that date.
- [ ] Monthly view shows a lightweight month overview; selecting a day opens
      daily view for that date.
- [ ] Empty daily, weekly, and monthly states provide one clear next action.
- [ ] Storage errors, validation errors, and blocked early-completion feedback
      are visible and recoverable.
- [ ] Readable legacy single-task data is presented as migrated task data, or
      unsupported legacy data is ignored safely without false saved/completed
      state.
- [ ] Keyboard-only navigation can switch views, change dates, select a day,
      add a task, edit an incomplete task, enter proof, complete a task, and
      inspect a completed proof note.
- [ ] All form fields, view controls, date controls, day cells, task actions,
      and status indicators have accessible names or text equivalents.
- [ ] At desktop width, the app remains focused and does not become a dashboard
      or enterprise calendar.
- [ ] Long task titles and proof notes wrap without overlap, clipped critical
      content, or layout shift that breaks interaction.
- [ ] No obvious console errors appear during daily, weekly, monthly,
      future-task, completion, persistence, and migration flows.
