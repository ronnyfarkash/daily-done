import { expect, test } from '@playwright/test';
import {
  addLocalDays,
  addTaskViaUi,
  collectConsoleErrors,
  expectNoConsoleErrors,
  expectNoHorizontalScroll,
  getStoredAppState,
  localDateKey,
  makeTask,
  openFresh,
  seedAppState,
} from './test-utils';

test.describe('multi-task daily flows', () => {
  test('daily view creates multiple tasks and completes one independently', async ({ page }) => {
    const errors = collectConsoleErrors(page);
    const today = localDateKey();

    await openFresh(page);

    await expect(page.getByRole('heading', { name: 'No tasks for this day.' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Day', exact: true })).toHaveAttribute(
      'aria-pressed',
      'true',
    );

    await addTaskViaUi(page, 'Write summary', today);
    await addTaskViaUi(page, 'Read notes', today);

    await expect(page.getByRole('heading', { name: 'Write summary' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Read notes' })).toBeVisible();
    await expect(page.getByText('Due today')).toHaveCount(2);

    await page.getByRole('button', { name: 'Verify Write summary' }).click();
    await page.getByRole('button', { name: 'Mark complete' }).click();
    await expect(page.getByText('Add a proof note before marking complete.')).toBeVisible();
    await expect(page.getByLabel('Proof note')).toBeFocused();

    await page.getByLabel('Proof note').fill('short');
    await page.getByRole('button', { name: 'Mark complete' }).click();
    await expect(page.getByText('Write at least 10 characters.')).toBeVisible();

    await page.getByLabel('Proof note').fill('Wrote the daily summary');
    await page.getByRole('button', { name: 'Mark complete' }).click();

    await expect(page.getByTestId('task-card-write-summary')).toContainText('Completed');
    await expect(page.getByText('Wrote the daily summary')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Verify Write summary' })).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Verify Read notes' })).toBeVisible();

    const state = await getStoredAppState(page);
    expect(state?.tasks).toHaveLength(2);
    expect(state?.tasks.filter((task) => task.completedAt)).toHaveLength(1);

    await page.reload();
    await expect(page.getByTestId('task-card-write-summary')).toContainText('Completed');
    await expect(page.getByText('Wrote the daily summary')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Verify Read notes' })).toBeVisible();

    await expectNoHorizontalScroll(page);
    await expectNoConsoleErrors(errors);
  });

  test('future tasks can be edited, cannot complete early, and missed tasks remain completable', async ({
    page,
  }) => {
    const errors = collectConsoleErrors(page);
    const today = localDateKey();
    const tomorrow = addLocalDays(today, 1);
    const yesterday = addLocalDays(today, -1);

    await openFresh(page);
    await addTaskViaUi(page, 'Call accountant', tomorrow);

    await expect(page.getByRole('heading', { name: 'Call accountant' })).toBeVisible();
    await expect(page.getByTestId('task-card-call-accountant')).toContainText('Planned');
    await expect(page.getByText('Available on its scheduled date.')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Verify Call accountant' })).toHaveCount(0);

    await page.getByRole('button', { name: 'Edit Call accountant' }).click();
    await page.getByLabel('Task title').fill('Call accountant office');
    await page.getByRole('button', { name: 'Save task' }).click();
    await expect(page.getByRole('heading', { name: 'Call accountant office' })).toBeVisible();

    await seedAppState(page, {
      version: 2,
      tasks: [
        makeTask('missed-1', 'Submit receipt', yesterday),
        makeTask('future-1', 'Call accountant office', tomorrow),
      ],
      preferences: { lastSelectedDate: yesterday },
    });

    await expect(page.getByRole('heading', { name: 'Submit receipt' })).toBeVisible();
    await expect(page.getByTestId('task-card-submit-receipt')).toContainText('Missed');
    await expect(page.getByText('Still open')).toBeVisible();

    await page.getByRole('button', { name: 'Verify Submit receipt' }).click();
    await page.getByLabel('Proof note').fill('Uploaded the receipt');
    await page.getByRole('button', { name: 'Mark complete' }).click();
    await expect(page.getByTestId('task-card-submit-receipt')).toContainText('Completed');

    await expectNoConsoleErrors(errors);
  });

  test('supports keyboard-only task creation, validation, completion, and date selection', async ({
    page,
  }) => {
    const errors = collectConsoleErrors(page);
    const today = localDateKey();

    await openFresh(page);

    await page.getByRole('button', { name: 'Add task' }).focus();
    await page.keyboard.press('Enter');
    await expect(page.getByLabel('Task title')).toBeFocused();

    await page.keyboard.type('Keyboard task');
    await page.getByLabel('Scheduled date').fill(today);
    await page.getByRole('button', { name: 'Save task' }).focus();
    await page.keyboard.press('Enter');

    await expect(page.getByTestId('task-card-keyboard-task')).toBeFocused();

    await page.getByRole('button', { name: 'Verify Keyboard task' }).focus();
    await page.keyboard.press('Enter');
    await expect(page.getByLabel('Proof note')).toBeFocused();

    await page.getByRole('button', { name: 'Mark complete' }).focus();
    await page.keyboard.press('Enter');
    await expect(page.getByText('Add a proof note before marking complete.')).toBeVisible();
    await expect(page.getByLabel('Proof note')).toBeFocused();

    await page.keyboard.type('Completed with keyboard');
    await page.getByRole('button', { name: 'Mark complete' }).focus();
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('task-card-keyboard-task')).toBeFocused();
    await expect(page.getByTestId('task-card-keyboard-task')).toContainText('Completed');

    await page.getByRole('button', { name: 'Week', exact: true }).focus();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('heading', { name: /Week of/ })).toBeFocused();

    await page.getByRole('button', { name: new RegExp(`Open .*${today}`) }).focus();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('heading', { name: /Thursday|Friday|Saturday|Sunday|Monday|Tuesday|Wednesday/ })).toBeFocused();
    await expect(page.getByRole('button', { name: 'Day', exact: true })).toHaveAttribute(
      'aria-pressed',
      'true',
    );

    await expectNoConsoleErrors(errors);
  });
});
