# Daily Done

Daily Done is a small local-first web app for planning and verifying personal tasks. It started as a simple “did I complete today’s task?” app and is being expanded into a lightweight task planner that supports multiple tasks per day, future tasks, and daily/weekly/monthly views.

This repo is mainly a learning sandbox for practicing **Spec Kit SDD**, the **Superpowers Bridge**, a custom **Product Designer skill**, and **Playwright browser QA**.

## What the app does

Daily Done helps a single user:

- Create one or more tasks for a selected date.
- Plan future tasks across a month.
- View tasks by day, week, or month.
- Complete each task independently.
- Require a short proof/reflection note before marking a task complete.
- Store everything locally in the browser with no backend, login, or cloud sync.

The goal is to keep the app calm, focused, and personal — not a heavy calendar, project-management tool, or habit-tracking dashboard.

## Why this repo exists

This project is intentionally small so the development process can be tested clearly.

The main experiment is:

> Can a feature move from product requirements to implementation using Spec Kit artifacts, then use Superpowers Bridge for disciplined execution, Product Designer review for UX quality, and Playwright for real browser validation?

## Development process

For requirement changes, we use this workflow:

```text
New requirement
→ Spec Kit spec/clarify/design/plan/checklist/tasks/analyze
→ approve
→ Superpowers bridge implementation
→ Product Designer review
→ Playwright QA
→ Spec Kit converge
```

### 1. New requirement

A product-level change is written first in plain language.

Example:

> Support more than one task per day, allow future tasks by month, and provide daily, weekly, and monthly views.

The requirement is not implemented immediately.

### 2. Spec Kit SDD artifacts

Spec Kit is used as the source of truth for the feature.

The flow is:

```text
$speckit-specify
$speckit-clarify
$product-designer
$speckit-plan
$speckit-checklist
$speckit-tasks
$speckit-analyze
```

The generated artifacts live under `specs/` and describe:

- Product requirements
- Clarified decisions
- UX direction
- Architecture plan
- Data model
- Testing strategy
- Acceptance criteria
- Implementation tasks
- Consistency analysis

Superpowers does not replace these artifacts. Spec Kit owns the **what**.

### 3. Approval gate

Before implementation, the artifacts are reviewed and approved.

This prevents the agent from coding against unclear or outdated requirements.

### 4. Superpowers Bridge implementation

After approval, the Superpowers Bridge is used for implementation discipline.

The bridge is expected to follow the approved Spec Kit artifacts and use Superpowers for the **how**:

- Task execution
- TDD discipline
- Systematic debugging
- Verification before completion
- Code review
- Branch finishing

The bridge should not create a second product spec, second architecture plan, or second task list.

### 5. Product Designer review

After implementation, the custom Product Designer skill reviews the app like a UX/product designer.

It checks:

- Visual hierarchy
- Primary action clarity
- Daily/weekly/monthly view usability
- Empty states
- Error states
- Mobile layout
- Accessibility
- Copy quality
- Whether the app feels user-ready

This step is used because the project does not rely on a Figma file or a dedicated UX designer.

### 6. Playwright QA

Playwright is used to verify the app in a real browser.

The QA pass should cover:

- Creating multiple tasks for today
- Creating future tasks
- Switching daily, weekly, and monthly views
- Selecting dates
- Completing tasks with proof notes
- Blocking invalid completion
- Reload persistence
- Mobile and desktop layouts
- Console/runtime errors

Committed Playwright tests live under `tests/e2e/`.

### 7. Spec Kit converge

Finally, Spec Kit convergence checks whether the implementation actually satisfies the approved artifacts.

If gaps remain, they should become new tasks instead of being ignored.

## Tech stack

- Vite
- React
- TypeScript
- localStorage
- Playwright
- Spec Kit
- Superpowers Bridge
- Custom Product Designer skill

No backend, authentication, cloud database, notification system, or recurring-task engine is currently intended.

## Local development

Install dependencies:

```bash
npm install
```

Run the app:

```bash
npm run dev
```

Run unit tests:

```bash
npm test
```

Run Playwright tests:

```bash
npx playwright test
```

Build:

```bash
npm run build
```

## Project philosophy

Daily Done is not just an app. It is a controlled workflow experiment.

The rule is:

> Requirements change the Spec Kit artifacts first. Implementation follows only after review and approval.

This keeps the project from drifting away from the product intent while still allowing agentic implementation, UX review, and browser-based QA.
