# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]

**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

[Extract from feature spec: primary requirement + technical approach from research]

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: [e.g., TypeScript, JavaScript, or NEEDS CLARIFICATION]

**Primary Dependencies**: [e.g., Vite, React, date utility library, Playwright, or NEEDS CLARIFICATION]

**Storage**: [MUST be localStorage unless the plan justifies another browser-local choice; no backend/cloud storage without constitution amendment]

**Testing**: [MUST include Playwright E2E for the critical flow; include unit tests where valuable, especially date/streak/history logic]

**Target Platform**: [mobile-first browser app or NEEDS CLARIFICATION]

**Project Type**: [single-user local web app or NEEDS CLARIFICATION]

**Performance Goals**: [user-focused, e.g., primary flow completes in under 10 seconds, no horizontal scroll at 360px, or NEEDS CLARIFICATION]

**Constraints**: [local-first, no login/backend/cloud sync/notifications, accessible and keyboard usable, or NEEDS CLARIFICATION]

**Scale/Scope**: [single-user Daily Done scope; simple streak/history only, or NEEDS CLARIFICATION]

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [ ] Spec-first: spec.md exists and this plan will produce all required design
      artifacts before tasks or implementation.
- [ ] Approval gate: plan completion stops for explicit user approval before the
      checklist/tasks/analyze/implementation phases continue.
- [ ] Small scope: no login, accounts, backend, cloud sync, remote persistence,
      notifications, social features, or gamification beyond simple
      streak/history.
- [ ] Local-first storage: user data uses localStorage, or a browser-local
      alternative is justified with necessity, migration impact, and failure
      behavior.
- [ ] UX quality: mobile-first layout, accessible labels, keyboard usability,
      visible focus, clear empty states, clear validation errors, and no clutter
      are planned.
- [ ] Testing and done: Playwright E2E covers the critical flow; unit tests cover
      high-risk date/streak/history logic where valuable; build, tests, and
      console-error verification are planned.

Unchecked items are gate failures. Document only constitution-compliant
exceptions in Complexity Tracking.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
src/
├── components/
├── lib/
├── styles/
└── main entry point

tests/
├── e2e/
└── unit/
```

**Structure Decision**: [Document the selected structure and reference the real
directories captured above]

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Storage abstraction beyond localStorage wrapper] | [specific problem] | [why direct localStorage access insufficient] |
