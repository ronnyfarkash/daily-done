# Quality Checklist: Build Daily Done

**Purpose**: Evaluate Daily Done spec and plan quality before task generation
**Created**: 2026-07-09
**Feature**: [spec.md](../spec.md)
**Reviewed Inputs**: [plan.md](../plan.md), [ux-design-brief.md](../ux-design-brief.md), [data-model.md](../data-model.md), [quickstart.md](../quickstart.md), [constitution.md](../../../.specify/memory/constitution.md)
**Evaluation Rule**: Checked items are adequately covered by current artifacts. Unchecked items are requirement or planning gaps to address before tasks.

## Requirements Clarity

- [x] CHK001 Is "verify completed" defined as user self-attestation through a proof/reflection note, with external, AI, sensor, and real-world verification explicitly excluded? [Clarity, Spec §Clarifications, Spec §FR-006]
- [x] CHK002 Are the primary user flows separated into independently testable setup, completion, return/review, and task-change scenarios? [Completeness, Spec §User Scenarios & Testing]
- [x] CHK003 Are proof-note validation requirements specific enough to avoid ambiguity around empty text, whitespace, and minimum length? [Clarity, Spec §FR-007, Spec §Edge Cases]
- [x] CHK004 Are completion record fields and read-only behavior clearly specified for today's completed state and history snapshots? [Completeness, Spec §FR-008, Spec §FR-012, Spec §FR-017, Data Model §CompletionRecord]
- [x] CHK005 Are success criteria measurable for setup time, completion time, validation rejection, persistence, duplicate prevention, history, streak, responsive layout, keyboard use, and Playwright coverage? [Measurability, Spec §Success Criteria]

## UX/Accessibility

- [x] CHK006 Are the product personality and visual hierarchy requirements defined consistently across the spec, UX brief, and plan? [Consistency, Spec §Constitution Alignment, UX Brief §Product Personality, Plan §Design Inputs]
- [x] CHK007 Are mobile-first and desktop layout requirements specific enough to preserve a focused app rather than a dashboard? [Clarity, Spec §FR-022, UX Brief §Mobile-First Layout, UX Brief §Desktop Layout, Plan §Responsive Layout]
- [x] CHK008 Are first-time empty, setup, incomplete, validation-error, completed, history/streak, and change-task states all specified? [Completeness, UX Brief §First-Time Empty State, UX Brief §Change-Task Confirmation State, Plan §Form And State Behavior]
- [x] CHK009 Are accessible labels, visible focus, keyboard navigation, and focus-management requirements defined for all primary interactions? [Coverage, Spec §FR-019, Spec §FR-020, Spec §FR-026, UX Brief §Accessible Labels And Keyboard Navigation]
- [x] CHK010 Are validation errors required to be visible, field-associated, specific, and recovery-oriented? [Clarity, Spec §FR-021, UX Brief §Proof-Note Validation Error State]
- [x] CHK011 Are status, validation, and read-only states required to be perceivable without relying on color alone? [Accessibility, Spec §FR-027, UX Brief §Accessible Labels And Keyboard Navigation]

## Local Persistence

- [x] CHK012 Is localStorage the only accepted persistence mechanism, with backend, database, cloud storage, and remote persistence excluded? [Scope, Spec §FR-009, Plan §Technical Context, Constitution §IV]
- [x] CHK013 Is the persisted state shape documented with version, active task settings, and completion records? [Completeness, Data Model §AppState]
- [x] CHK014 Is duplicate completion prevention tied to a unique localDate completion record rather than task name, timestamp, or UI state? [Clarity, Spec §FR-011, Data Model §CompletionRecord, Plan §Data And Persistence Plan]
- [x] CHK015 Are corrupt payloads and unavailable storage identified as edge cases rather than ignored? [Coverage, Spec §Edge Cases, Data Model §AppState, Plan §Form And State Behavior]
- [x] CHK016 Does the spec define the exact user-facing recovery path when localStorage cannot be read or written, including whether input is preserved, whether retry is available, and whether completion may be shown before persistence succeeds? [Clarity, Spec §FR-028, Plan §Data And Persistence Plan]

## Date/Streak Correctness

- [x] CHK017 Is "today" defined as the browser/device local calendar date at load and completion time, never UTC? [Clarity, Spec §FR-010, UX Brief §Behavioral Design Rules, Data Model §Overview]
- [x] CHK018 Is the local date identity format documented as `YYYY-MM-DD` and separate from full timestamps used for display or ordering? [Clarity, Data Model §Overview, Data Model §CompletionRecord]
- [x] CHK019 Are current streak rules defined for the cases where today is complete, today is incomplete but yesterday is complete, and neither today nor yesterday is complete? [Completeness, Spec §FR-015, Data Model §CurrentStreak]
- [x] CHK020 Are timezone-change assumptions documented so historical local dates remain preserved while new actions use the current device local date? [Assumption, Spec §Edge Cases, Spec §Assumptions]
- [x] CHK021 Are deterministic date/streak test inputs specified enough to avoid relying on real waiting, current clock timing, or environment timezone behavior during unit and E2E validation? [Clarity, Plan §Testing Plan, Quickstart §Unit Validation]

## Testability

- [x] CHK022 Are acceptance scenarios and success criteria written in a form that can map to E2E and unit test coverage? [Measurability, Spec §Acceptance Scenarios, Spec §Success Criteria]
- [x] CHK023 Are pure helper responsibilities identified for local date keys, duplicate detection, history sorting, and streak calculation? [Completeness, Plan §Architecture, Plan §Testing Plan]
- [x] CHK024 Is the unit test runner and `npm run test` ownership defined clearly enough for tasks to implement helper tests without inventing a new testing choice? [Clarity, Plan §Testing Plan, Quickstart §Expected Project Commands]
- [x] CHK025 Is console-error verification included in the planned Definition of Done coverage? [Coverage, Plan §Testing Plan, Quickstart §Done Criteria, Constitution §VII]
- [x] CHK026 Are manual validation expectations and automated validation expectations separated clearly enough to avoid treating manual checks as a substitute for Playwright coverage? [Clarity, Quickstart §Manual Validation Flow, Quickstart §Playwright Validation]

## Scope Control

- [x] CHK027 Are non-goals and excluded product areas explicit enough to prevent login, backend, notifications, AI verification, social sharing, cloud sync, or multi-task expansion? [Scope, Spec §Constitution Alignment, Spec §Assumptions, Plan §Constraints]
- [x] CHK028 Are allowed gamification elements limited to simple streak and recent history? [Scope, Spec §Constitution Alignment, Spec §FR-014, Spec §FR-015]
- [x] CHK029 Are implementation dependencies constrained to Vite, React, TypeScript, Playwright, localStorage, and plain CSS without a component library? [Scope, Plan §Technical Context]
- [x] CHK030 Are backend/API contracts intentionally omitted rather than invented for a local-only feature? [Consistency, Plan §Project Structure, Research §Decision]
- [x] CHK031 Is the Vite scaffold plan constrained to avoid overwriting `.specify/`, `specs/`, `.agents/`, `.codex/`, and existing planning artifacts? [Scope, Plan §Vite Scaffold Strategy]

## Playwright E2E Readiness

- [x] CHK032 Are the required Playwright E2E scenarios listed for first-time setup, invalid notes, valid completion, persistence, duplicate prevention, and task-change confirmation? [Completeness, Spec §FR-025, Plan §Playwright E2E, Quickstart §Playwright Validation]
- [x] CHK033 Are mobile 375px and desktop layout expectations included in Playwright readiness rather than only manual review? [Coverage, Spec §SC-011, Plan §Playwright E2E, Quickstart §Playwright Validation]
- [x] CHK034 Does the plan define how each Playwright scenario isolates or seeds localStorage so duplicate-prevention, persistence, and history/streak tests do not depend on previous test order? [Clarity, Plan §Playwright E2E, Quickstart §Playwright Validation]
- [x] CHK035 Are keyboard-only path and focus behavior included in Playwright readiness for setup, proof entry, completion, and change-task confirmation/cancellation? [Coverage, Spec §SC-010, Spec §SC-012, Plan §Playwright E2E]
- [x] CHK036 Is real-browser UX verification included for both standard Playwright and optional interactive review when available? [Completeness, Plan §Testing Plan, Quickstart §Playwright Validation]

## Resolved Analyze Findings

- **REC-001 for CHK016**: Resolved in spec, plan, quickstart, and tasks by defining persistent storage error handling, input preservation where possible, retry, and no false saved/completed state before persistence succeeds.
- **REC-002 for CHK021**: Resolved in plan, quickstart, and tasks by requiring explicit local date keys or supplied `todayLocalDate` values for deterministic date/streak tests.
- **REC-003 for CHK024**: Resolved in plan, quickstart, and tasks by selecting Vitest for helper unit tests and `npm run test`.
- **REC-004 for CHK034**: Resolved in plan, quickstart, and tasks by requiring Playwright localStorage clearing and explicit history/streak seeding.

## Notes

- Focus areas selected: requirements clarity, UX/accessibility, local persistence, date/streak correctness, testability, scope control, and Playwright E2E readiness.
- Depth level: standard pre-task quality gate.
- Actor/timing: author/reviewer checkpoint after plan artifacts and before task generation.
- Explicit must-have items incorporated: all user-requested checklist categories and the Daily Done constitution gates for local-first scope, UX quality, Playwright coverage, and approval sequencing.
