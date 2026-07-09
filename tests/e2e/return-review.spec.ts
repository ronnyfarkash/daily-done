import { expect, test } from '@playwright/test';
import {
  buildSeededState,
  collectConsoleErrors,
  completeToday,
  expectNoConsoleErrors,
  expectNoHorizontalScroll,
  openFresh,
  seedAppState,
} from './test-utils';

test('completion persists after reload and duplicate completion is prevented', async ({ page }) => {
  const consoleErrors = collectConsoleErrors(page);
  await openFresh(page);
  await completeToday(page, 'Practice piano', 'Practiced scales for twenty minutes');

  await page.reload();

  await expect(page.getByRole('heading', { name: 'Completed today.' })).toBeVisible();
  await expect(page.getByLabel('Read-only proof note')).toHaveText(
    'Practiced scales for twenty minutes',
  );
  await expect(page.getByRole('button', { name: 'Mark done' })).toHaveCount(0);
  await expect(page.getByTestId('streak-count')).toContainText('1 day');
  await expectNoHorizontalScroll(page);
  await expectNoConsoleErrors(consoleErrors);
});

test('recent history shows seven days and layout fits the viewport', async ({ page }) => {
  const consoleErrors = collectConsoleErrors(page);
  await seedAppState(page, buildSeededState(8));

  await expect(page.getByTestId('history-item')).toHaveCount(7);
  await expect(page.getByTestId('streak-count')).toContainText('8 days');
  await expect(page.getByRole('heading', { name: 'Recent completions' })).toBeVisible();
  await expectNoHorizontalScroll(page);
  await expectNoConsoleErrors(consoleErrors);
});
