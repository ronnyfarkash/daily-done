# Quality Checklist: Multi-task Scheduling and Calendar Views

**Purpose**: Validate requirements, planning, UX, data, migration, and test-readiness quality before task generation.
**Created**: 2026-07-09
**Feature**: [spec.md](../spec.md)

**Reviewed Inputs**: [spec.md](../spec.md), [plan.md](../plan.md), [data-model.md](../data-model.md), [ux-design-brief.md](../ux-design-brief.md), [research.md](../research.md), [quickstart.md](../quickstart.md), [constitution.md](../../../.specify/memory/constitution.md)

## Requirements Completeness

- [x] CHK001 Are the primary multi-task user journeys documented for same-day tasks, future tasks, calendar views, and legacy migration? [Completeness, Spec §User Scenarios & Testing]
- [x] CHK002 Are functional requirements defined for multiple tasks per local date, future scheduling, daily/weekly/monthly views, date selection, per-task completion, validation, persistence, and migration? [Completeness, Spec §Functional Requirements]
- [x] CHK003 Are acceptance scenarios defined for the highest-risk flows: multiple due tasks, blocked future completion, week/month date selection, and old localStorage handling? [Coverage, Spec §Acceptance Scenarios]
- [x] CHK004 Are non-goals and product boundaries documented clearly enough to prevent recurring tasks, reminders, drag-and-drop calendar behavior, accounts, backend work, cloud sync, AI verification, and sharing? [Completeness, Spec §Constitution Alignment, Spec §FR-022, Spec §SC-012]

## Scope Control

- [x] CHK005 Does the plan preserve the existing Vite/React/TypeScript app structure without introducing backend, login, database, cloud sync, or unnecessary dependencies? [Consistency, Plan §Technical Context, Plan §Project Structure]
- [x] CHK006 Is the calendar scope constrained to lightweight daily/weekly/monthly planning rather than full calendar management? [Clarity, Spec §FR-009, UX Brief §Monthly View Layout, Research §Avoid a Calendar Library]
- [x] CHK007 Are large calendar libraries and component libraries explicitly avoided unless future implementation proves a documented need? [Scope Control, Plan §Technical Context, Research §Avoid a Calendar Library]

## Data Model Correctness

- [x] CHK008 Is the V2 task entity specified with id, title, scheduled date, created/updated timestamps, completion timestamp, and proof note fields? [Completeness, Data Model §ScheduledTask, Spec §Key Entities]
- [x] CHK009 Are task identity and duplicate-completion rules tied to task id rather than local date, so multiple tasks can exist on one day? [Consistency, Plan §Data And Persistence Plan, Data Model §Relationships]
- [x] CHK010 Are completed-task invariants specified so completed tasks have both completed timestamp and proof note and incomplete tasks do not? [Clarity, Data Model §ScheduledTask]
- [x] CHK011 Are derived status rules documented for planned, due-today, missed, and completed states? [Completeness, Data Model §TaskStatus, Spec §FR-020]
- [x] CHK012 Are all derived view submodels fully specified, including fields for `ScheduledTaskWithStatus`, `DaySummary`, `MonthWeek`, and `MonthDaySummary`? [Gap, Data Model §DayViewModel, Data Model §WeekViewModel, Data Model §MonthViewModel]

## Local Date Handling

- [x] CHK013 Is local date identity specified as browser/device local `YYYY-MM-DD`, not UTC, across the spec, assumptions, and data model? [Consistency, Spec §Assumptions, Data Model §Overview, Plan §Data And Persistence Plan]
- [x] CHK014 Are status transitions based on comparing scheduled local date with today's local date, rather than timestamp-only logic? [Clarity, Spec §FR-020, Data Model §TaskStatus]
- [x] CHK015 Is the week-start rule deterministic enough for implementation and unit tests, rather than only "locale-appropriate where practical"? [Ambiguity, Spec §Assumptions, Plan §Testing Plan]
- [x] CHK016 Are month boundary cases documented, including leading/trailing days and responsive alternatives for dense mobile grids? [Coverage, Spec §Edge Cases, UX Brief §Monthly View Layout, Data Model §MonthViewModel]
- [x] CHK048 Is local-day rollover represented so planned, due-today, and missed statuses are re-evaluated when the browser-local day changes while the app remains open? [Coverage, Spec §FR-033, Plan §Local date rule, Data Model §Re-evaluate Local Day, Tasks §T023/T034/T037]

## Migration Safety

- [x] CHK017 Is the old `daily-done:v1` shape identified and mapped to the new V2 task-list state? [Completeness, Plan §Migration Strategy, Data Model §LegacyDailyDoneStateV1]
- [x] CHK018 Are readable legacy completions required to preserve local date, task title snapshot, proof note, and completion timestamp? [Completeness, Spec §FR-024, Data Model §Migration rules]
- [x] CHK019 Are corrupt or unsupported legacy payloads required to be ignored safely without false saved/completed state? [Clarity, Spec §FR-023, Data Model §Migration rules]
- [x] CHK020 Is migrated task id generation and duplicate handling specified clearly enough for deterministic migration tests? [Gap, Plan §Migration Strategy, Data Model §LegacyDailyDoneStateV1]
- [x] CHK021 Is the plan clear that V1 data is read for migration but not deleted or mutated? [Recovery, Plan §Migration Strategy, Data Model §Migration rules]

## Daily View UX

- [x] CHK022 Is the daily view specified as the default and primary work surface? [Completeness, Spec §FR-007, UX Brief §Daily View Layout]
- [x] CHK023 Are daily view hierarchy requirements documented for header, view switcher, date navigation, add-task action, task list, and summary? [Clarity, UX Brief §Daily View Layout]
- [x] CHK024 Are requirements clear that only one proof-note flow should be open at a time to prevent clutter? [Clarity, Plan §Interaction Rules, UX Brief §Daily View Layout]
- [x] CHK025 Are daily empty-state copy and primary action requirements defined? [Coverage, Spec §FR-025, UX Brief §Empty States]

## Weekly View UX

- [x] CHK026 Are weekly view requirements defined as short-term planning grouped by seven local days? [Completeness, Spec §FR-008, UX Brief §Weekly View Layout]
- [x] CHK027 Is date selection behavior from weekly view specified consistently as opening daily view for the selected date? [Consistency, Spec §FR-011, UX Brief §Weekly View Layout]
- [x] CHK028 Are weekly responsive requirements defined for stacked mobile sections and readable desktop layouts? [Coverage, UX Brief §Weekly View Layout, Plan §Responsive Layout]

## Monthly View UX

- [x] CHK029 Are monthly requirements scoped to lightweight planning and overview with per-day counts/status rather than heavy calendar management? [Clarity, Spec §FR-009, UX Brief §Monthly View Layout]
- [x] CHK030 Is date selection behavior from monthly view specified consistently as opening daily view for the selected date? [Consistency, Spec §FR-012, UX Brief §Monthly View Layout]
- [x] CHK031 Are mobile alternatives specified when a monthly grid becomes too dense at 375px? [Coverage, UX Brief §Monthly View Layout, Plan §Responsive Layout]

## Task Completion Verification

- [x] CHK032 Are proof-note validation requirements specified with the 10-character trimmed minimum and visible recovery behavior? [Completeness, Spec §FR-015, UX Brief §Complete-Task Proof-Note Flow]
- [x] CHK033 Are future tasks clearly specified as planned and not actionable for completion before their scheduled date? [Clarity, Spec §FR-017, UX Brief §Future-Task Behavior]
- [x] CHK034 Are missed tasks specified as still completable with a valid proof note and without shame-heavy UX language? [Coverage, Spec §FR-018, UX Brief §Task Card States]
- [x] CHK035 Are completed tasks specified as read-only with no duplicate completion path? [Consistency, Spec §FR-005, Spec §FR-016, UX Brief §Task Card States]

## Accessibility

- [x] CHK036 Are accessible labels and visible focus requirements defined for forms, view switching, date navigation, day cells, and task actions? [Coverage, Spec §FR-027, Spec §FR-028, UX Brief §Accessibility Requirements]
- [x] CHK037 Are validation errors required to be associated with relevant fields and recoverable through clear instructions? [Clarity, Spec §FR-029, UX Brief §Error States]
- [x] CHK038 Are status states required to be perceivable without relying on color alone? [Accessibility, Spec §FR-021, UX Brief §Task Card States]
- [x] CHK039 Are keyboard flow requirements defined for switching views, selecting dates, adding/editing tasks, entering proof, completion, and reviewing completed notes? [Coverage, Spec §FR-028, UX Brief §Accessibility Requirements]

## Playwright Testability

- [x] CHK040 Are Playwright coverage requirements traceable to daily, weekly, monthly, future-task, completion, migration, responsive, keyboard, and console-error flows? [Completeness, Spec §FR-031, Plan §Playwright E2E]
- [x] CHK041 Are unit-test targets defined for date helpers, week/month generation, grouping, status derivation, validation, storage, and migration? [Completeness, Plan §Unit Tests]
- [x] CHK042 Are localStorage isolation and legacy-state seeding requirements documented for browser tests? [Clarity, Plan §Playwright E2E, Quickstart §Legacy Migration]
- [x] CHK043 Are Definition of Done verification commands and expected outcomes documented without introducing implementation-specific test code? [Measurability, Quickstart §Commands, Quickstart §Definition of Done]

## Regression Risk Against Original App

- [x] CHK044 Are original proof-note verification semantics preserved in the new per-task completion model? [Consistency, Spec §FR-014, UX Brief §Complete-Task Proof-Note Flow]
- [x] CHK045 Are legacy completion records required to preserve original task title snapshots and proof notes after migration? [Regression, Spec §FR-024, Data Model §Migration rules]
- [x] CHK046 Are storage failure requirements preserved so the app does not present unsaved tasks or completions as saved? [Regression, Plan §Interaction Rules, UX Brief §Error States]
- [x] CHK047 Does the spec explicitly state whether the original streak/history presentation is retained, replaced by calendar summaries, or intentionally removed? [Gap, Spec §Constitution Alignment, Plan §Architecture]

## Resolved Artifact Changes

- **CHK012**: Resolved in [data-model.md](../data-model.md) by defining `ScheduledTaskWithStatus`, `DaySummary`, `MonthWeek`, and `MonthDaySummary` fields, including task counts, completed counts, status summaries, and adjacent-month handling.
- **CHK015**: Resolved in [spec.md](../spec.md), [data-model.md](../data-model.md), [plan.md](../plan.md), and [quickstart.md](../quickstart.md) by specifying Monday-through-Sunday weeks.
- **CHK020**: Resolved in [data-model.md](../data-model.md) and [plan.md](../plan.md) by specifying deterministic migrated ids and collision suffix handling.
- **CHK047**: Resolved in [spec.md](../spec.md), [plan.md](../plan.md), and [quickstart.md](../quickstart.md) by stating that calendar summaries replace the original streak/history UI while migrated completions remain visible as completed scheduled tasks.
- **CHK048**: Resolved in [spec.md](../spec.md), [plan.md](../plan.md), [data-model.md](../data-model.md), [quickstart.md](../quickstart.md), and [tasks.md](../tasks.md) by requiring refreshed browser-local current-date evaluation for status-sensitive logic.

## Summary

- Passing: 48/48
- Gaps: 0/48
- Overall readiness: ready for task generation after user approval.
