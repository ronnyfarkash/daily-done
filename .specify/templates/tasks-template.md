---

description: "Task list template for feature implementation"
---

# Tasks: [FEATURE NAME]

**Input**: Design documents from `/specs/[###-feature-name]/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Playwright E2E coverage for the critical flow is REQUIRED. Add unit
tests where they add value, especially date/streak/history logic.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- **Daily Done web app**: `src/`, `tests/e2e/`, and `tests/unit/` at
  repository root
- Paths shown below assume the constitution's single-user local web app scope -
  adjust only when plan.md documents a constitution-compliant exception

<!--
  ============================================================================
  IMPORTANT: The tasks below are SAMPLE TASKS for illustration purposes only.

  The /speckit-tasks command MUST replace these with actual tasks based on:
  - User stories from spec.md (with their priorities P1, P2, P3...)
  - Feature requirements from plan.md
  - Entities from data-model.md
  - UI contracts or local interfaces from contracts/

  Tasks MUST be organized by user story so each story can be:
  - Implemented independently
  - Tested independently
  - Delivered as an MVP increment

  DO NOT keep these sample tasks in the generated tasks.md file.
  ============================================================================
-->

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create project structure per implementation plan
- [ ] T002 Initialize [language] project with [framework] dependencies
- [ ] T003 [P] Configure linting and formatting tools

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

Examples of foundational tasks (adjust based on your project):

- [ ] T004 Create localStorage persistence boundary in src/lib/storage.[ext]
- [ ] T005 [P] Implement date/streak utility boundaries in src/lib/date.[ext]
- [ ] T006 [P] Create mobile-first app shell and focus styles
- [ ] T007 Create base data types/entities that all stories depend on
- [ ] T008 Configure validation error and empty-state patterns
- [ ] T009 Configure Playwright and test scripts for the critical flow

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - [Title] (Priority: P1) 🎯 MVP

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 1 (REQUIRED) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T010 [P] [US1] Playwright test for [critical flow] in tests/e2e/[name].spec.ts
- [ ] T011 [P] [US1] Unit test for [date/streak/history logic if applicable] in tests/unit/[name].test.ts

### Implementation for User Story 1

- [ ] T012 [P] [US1] Create [Entity1] type or schema in src/lib/[entity1].[ext]
- [ ] T013 [P] [US1] Create [Component] UI in src/components/[component].[ext]
- [ ] T014 [US1] Implement localStorage interaction in src/lib/storage.[ext] (depends on T012)
- [ ] T015 [US1] Implement [feature] flow in src/[location]/[file].[ext]
- [ ] T016 [US1] Add validation errors, empty state, accessible labels, and focus handling
- [ ] T017 [US1] Wire Playwright console-error checks for user story 1 flow

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - [Title] (Priority: P2)

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 2 (REQUIRED FOR CRITICAL FLOW) ⚠️

- [ ] T018 [P] [US2] Playwright test for [user journey] in tests/e2e/[name].spec.ts
- [ ] T019 [P] [US2] Unit test for [date/streak/history logic if applicable] in tests/unit/[name].test.ts

### Implementation for User Story 2

- [ ] T020 [P] [US2] Create [Entity] type or schema in src/lib/[entity].[ext]
- [ ] T021 [US2] Implement local state/storage update in src/lib/[feature].[ext]
- [ ] T022 [US2] Implement [feature] UI in src/[location]/[file].[ext]
- [ ] T023 [US2] Integrate with User Story 1 components (if needed)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - [Title] (Priority: P3)

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 3 (REQUIRED FOR CRITICAL FLOW) ⚠️

- [ ] T024 [P] [US3] Playwright test for [user journey] in tests/e2e/[name].spec.ts
- [ ] T025 [P] [US3] Unit test for [date/streak/history logic if applicable] in tests/unit/[name].test.ts

### Implementation for User Story 3

- [ ] T026 [P] [US3] Create [Entity] type or schema in src/lib/[entity].[ext]
- [ ] T027 [US3] Implement local state/storage update in src/lib/[feature].[ext]
- [ ] T028 [US3] Implement [feature] UI in src/[location]/[file].[ext]

**Checkpoint**: All user stories should now be independently functional

---

[Add more user story phases as needed, following the same pattern]

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] TXXX [P] Documentation updates in docs/
- [ ] TXXX Code cleanup and refactoring
- [ ] TXXX Accessibility and keyboard usability pass across all stories
- [ ] TXXX [P] Additional unit tests for risky date/streak/history paths in tests/unit/
- [ ] TXXX Scope audit: verify no login, backend, cloud sync, notifications, or unsupported gamification
- [ ] TXXX Run quickstart.md validation
- [ ] TXXX Run build and all tests
- [ ] TXXX Run Playwright in a real browser and verify no obvious console errors

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable

### Within Each User Story

- Playwright tests for critical flows MUST be written and fail before implementation
- Unit tests for high-risk logic MUST be written where they add value
- Data types before storage utilities
- Storage/date utilities before UI integration
- Core UI behavior before polish
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Independent data, storage, or UI files within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "Playwright test for [critical flow] in tests/e2e/[name].spec.ts"
Task: "Unit test for [date/streak/history logic if applicable] in tests/unit/[name].test.ts"

# Launch independent implementation tasks for User Story 1 together:
Task: "Create [Entity1] type or schema in src/lib/[entity1].[ext]"
Task: "Create [Component] UI in src/components/[component].[ext]"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Demo locally if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Local demo (MVP!)
3. Add User Story 2 → Test independently → Local demo
4. Add User Story 3 → Test independently → Local demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify critical-flow Playwright tests fail before implementing
- Include build, full test run, real-browser Playwright run, and console-error verification before marking done
- Commit after each task or logical group
- Stop after tasks are generated and wait for explicit approval before analysis or implementation
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
