<!--
Sync Impact Report
Version change: unratified template -> 1.0.0
Modified principles:
- Placeholder principle 1 -> I. Spec-First Development
- Placeholder principle 2 -> II. Human Approval Gate
- Placeholder principle 3 -> III. Keep Scope Small
- Placeholder principle 4 -> IV. Local-First Storage
- Placeholder principle 5 -> V. UX Quality
- Added principle 6 -> VI. Testing Discipline
- Added principle 7 -> VII. Definition of Done
Added sections:
- Scope Boundaries
- Development Workflow & Quality Gates
Removed sections:
- None. Placeholder examples were replaced with project-specific governance.
Templates requiring updates:
- Updated: .specify/templates/plan-template.md
- Updated: .specify/templates/spec-template.md
- Updated: .specify/templates/tasks-template.md
- Updated: .specify/templates/checklist-template.md
- Updated: .specify/workflows/speckit/workflow.yml
- Updated: .specify/workflows/workflow-registry.json
- Not present: .specify/templates/commands/
Follow-up TODOs:
- None
-->
# Daily Done Constitution

## Core Principles

### I. Spec-First Development
Every feature MUST complete the Spec Kit sequence before implementation begins:
feature specification, implementation plan, checklist, implementation tasks, and
cross-artifact analysis. Implementation MUST NOT begin while any required
artifact is missing, incomplete, or carrying unresolved critical constitution
conflicts. Rationale: Daily Done is intentionally small, and up-front decisions
prevent accidental backend, auth, sync, or UX scope creep.

### II. Human Approval Gate
After creating or updating the constitution, specification, plan, checklist,
tasks, or analysis, the agent MUST stop, summarize the decisions and artifacts,
and wait for explicit human approval before invoking the next phase. Approval
MUST be an affirmative user instruction to proceed, not silence or an inferred
preference. Rationale: the project owner controls scope, sequencing, and
acceptance of each phase.

### III. Keep Scope Small
Daily Done MUST remain a single-user, local task and habit app. Features MUST
NOT add login, accounts, backend services, cloud sync, remote persistence,
notifications, social features, or gamification beyond simple streak and
history. Any exception requires an explicit constitution amendment before the
feature spec or plan can be accepted. Rationale: the product value depends on a
focused, low-maintenance local experience.

### IV. Local-First Storage
User data MUST be stored in browser localStorage. A plan MAY propose a different
browser-local storage mechanism only when localStorage cannot satisfy a
documented requirement; that plan MUST explain the necessity, migration impact,
failure behavior, and why the choice does not introduce backend or cloud scope.
Rationale: localStorage keeps the app private, offline-capable, and free of
infrastructure commitments.

### V. UX Quality
The app MUST be mobile-first, keyboard usable, and accessible to assistive
technology. Every interactive control MUST have an accessible label and visible
focus treatment. Empty states MUST explain the current state and available
action. Validation errors MUST state the problem and recovery action. Screens
MUST stay uncluttered and focused on the daily completion flow. Rationale:
Daily Done is used repeatedly, so friction and ambiguity compound quickly.

### VI. Testing Discipline
Every implemented feature MUST include Playwright end-to-end coverage for its
critical user flow. Unit tests MUST be added where they materially reduce risk,
especially date, streak, and history logic. Test tasks MUST appear explicitly in
tasks.md and trace to acceptance criteria or constitution requirements.
Rationale: browser-level coverage protects the core workflow, while focused unit
tests protect logic that is easy to regress.

### VII. Definition of Done
A feature is done only when the app builds successfully, all required tests
pass, Playwright verifies the core flow in a real browser, and the verified flow
has no obvious console errors. Completion reports MUST list the commands run and
any remaining verification gaps. Rationale: completion requires working,
verified user behavior, not just code changes.

## Scope Boundaries

- Daily Done is a browser-based, single-user application for tracking daily
  completion and a simple streak/history.
- The accepted scope excludes login, user accounts, backend APIs, server-side
  storage, cloud sync, push/email/in-app notifications, social mechanics, and
  gamification beyond simple streak/history.
- User data persistence defaults to localStorage. Any other browser-local
  storage proposal is a plan-level exception that must pass the constitution
  check before approval.
- Date, streak, and history behavior must be specified in user-visible terms
  before implementation. Ambiguous date boundaries are a planning blocker.
- UI work must prioritize mobile screens first, then larger breakpoints without
  adding clutter or hidden desktop-only workflows.

## Development Workflow & Quality Gates

The required phase order is:

1. Constitution update or confirmation, then stop for approval.
2. Feature specification, then stop for approval.
3. Implementation plan with research/design artifacts, then stop for approval.
4. Feature checklist, then stop for approval.
5. Implementation tasks, then stop for approval.
6. Cross-artifact analysis, then stop for approval.
7. Implementation and verification.

Plans MUST include a Constitution Check that evaluates spec-first readiness,
approval gates, small-scope boundaries, localStorage persistence, UX quality,
testing coverage, and Definition of Done verification. Tasks MUST include
Playwright coverage for the critical flow, unit tests for high-risk logic where
valuable, build/test commands, and browser-console verification. Analysis MUST
treat any constitution violation as CRITICAL.

## Governance

This constitution supersedes conflicting guidance in specs, plans, tasks,
workflow files, and implementation notes. Amendments require an explicit user
request, an updated Sync Impact Report, and propagation to affected templates or
workflows in the same change. Features already in progress MUST be reviewed
against amended principles before implementation continues.

Versioning follows semantic versioning:

- MAJOR for removed or redefined principles that change existing governance.
- MINOR for new principles, new required sections, or materially expanded gates.
- PATCH for wording clarifications, typo fixes, or non-semantic refinements.

Compliance is reviewed at every Spec Kit phase. Specs, plans, checklists, tasks,
analysis reports, and implementation completion reports MUST state or enforce
their relevant constitution obligations. Unresolved constitution violations block
approval of the next phase.

## Design quality principle
Every user-facing feature must be understandable, attractive, accessible, and ready for real use without requiring a separate UX designer. Before implementation, the agent must create a UX design brief covering screen states, hierarchy, copy, accessibility, responsive behavior, and browser-review criteria. After implementation, the agent must review the result using the product-designer skill and Playwright where available.

**Version**: 1.0.0 | **Ratified**: 2026-07-09 | **Last Amended**: 2026-07-09
