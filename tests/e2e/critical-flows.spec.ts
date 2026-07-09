import { expect, test } from '@playwright/test';
import {
  collectConsoleErrors,
  configureTask,
  expectNoConsoleErrors,
  expectNoHorizontalScroll,
  getStoredAppState,
  localDateKey,
  openFresh,
} from './test-utils';

// spec: specs/001-build-daily-done/test-plan.md

test.describe('Daily Done critical flows', () => {
  test('first-time task setup', async ({ page }) => {
    const consoleErrors = collectConsoleErrors(page);
    await openFresh(page);

    // 1. Open Daily Done with no saved localStorage state.
    await expect(page.getByRole('heading', { name: 'No daily task yet.' })).toBeVisible();
    await expect(
      page.getByText('Choose the one thing you want to verify each day.'),
    ).toBeVisible();

    // 2. Activate "Set daily task" and verify focus moves to the daily task input.
    await page.getByRole('button', { name: 'Set daily task' }).click();
    await expect(page.getByLabel('Daily task')).toBeFocused();

    // 3. Enter a specific task name and submit.
    await page.getByLabel('Daily task').fill('Write 500 words');
    await page.getByRole('button', { name: 'Save task' }).click();

    // 4. Verify the incomplete-today screen is ready for proof.
    await expect(page.getByRole('heading', { name: 'Today' })).toBeVisible();
    await expect(page.getByText('Write 500 words')).toBeVisible();
    await expect(page.getByText('Not completed today.')).toBeVisible();
    await expect(page.getByLabel('Proof note')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Mark done' })).toBeVisible();
    await expectNoConsoleErrors(consoleErrors);
  });

  test('invalid proof note validation', async ({ page }) => {
    const consoleErrors = collectConsoleErrors(page);
    await openFresh(page);
    await configureTask(page, 'Write 500 words');

    // 1. Try to complete with an empty proof note.
    await page.getByRole('button', { name: 'Mark done' }).click();
    await expect(page.getByText('Add a proof note before marking done.')).toBeVisible();
    await expect(page.getByLabel('Proof note')).toBeFocused();
    await expect(page.getByLabel('Proof note')).toHaveAttribute('aria-invalid', 'true');

    // 2. Try to complete with fewer than 10 characters.
    await page.getByLabel('Proof note').fill('short');
    await page.getByRole('button', { name: 'Mark done' }).click();
    await expect(page.getByText('Write at least 10 characters.')).toBeVisible();
    await expect(page.getByLabel('Proof note')).toBeFocused();

    // 3. The page stays incomplete and does not record a completion.
    await expect(page.getByText('Not completed today.')).toBeVisible();
    const state = await getStoredAppState(page);
    expect(state?.completions).toHaveLength(0);
    await expectNoConsoleErrors(consoleErrors);
  });

  test('successful completion records today once', async ({ page }) => {
    const consoleErrors = collectConsoleErrors(page);
    await openFresh(page);
    await configureTask(page, 'Write 500 words');

    // 1. Submit a valid proof note.
    await page.getByLabel('Proof note').fill('Finished a complete focused writing session');
    await page.getByRole('button', { name: 'Mark done' }).click();

    // 2. Verify the completed state and read-only note.
    await expect(page.getByRole('heading', { name: 'Completed today.' })).toBeVisible();
    await expect(page.getByLabel('Read-only proof note')).toHaveText(
      'Finished a complete focused writing session',
    );
    await expect(page.getByRole('button', { name: 'Mark done' })).toHaveCount(0);

    // 3. Verify the persisted completion payload.
    const state = await getStoredAppState(page);
    expect(state?.completions).toHaveLength(1);
    expect(state?.completions[0]).toEqual(
      expect.objectContaining({
        localDate: localDateKey(),
        taskNameAtCompletion: 'Write 500 words',
        proofNote: 'Finished a complete focused writing session',
      }),
    );
    expect(state?.completions[0]?.completedAt).toEqual(expect.any(String));
    await expectNoConsoleErrors(consoleErrors);
  });

  test('reload persistence', async ({ page }) => {
    const consoleErrors = collectConsoleErrors(page);
    await openFresh(page);
    await configureTask(page, 'Practice piano');
    await page.getByLabel('Proof note').fill('Practiced scales for twenty minutes');
    await page.getByRole('button', { name: 'Mark done' }).click();

    // 1. Reload after completing today.
    await page.reload();

    // 2. Verify the completed state, history, and streak remain.
    await expect(page.getByRole('heading', { name: 'Completed today.' })).toBeVisible();
    await expect(page.getByLabel('Read-only proof note')).toHaveText(
      'Practiced scales for twenty minutes',
    );
    await expect(page.getByTestId('streak-count')).toContainText('1 day');
    await expect(page.getByTestId('history-item')).toHaveCount(1);
    await expectNoConsoleErrors(consoleErrors);
  });

  test('duplicate completion prevention', async ({ page }) => {
    const consoleErrors = collectConsoleErrors(page);
    await openFresh(page);
    await configureTask(page, 'Practice piano');
    await page.getByLabel('Proof note').fill('Practiced scales for twenty minutes');
    await page.getByRole('button', { name: 'Mark done' }).click();

    // 1. Verify today's completion is stored once.
    const completedState = await getStoredAppState(page);
    expect(
      completedState?.completions.filter((completion) => completion.localDate === localDateKey()),
    ).toHaveLength(1);

    // 2. Reload and verify the second completion action is unavailable.
    await page.reload();
    await expect(page.getByRole('heading', { name: 'Completed today.' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Mark done' })).toHaveCount(0);

    // 3. Verify no duplicate local-date record was introduced.
    const reloadedState = await getStoredAppState(page);
    expect(
      reloadedState?.completions.filter((completion) => completion.localDate === localDateKey()),
    ).toHaveLength(1);
    await expectNoConsoleErrors(consoleErrors);
  });

  test('task change confirmation preserves history', async ({ page }) => {
    const consoleErrors = collectConsoleErrors(page);
    await openFresh(page);
    await configureTask(page, 'Run outside');
    await page.getByLabel('Proof note').fill('Ran outside before breakfast');
    await page.getByRole('button', { name: 'Mark done' }).click();

    // 1. Open the change-task confirmation.
    const changeTaskButton = page.getByRole('button', { name: 'Change task' });
    await changeTaskButton.click();
    await expect(page.getByRole('dialog', { name: 'Change daily task?' })).toBeVisible();
    await expect(page.getByLabel('New daily task')).toBeFocused();
    await expect(page.getByRole('button', { name: 'Confirm change' })).toBeInViewport();
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeInViewport();

    // 2. Keyboard focus stays inside the modal confirmation.
    await page.keyboard.press('Shift+Tab');
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.getByLabel('New daily task')).toBeFocused();

    // 3. Validate the new task name before accepting confirmation.
    await page.getByLabel('New daily task').fill('');
    await page.getByRole('button', { name: 'Confirm change' }).click();
    await expect(page.getByText('Enter a task name.')).toBeVisible();
    await expect(page.getByLabel('New daily task')).toBeFocused();

    // 4. Cancel returns to the completed state without changing the task.
    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(changeTaskButton).toBeFocused();
    await expect(page.getByText('Next daily task:')).toHaveCount(0);

    // 5. Confirm a changed task and verify today's history remains intact.
    await changeTaskButton.click();
    await page.getByLabel('New daily task').fill('Read 20 pages');
    await page.getByRole('button', { name: 'Confirm change' }).click();
    await expect(page.getByText('Next daily task: Read 20 pages')).toBeVisible();
    await expect(page.getByText('Run outside at')).toBeVisible();
    await expect(page.getByLabel('Read-only proof note')).toHaveText(
      'Ran outside before breakfast',
    );

    const state = await getStoredAppState(page);
    expect(state?.settings?.taskName).toBe('Read 20 pages');
    expect(state?.completions[0]?.taskNameAtCompletion).toBe('Run outside');
    await expectNoConsoleErrors(consoleErrors);
  });

  test('mobile-width smoke check', async ({ page }) => {
    const consoleErrors = collectConsoleErrors(page);

    // 1. Set a 375px mobile-width viewport and open a fresh app.
    await page.setViewportSize({ width: 375, height: 812 });
    await openFresh(page);

    // 2. Verify the empty state primary action is visible and usable.
    await expect(page.getByRole('heading', { name: 'No daily task yet.' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Set daily task' })).toBeVisible();
    await expectNoHorizontalScroll(page);

    // 3. Configure a task and verify the incomplete state fits the viewport.
    await configureTask(page, 'Write 500 words');
    await expect(page.getByRole('heading', { name: 'Today' })).toBeVisible();
    await expect(page.getByLabel('Proof note')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Mark done' })).toBeVisible();
    await expectNoHorizontalScroll(page);
    await expectNoConsoleErrors(consoleErrors);
  });
});
