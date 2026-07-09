# Research: Multi-task Scheduling and Calendar Views

## Decision: Use Native Date Helpers, Not a Date Library

**Rationale**: The feature needs local date keys, date comparison, week
generation, month overview generation, and add-days behavior. These needs are
small enough for pure helpers built on native `Date` objects using local
constructors. Avoiding a dependency keeps the app lightweight and matches the
existing implementation.

**Alternatives considered**:

- Add a date utility library: rejected because it adds dependency surface for a
  small local-date helper set.
- Store timestamps only: rejected because the product requirements are based on
  local calendar dates, not instants.
- Use UTC dates for identity: rejected because the spec requires browser/device
  local dates.

## Decision: Avoid a Calendar Library

**Rationale**: Weekly and monthly views are summaries for planning and date
selection, not heavy calendar management. A calendar library would add size,
configuration, styling complexity, and likely unwanted behaviors such as time
slots, drag/drop, recurrence, or event concepts.

**Alternatives considered**:

- Full calendar library: rejected as over-scoped for lightweight month overview
  and weekly grouping.
- CSS-only static grid with no helpers: rejected because week/month generation
  and task grouping need testable domain logic.

## Decision: Introduce V2 Task-list localStorage State

**Rationale**: The current V1 state is shaped around one active task and one
completion per local date. Multiple tasks per day require task identity and
completion state per task. V2 state should store tasks in one localStorage
object while reading V1 data for migration.

**Alternatives considered**:

- Mutate V1 shape in place: rejected because it risks corrupting rollback data
  and mixes legacy assumptions with the new model.
- Store separate keys per date: rejected because it complicates migration,
  validation, export/debugging, and atomic writes.
- Use browser IndexedDB: rejected because localStorage remains sufficient for
  personal-scale data and is required by the constitution unless justified.

## Decision: Migrate Readable V1 Data and Ignore Unsupported Legacy Data Safely

**Rationale**: Existing users should not lose readable completion history, but
corrupt legacy data must not block the new app or create false saved/completed
states. Migrating readable completions into scheduled tasks preserves the core
verification record.

**Alternatives considered**:

- Hard fail on legacy corruption: rejected because the spec requires the app not
  to break.
- Delete old data automatically: rejected because it is destructive and not
  required.
- Show every legacy read issue to the user: rejected because unsupported legacy
  data can be ignored safely unless current save/read behavior is affected.

## Decision: Derive Views from Task Records

**Rationale**: Day, week, and month views are projections over the same task
array. Deriving view models avoids duplicated state and makes grouping/counting
logic easy to unit test.

**Alternatives considered**:

- Persist separate day/week/month summaries: rejected because summaries can get
  stale and introduce write complexity.
- Keep separate arrays per date: rejected because task editing across dates
  becomes harder and migration becomes less direct.

## Decision: Derive Status from Scheduled Date and Completion Fields

**Rationale**: Planned, due today, missed, and completed are not independent
user-entered values. They are deterministic outcomes from `scheduledDate`,
`completedAt`, `proofNote`, and the current local date.

**Alternatives considered**:

- Store mutable status strings: rejected because stale status is likely when the
  local day changes.
- Store separate missed/completed flags: rejected because completion timestamp
  and proof note already define completion, and missed is date-derived.

## Decision: Keep Existing Test Stack

**Rationale**: The project already uses Vitest for helper logic and Playwright
for browser-level flows. The new risk areas map directly to those tools:
calendar/date/status/migration logic in unit tests, and real user flows in
Playwright.

**Alternatives considered**:

- Add a separate accessibility testing dependency: deferred; Playwright can
  verify labels, keyboard paths, focus, and visible states for this feature.
- Manual browser QA only: rejected because the constitution requires Playwright
  E2E coverage for critical flows.
