# Implementation Plan: Build Daily Done

**Branch**: `001-build-daily-done` | **Date**: 2026-07-09 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-build-daily-done/spec.md`

## Summary

Build Daily Done as a small local-first single-page web app for one person to
verify one daily task with an intentional proof/reflection note. The
implementation will use Vite + React + TypeScript, browser localStorage, plain
CSS with a small CSS-variable design-token system, focused date/streak helper
logic, Playwright E2E coverage, and targeted Vitest unit tests for pure
date/streak helpers.

The existing repository already contains Spec Kit assets and Playwright files.
Implementation must scaffold the Vite app safely without overwriting `.specify/`,
`specs/`, or existing planning artifacts. If direct scaffold generation cannot
run in the non-empty root, implementation must either create a temporary Vite
React TypeScript project and copy only needed scaffold files, or manually create
the equivalent Vite files.

## Technical Context

**Language/Version**: TypeScript with React components in a Vite single-page app.

**Primary Dependencies**: Vite, React, React DOM, TypeScript, the Vite React
plugin, Playwright Test, and Vitest for helper unit tests. Keep runtime
dependencies minimal; do not add a component library.

**Storage**: localStorage only. No backend, database, cloud storage, or remote
persistence.

**Testing**: Playwright E2E for the critical flow; Vitest unit tests for pure
date/streak/history/storage/validation helpers when those helpers are created.

**Target Platform**: Mobile-first browser app, verified at 375px mobile width
and desktop width.

**Project Type**: Single-user local web app.

**Performance Goals**: First-time setup and completion flows remain usable
within the spec success criteria; local interactions should feel immediate
because all persistence is local.

**Constraints**: No login, backend, database, cloud sync, notifications, AI
verification, multi-task habit tracking, social sharing, or component library.
Use the browser/device local calendar date, not UTC. Use the UX brief as a
required design input.

**Scale/Scope**: One active task, local completion history, current streak, and
recent history for at least 7 completed days.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] Spec-first: [spec.md](./spec.md) exists, has been clarified, and this plan
      produces required design artifacts before tasks or implementation.
- [x] Approval gate: plan completion stops for explicit user approval before
      checklist/tasks/analyze/implementation phases continue.
- [x] Small scope: no login, accounts, backend, cloud sync, remote persistence,
      notifications, social features, or gamification beyond simple streak and
      history.
- [x] Local-first storage: user data uses localStorage only.
- [x] UX quality: [ux-design-brief.md](./ux-design-brief.md) defines
      mobile-first layout, accessible labels, keyboard usability, visible focus,
      clear empty states, validation errors, button hierarchy, and uncluttered
      visual direction.
- [x] Testing and done: Playwright E2E covers the critical flow; unit tests cover
      date/streak helpers where created; build, tests, mobile/desktop
      Playwright checks, and console-error verification are planned.

**Post-design re-check**: Phase 1 artifacts below preserve the same constraints:
localStorage only, no backend/contracts, mobile-first UI states, accessible form
behavior, and Playwright verification.

## Design Inputs

- [spec.md](./spec.md): Product requirements, clarified behavior, acceptance
  criteria, and success criteria.
- [ux-design-brief.md](./ux-design-brief.md): Product personality, visual
  direction, screen states, accessibility requirements, microcopy, and
  Playwright UX review checklist.
- [.specify/memory/constitution.md](../../.specify/memory/constitution.md):
  governance, local-first storage, approval gates, testing, and Definition of
  Done.

## Architecture

Daily Done will be a single React app with a small state/data layer:

- UI layer: React components for app shell, today task card, setup/edit forms,
  proof-note form, completed state, history/streak section, and change-task
  confirmation.
- Domain layer: pure helpers for local date formatting/parsing, completion
  uniqueness, history sorting, streak calculation, and validation.
- Persistence layer: a narrow localStorage adapter that reads/writes one
  versioned application state object and handles unavailable/corrupt storage
  gracefully.
- Styling layer: plain CSS or CSS modules, using CSS custom properties for
  colors, type scale, spacing, radii, borders, focus rings, and button states.
- Test layer: Playwright E2E for critical browser flows and Vitest unit tests
  for pure helper behavior.

## Vite Scaffold Strategy

Implementation must not overwrite `.specify/`, `specs/`, `.agents/`, `.codex/`,
or existing planning artifacts.

Preferred scaffold path:

1. Inspect current root files.
2. Add Vite/React/TypeScript/Vitest dependencies and scripts to `package.json`.
3. Create missing Vite-equivalent files manually or by copying from a temporary
   Vite React TypeScript project:
   - `index.html`
   - `vite.config.ts`
   - `tsconfig.json`
   - `tsconfig.node.json` if needed by the Vite setup
   - `src/main.tsx`
   - `src/App.tsx`
   - `src/styles/`
4. Preserve `playwright.config.ts`, `.specify/`, `specs/`, `.agents/`, `.codex/`,
   and existing documentation.
5. Replace the default Playwright example tests with Daily Done E2E coverage
   during implementation.

If `npm create vite@latest` or equivalent cannot run in the non-empty directory,
create the scaffold in a temporary directory and copy only the needed scaffold
files into the repo.

## UI Implementation Plan

### Design Tokens

Create a compact CSS-variable system, likely in `src/styles/tokens.css` or
`src/styles/global.css`:

- Color tokens: app background, surface, surface-muted, text, text-muted,
  border, accent, accent-contrast, success, danger, focus.
- Spacing tokens: page padding, card padding, section gap, control gap.
- Radius tokens: card radius, control radius.
- Typography tokens: font family, body size, small size, heading sizes, line
  height.
- Shadow/border tokens: minimal card border and optional restrained shadow.
- Focus token: visible focus ring that works on light surfaces.

### Responsive Layout

- Mobile first at 375px.
- Single-column layout by default.
- Center content in a readable max-width container on larger screens.
- Keep today's card visually dominant.
- History/streak remains below today's card or in a quiet secondary column only
  if it does not compete with the main action.
- Prevent horizontal scrolling and ensure long task names/proof notes wrap.

### Form And State Behavior

- Empty state: one primary action to set the daily task.
- Task setup/edit state: visible `Daily task` label, helper text, empty-name
  validation, focus movement into the field.
- Today incomplete state: visible local date, task name, status, proof note
  label, helper text, validation message, primary `Mark done` action.
- Proof-note validation error state: preserve entered text, associate error
  with the proof note field, keep or return focus to that field.
- Completed state: show local date, task-name snapshot, local completion time,
  read-only proof note, and no completion submission path.
- History/streak state: secondary section with recent completions and current
  streak; no charts, badges, or dense metrics.
- Change-task confirmation state: explicit confirmation, focus moves into the
  confirmation UI, cancel returns focus to the trigger, historical records are
  preserved.
- Loading state: no normal loading state is required because localStorage is
  synchronous; use a short initialization-safe render if needed to avoid flicker.
- Error state: storage unavailable/corrupt data should produce a persistent,
  recoverable local-storage error message, preserve current input when possible,
  offer a retry path, and never present a task or completion as saved until the
  write succeeds.
- Success state: calm completed state, perceivable by text and structure, not
  color alone.

### Button Hierarchy

- Primary button: the only dominant action in each state (`Set daily task`,
  `Save task`, `Mark done`, `Confirm change`).
- Secondary button: edit/change/cancel actions.
- Destructive styling: avoid unless an action actually deletes data. Changing
  task should read as cautious but not destructive because history remains.
- Disabled state: only use when the reason is clear from nearby validation or
  helper text.

## Data And Persistence Plan

Store one versioned app state object in localStorage. The plan does not require
an API or database.

- `settings`: active task metadata.
- `completions`: array or map of completion records keyed by local date.
- Derived data: current streak and sorted recent history are calculated from
  completions, not stored as authoritative state.
- Duplicate prevention: local date is the uniqueness rule; if a completion
  exists for the current local date, today's completion form is locked.
- Date rule: use browser/device local date at load/completion time formatted as
  `YYYY-MM-DD`; never use UTC for "today".
- Corrupt/unavailable storage: surface a visible error, preserve current input
  when possible, offer retry, and avoid silently reporting unsaved setup or
  completion as persisted.

## Testing Plan

### Unit Tests

Use Vitest for `npm run test`. Create unit tests when helpers exist for:

- Local date key generation/formatting with explicit reference dates.
- Streak calculation for consecutive local dates using a supplied
  `todayLocalDate`.
- Streak ending today when today is complete.
- Streak ending yesterday when today is incomplete.
- Duplicate completion detection by local date.
- Sorting/recent-history selection.
- Storage recovery behavior for unavailable/corrupt localStorage.

### Playwright E2E

E2E coverage must include:

1. First-time task setup.
2. Validation error when proof note is missing.
3. Validation error when proof note is too short.
4. Successful completion with valid proof note.
5. Persistence after reload.
6. Duplicate completion prevention for the same local date.
7. Task change confirmation preserving history.
8. Mobile 375px layout check.
9. Desktop layout check.
10. Keyboard path through setup, proof entry, completion, and change-task
    confirmation/cancellation.
11. Console-error check during the critical flow.

Configure Playwright `webServer` to run the Vite dev server for tests and use a
local base URL. Each E2E scenario should clear the `daily-done:v1` localStorage
key before setup; scenarios that need history or streak data should seed state
explicitly through the UI or a documented test helper so tests do not depend on
execution order. Keep browser coverage pragmatic: at minimum Chromium for the
critical flow, with mobile and desktop viewport projects or explicit viewport
tests. Use Playwright for real-browser UX verification; if
`playwright-interactive` is available in the working environment, it may be used
for an additional visual/interaction review against the same checklist. After
implementation, run the product-designer UX review with Playwright evidence.

## Project Structure

### Documentation (this feature)

```text
specs/001-build-daily-done/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── ux-design-brief.md
├── tasks.md
└── checklists/
    ├── requirements.md
    └── quality.md
```

Contracts are intentionally omitted because the app has no backend, public API,
or external integration contract.

### Source Code (repository root)

```text
index.html
vite.config.ts
tsconfig.json
tsconfig.node.json

src/
├── main.tsx
├── App.tsx
├── components/
│   ├── AppShell.tsx
│   ├── TaskSetupForm.tsx
│   ├── TodayCard.tsx
│   ├── ProofNoteForm.tsx
│   ├── CompletionSummary.tsx
│   ├── HistoryList.tsx
│   └── ChangeTaskConfirmation.tsx
├── lib/
│   ├── date.ts
│   ├── streak.ts
│   ├── history.ts
│   ├── storage.ts
│   └── validation.ts
└── styles/
    ├── tokens.css
    └── global.css

tests/
├── e2e/
│   ├── configure-complete.spec.ts
│   ├── return-review.spec.ts
│   └── change-task.spec.ts
└── unit/
    ├── date.test.ts
    ├── streak.test.ts
    ├── validation.test.ts
    ├── storage.test.ts
    ├── history.test.ts
    └── task-change.test.ts
```

**Structure Decision**: Use a single root Vite app with feature-focused
components, pure domain helpers in `src/lib/`, plain CSS/CSS variables in
`src/styles/`, Playwright E2E under `tests/e2e/`, and helper unit tests under
`tests/unit/`. This keeps the app small and avoids backend or package
workspace complexity.

## Complexity Tracking

No constitution violations or complexity exceptions are required.
