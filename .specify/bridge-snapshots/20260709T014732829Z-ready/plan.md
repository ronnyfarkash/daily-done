# Implementation Plan: Multi-task Scheduling and Calendar Views

**Branch**: `002-multi-task-calendar` | **Date**: 2026-07-09 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-multi-task-calendar/spec.md`

## Summary

Expand the existing Daily Done Vite/React/TypeScript app from one active daily
task into a local-first scheduled task list. The implementation will preserve
proof-note verification while supporting multiple tasks per local date, future
scheduled tasks, missed tasks, daily/weekly/monthly derived views, and migration
from the original single-task localStorage format.

The feature will keep dependencies minimal. Calendar behavior will use small
pure date helpers rather than a large calendar library. All authoritative user
data remains in browser localStorage. UI work will follow
[ux-design-brief.md](./ux-design-brief.md): daily view as the default working
surface, weekly/monthly views as lightweight planning summaries, and calm
task-card states for planned, due today, missed, and completed.
The original single-task streak/history UI is intentionally replaced by
calendar-based task summaries; migrated historical completions remain available
as completed scheduled tasks.

## Technical Context

**Language/Version**: TypeScript in the existing Vite React app.

**Primary Dependencies**: Existing runtime dependencies only: React and React
DOM. Existing development tools: Vite, TypeScript, Vitest, and Playwright Test.
Do not add a component library. Do not add a calendar library unless
implementation proves the simple helper approach cannot satisfy the spec.

**Storage**: localStorage only. Add a versioned V2 task-list state and migrate
readable V1 single-task data from the existing `daily-done:v1` format. Prefer a
new namespaced key such as `daily-done:v2` while reading the old key for
migration; leave old V1 data untouched unless a later task explicitly decides
cleanup is safe.

**Testing**: Vitest unit tests for date helpers, week/month generation, task
grouping, status derivation, migration, validation, and storage behavior.
Playwright E2E for multiple tasks today, future tasks, daily/weekly/monthly
views, proof-note completion, early-completion prevention, persistence,
migration safety, mobile layout, keyboard access, and console-error checks.

**Target Platform**: Mobile-first browser app, verified at 375px width and
desktop width.

**Project Type**: Single-user local web app.

**Performance Goals**: User interactions remain immediate for normal personal
use. A user can create two tasks for today in under 2 minutes, create and find a
future task in under 2 minutes, and switch among day/week/month views without
visible lag for a typical local task history.

**Constraints**: No login, accounts, backend, database, cloud sync, remote
persistence, notifications, sharing, AI verification, recurring task engine,
drag-and-drop calendar, or project-management features. Use browser/device
local dates for task identity and status. Weeks start on Monday and end on
Sunday for deterministic helper logic and tests. Completed tasks are read-only.

**Scale/Scope**: One person, one browser profile, local task planning and
verification. Data volume is personal-scale localStorage data; design and tests
should comfortably handle dozens to low hundreds of tasks without introducing
backend or indexing complexity.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] Spec-first: [spec.md](./spec.md) exists, has been clarified, and this plan
      produces required design artifacts before tasks or implementation.
- [x] Approval gate: plan completion stops for explicit user approval before the
      checklist/tasks/analyze/implementation phases continue.
- [x] Small scope: no login, accounts, backend, cloud sync, remote persistence,
      notifications, social features, AI verification, recurring task engine,
      drag-and-drop calendar, or gamification beyond simple status/history.
- [x] Local-first storage: user data uses localStorage only, with a documented
      V1-to-V2 migration path.
- [x] UX quality: [ux-design-brief.md](./ux-design-brief.md) defines
      mobile-first layout, accessible labels, keyboard usability, visible focus,
      clear empty states, validation errors, status states, responsive calendar
      summaries, and no clutter.
- [x] Testing and done: Playwright E2E covers the critical flow; unit tests cover
      high-risk date, calendar, status, grouping, migration, validation, and
      storage logic; build, tests, browser checks, and console-error verification
      are planned.

**Post-design re-check**: Phase 0 and Phase 1 artifacts below preserve the same
constraints: localStorage only, no backend/contracts, no calendar library by
default, mobile-first UI states, accessible form behavior, and Playwright
verification.

## Design Inputs

- [spec.md](./spec.md): Clarified product requirements, acceptance criteria,
  entities, and success criteria.
- [ux-design-brief.md](./ux-design-brief.md): Product personality, navigation,
  view layouts, task states, flows, accessibility, responsive behavior, and
  Playwright UX checklist.
- [.specify/memory/constitution.md](../../.specify/memory/constitution.md):
  governance, scope boundaries, localStorage requirement, approval gates,
  testing discipline, and Definition of Done.
- Existing implementation: current Vite React app with one-task localStorage
  model in `src/lib/types.ts`, `src/lib/storage.ts`, date helpers in
  `src/lib/date.ts`, and one-task components in `src/components/`.

## Architecture

Daily Done will remain a single React app with a small domain layer:

- UI layer: React components for app shell, view switcher, date navigation,
  daily task list, weekly summary, monthly overview, task form, task card,
  proof-note flow, storage alert, and empty states.
- Domain layer: pure helpers for local date parsing/formatting, date
  comparison, Monday-start week generation, month grid generation, task
  grouping, task sorting, status derivation, validation, and migration.
- Persistence layer: narrow localStorage adapter that reads/writes a versioned
  V2 app state, migrates readable V1 data, ignores unsupported legacy data
  safely, and never reports unsaved task/completion changes as saved.
- Styling layer: existing plain CSS and CSS variables, extended for segmented
  controls, date navigation, task cards, and day/week/month summaries.
- Test layer: Vitest for pure helper behavior and Playwright for critical
  browser flows in real Chromium projects.

## Migration Strategy

The existing app stores V1 data under `daily-done:v1` with a single
`settings` object and `completions` array keyed by local date. The new feature
should use a V2 state with `tasks`.

Planned behavior:

1. On load, try to read V2 state first.
2. If V2 is absent, try to read V1 state.
3. If V1 is readable:
   - Convert each V1 completion into one completed scheduled task for its
     `localDate`, preserving task title snapshot, proof note, and completion
     timestamp.
   - Generate completed migrated ids as `legacy-completion-<localDate>`.
   - If V1 has a valid active task setting and no V1 completion for today's
     local date, create one incomplete task for today's local date.
   - Generate that active migrated id as `legacy-active-<todayLocalDate>`.
   - If V1 already has a completion for today's local date, do not create an
     extra incomplete task from the active setting, to avoid inventing a second
     same-day task from the old single-task model.
   - If any migrated id collision is encountered, append a deterministic numeric
     suffix such as `-2` or `-3`; never overwrite a migrated task.
   - Write V2 state after successful migration.
4. If V1 is corrupt or unsupported, ignore it safely, start from empty V2 state,
   and do not present false saved or completed tasks.
5. If V2 write fails, show a storage error and do not present migration as
   saved.

Rationale: reading V1 while writing V2 preserves rollback options and avoids
mutating legacy data during migration.

## UI Implementation Plan

### Design Tokens

Extend existing CSS variables in `src/styles/tokens.css` and
`src/styles/global.css` for:

- Status colors/surfaces for planned, due today, missed, and completed.
- Focus rings that remain visible on cards, segmented controls, date buttons,
  day cells, and forms.
- Compact card spacing for multiple tasks per day.
- Calendar summary borders and muted surfaces.
- Primary, secondary, and quiet button hierarchy.

Keep the palette restrained and avoid dashboard-like color coding. Status text
and structure must carry meaning without relying on color alone.

### Responsive Layout

- Mobile first at 375px.
- Single-column daily view by default.
- Weekly view stacks seven day sections on mobile; desktop may use columns only
  if text remains readable.
- Monthly view uses a compact grid when tappable and readable; otherwise an
  agenda grouped by week is acceptable for mobile.
- Desktop keeps content constrained and focused. Do not add desktop-only
  workflows or dashboard panels.
- Long task titles and proof notes wrap without horizontal scroll or overlap.

### Components

Refactor or replace the one-task components with feature-specific components:

- `AppShell`: keep existing calm shell, update header/date context if needed.
- `ViewSwitcher`: segmented `Day`, `Week`, `Month` control.
- `DateNavigator`: previous/next period controls and `Today`.
- `DailyView`: selected local date, task list, add-task entry, daily empty
  state, and daily completion summary.
- `WeeklyView`: selected week grouped by day, task previews, status summaries,
  and day selection.
- `MonthlyView`: lightweight month overview or grid with task counts and status
  summaries.
- `TaskCard`: planned/due/missed/completed states, edit action for incomplete
  tasks, verify action only for due or missed tasks, read-only completed proof.
- `TaskForm`: create/edit incomplete task title and scheduled date.
- `ProofNoteForm`: proof-note validation for one selected task at a time.
- `StorageAlert`: persistent recoverable storage read/write/migration errors.

Existing one-task components may be deleted, replaced, or adapted during
implementation, but the final code should not keep unused single-task flows.

### Interaction Rules

- Daily view is the default app view.
- Weekly/monthly date selection sets selected date and opens daily view.
- Add-task flow pre-fills scheduled date from the current selected date.
- Only one proof-note form is open at a time.
- Future tasks do not expose completion actions.
- Missed tasks remain completable with a valid proof note.
- Completed tasks expose proof note read-only and no duplicate completion path.
- Validation errors preserve user input and return focus to the relevant field.
- Storage writes must succeed before UI reports task creation, edit, or
  completion as saved.

## Data And Persistence Plan

Store one V2 app state in localStorage:

- `version`: V2 schema marker.
- `tasks`: array of scheduled task records.
- `preferences`: optional lightweight local UI preference such as
  `lastSelectedDate`; app still opens in daily view by default.

Authoritative state:

- Task records are authoritative for planning and completion.
- Status, day/week/month summaries, counts, grouping, and sorting are derived.
- The original streak/history UI is not carried forward as a separate feature;
  daily, weekly, and monthly summaries replace it for this multi-task model.
- No backend, database, cache service, or remote sync is introduced.

Duplicate prevention:

- Each task has a unique id.
- Multiple tasks may share a title and scheduled date.
- Completion uniqueness is by task id: a task with `completedAt` and
  `proofNote` cannot be completed again.

Local date rule:

- Scheduled dates are local `YYYY-MM-DD` keys.
- "Today" is derived from the browser/device local date.
- Week models use deterministic Monday-through-Sunday boundaries.
- Do not use UTC to decide whether a task is planned, due today, missed, or
  completed.

## Testing Plan

### Unit Tests

Create or update Vitest tests for:

- Local date key generation, parsing, comparison, and add-days behavior.
- Week generation for a selected local date, using Monday-through-Sunday
  boundaries.
- Month grid or month overview generation, including leading/trailing days.
- Task grouping by local date.
- Derived status: planned, due today, missed, completed.
- Sorting tasks for daily view.
- Task title and proof-note validation.
- Future task early-completion guard.
- Duplicate completion prevention by task id.
- V1 legacy migration into V2 tasks.
- Corrupt/unsupported legacy data safe ignore behavior.
- localStorage read/write failure behavior.

### Playwright E2E

E2E coverage must include:

1. Create multiple tasks for today.
2. Create a future task.
3. Daily view default and selected-date task list.
4. Weekly view grouped by day and date selection into daily view.
5. Monthly view lightweight overview and date selection into daily view.
6. Complete one due task with a valid proof note while other tasks remain
   independent.
7. Reject empty and too-short proof notes.
8. Prevent completing a future task early.
9. Show missed task state and allow valid missed-task completion.
10. Persistence after reload for tasks, selected-day task lists, completed
    status, completed timestamp, and proof note.
11. Migration from old single-task localStorage data, plus corrupt legacy data
    safe ignore behavior.
12. Mobile 375px layout smoke check.
13. Desktop layout smoke check.
14. Keyboard path through view switching, date selection, add task, edit task,
    proof-note validation, completion, and completed proof review.
15. Console-error collection during the critical flow.

Each Playwright scenario should isolate localStorage. Tests that need legacy
state should seed the old `daily-done:v1` payload explicitly and then verify V2
behavior after load. Tests should not depend on execution order.

## Project Structure

### Documentation (this feature)

```text
specs/002-multi-task-calendar/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── ux-design-brief.md
├── checklists/
│   └── requirements.md
└── tasks.md              # Created later by /speckit-tasks
```

No `contracts/` artifact is planned because this feature has no backend API,
external interface, CLI contract, or public integration boundary.

### Source Code (repository root)

```text
src/
├── App.tsx
├── components/
│   ├── AppShell.tsx
│   ├── DateNavigator.tsx
│   ├── DailyView.tsx
│   ├── MonthlyView.tsx
│   ├── ProofNoteForm.tsx
│   ├── StorageAlert.tsx
│   ├── TaskCard.tsx
│   ├── TaskForm.tsx
│   ├── ViewSwitcher.tsx
│   └── WeeklyView.tsx
├── lib/
│   ├── calendar.ts
│   ├── date.ts
│   ├── grouping.ts
│   ├── migration.ts
│   ├── storage.ts
│   ├── taskStatus.ts
│   ├── types.ts
│   └── validation.ts
├── styles/
│   ├── global.css
│   └── tokens.css
└── main.tsx

tests/
├── e2e/
│   ├── multi-task-flows.spec.ts
│   ├── calendar-views.spec.ts
│   ├── migration.spec.ts
│   └── test-utils.ts
└── unit/
    ├── calendar.test.ts
    ├── date.test.ts
    ├── grouping.test.ts
    ├── migration.test.ts
    ├── storage.test.ts
    ├── task-status.test.ts
    └── validation.test.ts
```

**Structure Decision**: Keep the existing single-app structure. Replace the
single-task domain model with task-list domain helpers under `src/lib/`, and
keep UI components small and state-specific under `src/components/`. Avoid a
new package, routing layer, component library, or calendar dependency.

## Phase 0 Research Summary

Research decisions are captured in [research.md](./research.md):

- Use native Date plus pure local-date helpers.
- Avoid a calendar library for this lightweight planning scope.
- Use V2 localStorage state with V1 migration.
- Derive day/week/month view models from tasks.
- Use status derivation from scheduled date plus completion fields.
- Preserve existing Playwright/Vitest test stack.

## Phase 1 Design Summary

Design artifacts produced:

- [data-model.md](./data-model.md): V2 app state, task entity, derived view
  models, status rules, validation, migration, and state transitions.
- [quickstart.md](./quickstart.md): validation guide for build, unit tests,
  Playwright E2E, manual browser checks, migration checks, and scope audit.
- Contracts: none created because there is no external API or integration
  contract.

Agent context update: no Spec Kit agent-context update script exists in this
repository's `.specify/scripts/bash/` directory, so no agent-context command was
run.

## Complexity Tracking

No constitution violations. No exceptions required.
