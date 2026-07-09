# Data Model: Build Daily Done

## Overview

Daily Done stores a single versioned local app state in browser localStorage.
All dates used for daily identity are browser/device local calendar dates in
`YYYY-MM-DD` format. Timestamps are full completion/update instants used for
display and ordering, not for determining "today".

## Entities

### AppState

Authoritative persisted object.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `version` | number | yes | Storage schema version for future migration. |
| `settings` | DailyTaskSettings or null | yes | Active daily task settings, or null before setup. |
| `completions` | CompletionRecord[] | yes | Completion records, at most one per local date. |

Validation:

- `version` must be recognized by the app.
- `completions` must not contain duplicate `localDate` values.
- Unknown/corrupt payloads must produce a visible recoverable storage error
  rather than silently reporting false completion.

### DailyTaskSettings

The active task configuration.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `taskName` | string | yes | Current active task name, trimmed and non-empty. |
| `createdAt` | string | yes | Timestamp when the active task was first created. |
| `updatedAt` | string | yes | Timestamp when the active task was last changed. |

Validation:

- `taskName` must be non-empty after trimming whitespace.
- Editing the task before today's completion updates `taskName` and
  `updatedAt`.
- Changing the task after completions exist must not mutate prior completion
  records.

### CompletionRecord

A self-attested daily completion snapshot.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `localDate` | string | yes | Local calendar date in `YYYY-MM-DD`; unique key. |
| `taskNameAtCompletion` | string | yes | Snapshot of active task name at completion time. |
| `proofNote` | string | yes | User's proof/reflection note. |
| `completedAt` | string | yes | Completion timestamp. |

Validation:

- `localDate` must be a valid local date key in `YYYY-MM-DD` format.
- `localDate` must be unique across completion records.
- `taskNameAtCompletion` must be non-empty.
- `proofNote` must be at least 10 characters after trimming whitespace.
- Once recorded, `taskNameAtCompletion` and `proofNote` are read-only.

### CurrentStreak

Derived value, not persisted as authoritative state.

| Field | Type | Description |
|-------|------|-------------|
| `count` | number | Consecutive completed local calendar days. |
| `throughDate` | string | Today if today is complete; otherwise yesterday when streak exists. |

Rules:

- If today has a completion, count backward from today.
- If today is incomplete but yesterday has a completion, count backward from
  yesterday.
- If neither today nor yesterday is complete, streak is 0.
- Date comparisons use local date keys, not UTC timestamps.

## Relationships

- `DailyTaskSettings` represents the current active task.
- `CompletionRecord.taskNameAtCompletion` is a snapshot copied from
  `DailyTaskSettings.taskName` at completion time.
- `CurrentStreak` is derived from `CompletionRecord.localDate` values.

## State Transitions

### First-Time Setup

1. Initial `settings` is null and `completions` is empty.
2. User enters a valid task name.
3. App stores `DailyTaskSettings` with `createdAt` and `updatedAt`.
4. Home screen moves to today incomplete state.

### Complete Today

1. App calculates today's local date key.
2. If a completion already exists for today's key, app shows completed state and
   does not expose a completion submission path.
3. User enters proof note.
4. App validates proof note length after trimming.
5. App appends `CompletionRecord` with local date, task snapshot, note, and
   completion timestamp.
6. App shows completed state with note read-only.

### Change Task

1. User opens change-task confirmation.
2. App moves focus into confirmation UI.
3. User confirms with a valid new task name.
4. App updates active `DailyTaskSettings`.
5. Existing completion records remain unchanged.
6. If today's completion already exists, today's completed state remains tied to
   its completion snapshot.

## Storage Key

Use one application-specific localStorage key, for example:

```text
daily-done:v1
```

The exact key may be finalized during implementation, but it must be stable and
namespaced to avoid colliding with unrelated browser storage.
