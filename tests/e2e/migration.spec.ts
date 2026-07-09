import { expect, test } from '@playwright/test';
import {
  collectConsoleErrors,
  expectNoConsoleErrors,
  getStoredAppState,
  seedLegacyState,
} from './test-utils';

test.describe('legacy V1 migration', () => {
  test('migrates readable single-task data into completed and active tasks', async ({ page }) => {
    const errors = collectConsoleErrors(page);

    await seedLegacyState(page, {
      version: 1,
      settings: {
        taskName: 'Read pages',
        createdAt: '2026-07-01T08:00:00.000Z',
        updatedAt: '2026-07-02T08:00:00.000Z',
      },
      completions: [
        {
          localDate: '2026-07-08',
          taskNameAtCompletion: 'Write notes',
          proofNote: 'Wrote clear notes',
          completedAt: '2026-07-08T09:00:00.000Z',
        },
      ],
    });

    await expect(page.getByRole('heading', { name: 'Read pages' })).toBeVisible();
    await expect(page.getByTestId('task-card-read-pages')).toContainText('Due today');
    await expect(page.getByText(/streak/i)).toHaveCount(0);
    await expect(page.getByText(/history/i)).toHaveCount(0);

    await page.getByRole('button', { name: 'Previous day' }).click();
    await expect(page.getByRole('heading', { name: 'Write notes' })).toBeVisible();
    await expect(page.getByText('Wrote clear notes')).toBeVisible();

    await page.getByRole('button', { name: 'Month' }).click();
    await expect(page.getByRole('button', { name: /Open .*1 task, 1 completed/ })).toBeVisible();

    const migrated = await getStoredAppState(page);
    expect(migrated?.tasks.map((task) => task.title).sort()).toEqual(['Read pages', 'Write notes']);
    await expectNoConsoleErrors(errors);
  });

  test('ignores corrupt legacy data safely and stays usable', async ({ page }) => {
    const errors = collectConsoleErrors(page);

    await seedLegacyState(page, '{not-json');

    await expect(page.getByRole('heading', { name: 'No tasks for this day.' })).toBeVisible();
    await page.getByRole('button', { name: 'Add task' }).click();
    await page.getByLabel('Task title').fill('Start fresh');
    await page.getByRole('button', { name: 'Save task' }).click();

    await expect(page.getByRole('heading', { name: 'Start fresh' })).toBeVisible();
    await expectNoConsoleErrors(errors);
  });
});
