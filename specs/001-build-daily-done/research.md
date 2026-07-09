# Research: Build Daily Done

## Decision: Use Vite + React + TypeScript in the existing repo root

**Rationale**: The user specified Vite + React + TypeScript, and the project is
a small single-page app. The existing repo already contains Spec Kit files and
Playwright setup, so implementation should add the Vite scaffold carefully
without replacing `.specify/`, `specs/`, `.agents/`, or `.codex/`.

**Alternatives considered**:

- Create the app in a nested `frontend/` directory: rejected because it adds
  needless structure for a single-page local app.
- Reinitialize the root with a scaffold command: rejected because it risks
  overwriting Spec Kit files in a non-empty directory.

## Decision: Use localStorage as the only persistence layer

**Rationale**: The constitution and spec require local-first storage. A single
versioned localStorage payload is enough for one active task and completion
history. Derived values such as streak and recent history should be calculated
from completion records.

**Alternatives considered**:

- IndexedDB: rejected as unnecessary complexity for small structured data.
- Backend/database/cloud sync: rejected by constitution and non-goals.

## Decision: Make local date string the completion identity

**Rationale**: The clarified spec defines "today" as the browser/device local
calendar date and duplicate prevention as uniqueness by local date. Store each
completion with a `YYYY-MM-DD` local date key and use that key to lock today's
completion form after completion.

**Alternatives considered**:

- UTC dates: rejected because the spec explicitly requires local dates.
- Timestamp-only duplicate detection: rejected because it complicates daily
  uniqueness and streak logic.

## Decision: Keep streak and history as derived values

**Rationale**: Streak and recent history can be derived from completion records.
This avoids stale stored streak values and keeps persistence simple.

**Alternatives considered**:

- Store streak as mutable state: rejected because it can drift from records.
- Store separate history summaries: rejected as unnecessary duplication.

## Decision: Use plain CSS or CSS modules with CSS variables

**Rationale**: The UX brief calls for calm, focused UI with simple tokens.
CSS variables provide enough structure for colors, spacing, radii, typography,
focus, and button hierarchy without adding a component library.

**Alternatives considered**:

- Component library: rejected by user instruction and app scope.
- Utility CSS framework: rejected as an extra dependency not needed for this
  small interface.

## Decision: Playwright for real-browser E2E and UX verification

**Rationale**: The spec and constitution require Playwright coverage for the
critical flow. Playwright can verify browser persistence, keyboard flow,
responsive layout, validation behavior, duplicate prevention, and console
errors.

**Alternatives considered**:

- Unit tests only: rejected because persistence, reload, focus, and responsive
  behavior require browser-level verification.
- Manual browser review only: rejected because the critical flow must be
  repeatable.

## Decision: Contracts are not useful for this feature

**Rationale**: Daily Done has no backend, public API, external service,
import/export format, or integration protocol. Creating an API contract would
invent scope that the spec explicitly excludes.

**Alternatives considered**:

- OpenAPI or endpoint contracts: rejected because there is no API.
- Formal command contracts: rejected because there is no CLI or external
  command surface.
