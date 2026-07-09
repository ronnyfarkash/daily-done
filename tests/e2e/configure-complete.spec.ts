import { expect, test } from '@playwright/test';
import {
  collectConsoleErrors,
  expectNoConsoleErrors,
  openFresh,
} from './test-utils';

test('first-time setup validates proof note and completes today', async ({ page }) => {
  const consoleErrors = collectConsoleErrors(page);
  await openFresh(page);

  await expect(page.getByRole('heading', { name: 'No daily task yet.' })).toBeVisible();

  const setTaskButton = page.getByRole('button', { name: 'Set daily task' });
  await setTaskButton.focus();
  await page.keyboard.press('Enter');

  await expect(page.getByLabel('Daily task')).toBeFocused();
  await page.getByLabel('Daily task').fill('Write 500 words');
  await page.getByRole('button', { name: 'Save task' }).click();

  await expect(page.getByRole('heading', { name: 'Today' })).toBeVisible();
  await expect(page.getByText('Write 500 words')).toBeVisible();
  await expect(page.getByText('Not completed today.')).toBeVisible();

  await page.getByRole('button', { name: 'Mark done' }).click();
  await expect(page.getByText('Add a proof note before marking done.')).toBeVisible();
  await expect(page.getByLabel('Proof note')).toBeFocused();

  await page.getByLabel('Proof note').fill('short');
  await page.getByRole('button', { name: 'Mark done' }).click();
  await expect(page.getByText('Write at least 10 characters.')).toBeVisible();

  await page.getByLabel('Proof note').fill('Wrote a focused draft for today');
  await page.getByRole('button', { name: 'Mark done' }).click();

  await expect(page.getByRole('heading', { name: 'Completed today.' })).toBeVisible();
  await expect(page.getByLabel('Read-only proof note')).toHaveText(
    'Wrote a focused draft for today',
  );
  await expect(page.getByRole('button', { name: 'Mark done' })).toHaveCount(0);
  await expectNoConsoleErrors(consoleErrors);
});
