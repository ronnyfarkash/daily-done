# Data Model: Multi-task Scheduling and Calendar Views

## Overview

Daily Done V2 stores scheduled tasks in a single versioned local app state. All
task identity and scheduling uses browser/device local calendar dates in
`YYYY-MM-DD` format. Timestamps are full instants used for created/updated and
completion display; they do not determine task date identity.

Derived data includes task status, day view, week view, month overview, task
counts, and completion summaries. Derived data is not persisted as
authoritative state.

## Storage Keys

- Current V1 legacy key: `daily-done:v1`
- Planned V2 key: `daily-done:v2`

Read V2 first. If absent, attempt V1 migration. If migration succeeds, write V2.
If legacy data is unsupported or corrupt, ignore it safely and start with an
empty V2 state.

## Entities

### AppStateV2

Authoritative persisted object.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `version` | number | yes | V2 storage schema marker. |
| `tasks` | ScheduledTask[] | yes | User-created scheduled tasks. |
| `preferences` | AppPreferences | no | Lightweight local UI preferences that do not override daily view as default. |

Validation:

- `version` must be recognized by the app.
- `tasks` must be an array of valid `ScheduledTask` records.
- Task ids must be unique.
- Unknown or corrupt V2 payloads must produce a recoverable storage error and
  must not create false saved/completed state.

### ScheduledTask

A user-created task planned for one local calendar date.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | yes | Stable unique task identifier. |
| `title` | string | yes | User-entered task title, trimmed and non-empty. |
| `scheduledDate` | string | yes | Local calendar date in `YYYY-MM-DD` format. |
| `createdAt` | string | yes | Timestamp when the task was created. |
| `updatedAt` | string | yes | Timestamp when the task was last changed. |
| `completedAt` | string or null | yes | Completion timestamp, null while incomplete. |
| `proofNote` | string or null | yes | Proof/reflection note, null while incomplete. |

Validation:

- `id` must be unique within `tasks`.
- `title` must be non-empty after trimming whitespace.
- `scheduledDate` must be a valid local date key.
- `createdAt` and `updatedAt` must be valid timestamp strings.
- If `completedAt` is null, `proofNote` must be null.
- If `completedAt` is a string, `proofNote` must be at least 10 characters
  after trimming whitespace.
- Completed tasks are read-only except for viewing.
- Incomplete tasks may be edited.
- Multiple tasks may share the same title and scheduled date.

### AppPreferences

Optional local UI preferences.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `lastSelectedDate` | string | no | Last selected local date, if retained. |

Rules:

- The app opens in daily view by default.
- A retained selected date may affect which date appears in daily view only if
  it does not override daily view as the default mode.
- View mode does not need to be persisted.

### TaskStatus

Derived value, not persisted.

| Status | Rule |
|--------|------|
| `completed` | `completedAt` and `proofNote` are present. |
| `planned` | Incomplete task with `scheduledDate` after today's local date. |
| `due-today` | Incomplete task with `scheduledDate` equal to today's local date. |
| `missed` | Incomplete task with `scheduledDate` before today's local date. |

Rules:

- Future planned tasks cannot be completed.
- Due-today and missed tasks can be completed with a valid proof note.
- Completed tasks cannot be completed again.
- Status must be derived from a supplied browser-local current date at the time
  status-sensitive logic runs. Do not cache the current date as authoritative
  across local calendar day changes while the app remains open.

### ScheduledTaskWithStatus

Derived representation of a task prepared for display or action rules.

| Field | Type | Description |
|-------|------|-------------|
| `task` | ScheduledTask | The authoritative task record. |
| `status` | TaskStatus | Derived planned, due-today, missed, or completed status. |
| `isCompletable` | boolean | True only for incomplete due-today or missed tasks. |
| `isEditable` | boolean | True only for incomplete tasks. |
| `statusLabel` | string | User-facing status text such as `Planned`, `Due today`, `Missed`, or `Completed`. |

Rules:

- `isCompletable` is false for planned future tasks and completed tasks.
- `isEditable` is false for completed tasks.
- `statusLabel` must match the derived status and cannot be the source of truth.

### DayViewModel

Derived representation for one selected local date.

| Field | Type | Description |
|-------|------|-------------|
| `date` | string | Selected local date. |
| `tasks` | ScheduledTaskWithStatus[] | Tasks scheduled for the date. |
| `totalCount` | number | Number of tasks for the date. |
| `completedCount` | number | Completed tasks for the date. |
| `incompleteCount` | number | Incomplete tasks for the date. |
| `plannedCount` | number | Planned future tasks for the date. |
| `dueTodayCount` | number | Due-today tasks for the date. |
| `missedCount` | number | Missed tasks for the date. |
| `hasMissedTasks` | boolean | Whether the date has missed incomplete tasks. |
| `summaryLabel` | string | Short readable summary such as `2 of 3 completed`. |

### DaySummary

Compact derived representation used by weekly and monthly views.

| Field | Type | Description |
|-------|------|-------------|
| `date` | string | Local date represented by the summary. |
| `tasks` | ScheduledTaskWithStatus[] | Tasks scheduled for the date, possibly limited by the view. |
| `totalCount` | number | Number of tasks for the date. |
| `completedCount` | number | Completed tasks for the date. |
| `incompleteCount` | number | Incomplete tasks for the date. |
| `plannedCount` | number | Planned tasks for the date. |
| `dueTodayCount` | number | Due-today tasks for the date. |
| `missedCount` | number | Missed tasks for the date. |
| `statusSummary` | string | Accessible summary of task counts and status mix. |
| `isToday` | boolean | Whether the summary date is today's local date. |
| `isSelected` | boolean | Whether the summary date is the selected local date. |

### WeekViewModel

Derived representation for the selected week.

| Field | Type | Description |
|-------|------|-------------|
| `startDate` | string | Monday local date for the displayed week. |
| `endDate` | string | Sunday local date for the displayed week. |
| `days` | DaySummary[] | Seven day summaries in chronological order. |

Rules:

- Weeks always start on Monday and end on Sunday for deterministic behavior.
- Display labels may use local date formatting, but date identity uses local
  `YYYY-MM-DD` keys.

### MonthViewModel

Derived representation for the selected month.

| Field | Type | Description |
|-------|------|-------------|
| `monthKey` | string | Displayed month in `YYYY-MM` format. |
| `weeks` | MonthWeek[] | Week rows or grouped sections for the overview. |
| `days` | MonthDaySummary[] | Day summaries, including leading/trailing days if using a grid. |

### MonthWeek

One Monday-through-Sunday row or grouped section in the month overview.

| Field | Type | Description |
|-------|------|-------------|
| `startDate` | string | Monday local date for the week row. |
| `endDate` | string | Sunday local date for the week row. |
| `days` | MonthDaySummary[] | Seven day summaries in chronological order. |

### MonthDaySummary

Day summary used by monthly view.

| Field | Type | Description |
|-------|------|-------------|
| `date` | string | Local date represented by the day cell or agenda row. |
| `dayNumber` | number | Calendar day number for display. |
| `monthKey` | string | Month containing the date in `YYYY-MM` format. |
| `isInSelectedMonth` | boolean | Whether the date belongs to the displayed month. |
| `isToday` | boolean | Whether the date is today's local date. |
| `isSelected` | boolean | Whether the date is the selected local date. |
| `totalCount` | number | Number of tasks for the date. |
| `completedCount` | number | Completed tasks for the date. |
| `incompleteCount` | number | Incomplete tasks for the date. |
| `plannedCount` | number | Planned tasks for the date. |
| `dueTodayCount` | number | Due-today tasks for the date. |
| `missedCount` | number | Missed tasks for the date. |
| `statusSummary` | string | Accessible summary of count and completion status. |

Rules:

- Month grids may include leading/trailing days from adjacent months.
- Adjacent-month days must set `isInSelectedMonth` to false.
- Selecting any day, including an adjacent-month day, opens daily view for that
  local date.

### LegacyDailyDoneStateV1

Readable legacy state from the original single-task version.

| Field | Type | Description |
|-------|------|-------------|
| `version` | number | V1 schema marker. |
| `settings` | object or null | Active single daily task settings. |
| `completions` | array | Historical completion records keyed by local date. |

Migration rules:

- Convert each readable V1 completion into one completed V2 scheduled task.
- Preserve original local date, task title snapshot, proof note, and completion
  timestamp.
- Use deterministic ids for migrated tasks:
  - Completed legacy record: `legacy-completion-<localDate>`.
  - Active uncompleted legacy task for today: `legacy-active-<todayLocalDate>`.
- If a generated migrated id collides with another migrated id, append a
  deterministic numeric suffix such as `-2`, `-3`, preserving sorted migration
  order. Collisions must not overwrite an existing migrated task.
- If valid active V1 settings exist and there is no V1 completion for today's
  local date, create one incomplete task for today's local date without claiming
  completion.
- If V1 already contains a completion for today's local date, do not create an
  extra incomplete task from the active setting.
- Ignore corrupt or unsupported legacy payloads safely.
- Do not delete or mutate V1 data during migration.

## Relationships

- `AppStateV2.tasks` owns all scheduled task records.
- Each `ScheduledTask` has at most one completion because completion fields live
  on the task record.
- Day, week, and month views are derived from `ScheduledTask.scheduledDate`.
  Weekly and monthly week rows use Monday-through-Sunday boundaries.
- Task status is derived from a task plus today's local date.
- Legacy V1 completions become V2 scheduled tasks during migration.

## State Transitions

### Create Task

1. User opens add-task flow.
2. App pre-fills scheduled date from the selected date.
3. User enters non-empty title and valid scheduled date.
4. App writes a new incomplete `ScheduledTask`.
5. UI shows the task in the appropriate day/week/month derived views.

### Edit Incomplete Task

1. User opens edit flow for an incomplete task.
2. User changes title and/or scheduled date.
3. App validates title/date.
4. App updates `title`, `scheduledDate`, and `updatedAt`.
5. Derived views regroup the task if the scheduled date changed.

### Complete Due or Missed Task

1. App verifies task is incomplete and not scheduled after today's local date.
2. User enters proof note.
3. App validates proof note length after trimming.
4. App writes `completedAt` and `proofNote`.
5. Task becomes completed and read-only.

### Block Future Completion

1. App derives status as `planned`.
2. UI does not expose completion action.
3. If an edge path attempts completion, app rejects it and leaves task unchanged.

### Re-evaluate Local Day

1. App derives today's browser-local date at load.
2. App refreshes that local date when the page regains focus or before a
   status-sensitive action such as completion.
3. Derived planned, due-today, and missed statuses are recalculated from the
   refreshed local date.
4. Existing scheduled local dates and completed task records remain unchanged.

### Prevent Duplicate Completion

1. App sees `completedAt` and `proofNote` already present.
2. UI exposes read-only completed state only.
3. Any duplicate completion attempt returns unchanged state or a validation
   error without a second completion timestamp.

### Migrate Legacy Data

1. App loads and V2 state is absent.
2. App reads V1 state.
3. If readable, app converts records to V2 tasks and writes V2.
4. If unsupported/corrupt, app starts from empty V2 state without false data.

## Derived Sorting Rules

Daily task list should sort for user relevance:

1. Missed incomplete tasks.
2. Due-today incomplete tasks.
3. Planned future tasks.
4. Completed tasks.

Within each group, use scheduled date and creation/update order consistently.
Do not rely on array mutation order in tests.
