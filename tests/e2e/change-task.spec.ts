import { expect, test } from '@playwright/test';
import {
  collectConsoleErrors,
  configureTask,
  expectNoConsoleErrors,
  openFresh,
} from './test-utils';

test('edits before completion and changes task after confirmation without rewriting history', async ({
  page,
}) => {
  const consoleErrors = collectConsoleErrors(page);
  await openFresh(page);
  await configureTask(page, 'Walk outside');

  await page.getByRole('button', { name: 'Edit task' }).click();
  await page.getByLabel('Daily task').fill('Run outside');
  await page.getByRole('button', { name: 'Save task' }).click();

  await expect(page.getByText('Run outside')).toBeVisible();

  await page.getByLabel('Proof note').fill('Ran outside before breakfast');
  await page.getByRole('button', { name: 'Mark done' }).click();

  await expect(page.getByRole('heading', { name: 'Completed today.' })).toBeVisible();
  await expect(page.getByText('Run outside at')).toBeVisible();

  const changeButton = page.getByRole('button', { name: 'Change task' });
  await changeButton.click();
  await expect(page.getByRole('dialog', { name: 'Change daily task?' })).toBeVisible();
  await expect(page.getByLabel('New daily task')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(changeButton).toBeFocused();

  await changeButton.click();
  await page.getByLabel('New daily task').fill('Read 20 pages');
  await page.getByRole('button', { name: 'Cancel' }).click();
  await expect(changeButton).toBeFocused();

  await changeButton.click();
  await page.getByLabel('New daily task').fill('Read 20 pages');
  await page.getByRole('button', { name: 'Confirm change' }).click();

  await expect(page.getByText('Next daily task: Read 20 pages')).toBeVisible();
  await expect(page.getByText('Run outside at')).toBeVisible();
  await expect(page.getByLabel('Read-only proof note')).toHaveText(
    'Ran outside before breakfast',
  );
  await expectNoConsoleErrors(consoleErrors);
});
