# Daily Done Critical Flow Test Plan

Source artifacts: `spec.md`, `plan.md`, `ux-design-brief.md`, and the implemented app.

Assumptions:
- Each scenario starts from a fresh browser context or cleared Daily Done localStorage unless it explicitly seeds state.
- "Today" is evaluated from the browser's local calendar date.
- Completion proof is verified by a user-written note, not by external or automated real-world validation.
- Duplicate completion prevention is visible through the completed state removing the "Mark done" action and by preserving a single localStorage completion record for today's local date.

## 1. First-Time Task Setup

Goal: A new user can configure the one daily task before any completion exists.

Steps:
1. Open Daily Done with no saved localStorage state.
2. Verify the empty state heading "No daily task yet." and helper copy are visible.
3. Activate "Set daily task".
4. Verify focus moves to the "Daily task" input.
5. Enter a specific task name.
6. Submit "Save task".

Expected results:
- The home screen shows "Today".
- The configured task name is visible.
- The status reads "Not completed today."
- The proof note field and "Mark done" primary action are available.

## 2. Invalid Proof Note Validation

Goal: The user cannot complete the task without an intentional proof note.

Steps:
1. Start with a configured daily task and no completion for today.
2. Activate "Mark done" with an empty proof note.
3. Enter a proof note shorter than 10 characters.
4. Activate "Mark done" again.

Expected results:
- Empty note validation shows "Add a proof note before marking done."
- Short note validation shows "Write at least 10 characters."
- The proof note field receives focus after each validation error.
- The proof note field exposes an invalid state to assistive technology.
- The app remains in the incomplete-today state.

## 3. Successful Completion

Goal: A valid proof note records today's completion.

Steps:
1. Start with a configured daily task and no completion for today.
2. Enter a proof note with at least 10 non-whitespace characters.
3. Activate "Mark done".

Expected results:
- The completed state heading "Completed today." is visible.
- The proof note is shown as read-only text.
- The "Mark done" action is no longer available.
- localStorage contains one completion record for today's local date with the task name, proof note, and completion timestamp.

## 4. Reload Persistence

Goal: Today's completed state survives a page reload on the same local day.

Steps:
1. Complete today's task with a valid proof note.
2. Reload the page.

Expected results:
- The completed state remains visible.
- The read-only proof note still shows the submitted note.
- The current streak shows one day.
- The recent history includes today's completion.

## 5. Duplicate Completion Prevention

Goal: The app prevents more than one completion record for the same local calendar day.

Steps:
1. Complete today's task with a valid proof note.
2. Verify the completion count in localStorage.
3. Reload the page.
4. Verify no "Mark done" action is available.
5. Verify the completion count in localStorage remains unchanged.

Expected results:
- localStorage has exactly one completion record for today's local date.
- The UI stays in the completed state.
- The user cannot submit a second proof note for the same local day.

## 6. Task Change Confirmation

Goal: Changing the daily task requires confirmation and preserves history.

Steps:
1. Complete today's task.
2. Activate "Change task".
3. Verify the "Change daily task?" dialog is visible and "New daily task" is focused.
4. Clear the new task field and submit.
5. Cancel the dialog.
6. Reopen the dialog, enter a new task, and confirm.

Expected results:
- Empty new task validation shows "Enter a task name."
- Cancel returns focus to "Change task" and leaves the task unchanged.
- Confirming shows "Next daily task: ..." for the new task.
- Today's historical completion still shows the task name captured at completion time and the original read-only proof note.

## 7. Mobile-Width Smoke Check

Goal: The critical setup and incomplete-today UI remain usable at 375px width.

Steps:
1. Set the viewport to 375 by 812.
2. Open Daily Done with no saved localStorage state.
3. Verify the empty state primary action is visible.
4. Configure a daily task.
5. Verify the "Today", proof note, and "Mark done" controls fit without horizontal scrolling.

Expected results:
- No horizontal scrolling is present.
- The primary action remains visible and usable.
- Labels, inputs, and buttons remain readable and keyboard/touch target sizing remains usable.
- No obvious browser console errors are reported.
