import { expect, test } from '@playwright/test';
import {
  addLocalDays,
  collectConsoleErrors,
  expectNoConsoleErrors,
  expectNoHorizontalScroll,
  localDateKey,
  makeTask,
  setMobileViewport,
  seedAppState,
} from './test-utils';

test.describe('calendar planning views', () => {
  test('switches between daily, weekly, and monthly planning views', async ({ page }) => {
    const errors = collectConsoleErrors(page);
    const today = localDateKey();
    const monday = addLocalDays(today, -(new Date(`${today}T12:00:00`).getDay() || 7) + 1);
    const laterThisWeek = addLocalDays(monday, 4);
    const nextWeek = addLocalDays(monday, 8);

    await seedAppState(page, {
      version: 2,
      tasks: [
        makeTask('today-1', 'Write brief', today),
        makeTask('today-2', 'Review inbox', today, true),
        makeTask('week-1', 'Plan Friday', laterThisWeek),
        makeTask('month-1', 'Draft month notes', nextWeek),
      ],
      preferences: { lastSelectedDate: today },
    });

    await expect(page.getByRole('button', { name: 'Day', exact: true })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await expect(page.getByRole('heading', { name: 'Write brief' })).toBeVisible();

    await page.getByRole('button', { name: 'Week' }).click();
    await expect(page.getByRole('heading', { name: /Week of/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Open Monday/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Open Tuesday/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Open Wednesday/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Open Thursday/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Open Friday/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Open Saturday/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Open Sunday/ })).toBeVisible();
    await expect(page.getByText(/Today.*2 tasks, 1 completed/)).toBeVisible();
    await expect(page.getByText('Plan Friday')).toBeVisible();

    await page.getByRole('button', { name: new RegExp(`Open .*${laterThisWeek}`) }).click();
    await expect(page.getByRole('button', { name: 'Day', exact: true })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await expect(page.getByRole('heading', { name: 'Plan Friday' })).toBeVisible();

    await page.getByRole('button', { name: 'Month' }).click();
    await expect(page.getByRole('heading', { name: /Month overview/ })).toBeVisible();
    const todayMonthDay = page.getByRole('button', { name: /Open .*2 tasks, 1 completed/ });
    await expect(todayMonthDay).toBeVisible();
    await expect(todayMonthDay).toContainText('Mixed');
    const nextWeekMonthDay = page.getByRole('button', {
      name: new RegExp(`Open .*${nextWeek}.*1 task, 0 completed`),
    });
    await expect(nextWeekMonthDay).toBeVisible();
    await expect(nextWeekMonthDay).toContainText('Planned');

    await page.getByRole('button', { name: new RegExp(`Open .*${today}`) }).click();
    await expect(page.getByRole('button', { name: 'Day', exact: true })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await expect(page.getByRole('heading', { name: 'Write brief' })).toBeVisible();

    await expectNoHorizontalScroll(page);
    await expectNoConsoleErrors(errors);
  });

  test('shows empty week and month states with one add action at mobile width', async ({ page }) => {
    const errors = collectConsoleErrors(page);
    const today = localDateKey();

    await setMobileViewport(page);
    await seedAppState(page, {
      version: 2,
      tasks: [],
      preferences: { lastSelectedDate: today },
    });

    await page.getByRole('button', { name: 'Week' }).click();
    await expect(page.getByRole('heading', { name: /Week of/ })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add task' })).toHaveCount(1);
    await expect(page.getByText('No tasks planned this week.')).toBeVisible();

    await page.getByRole('button', { name: 'Day', exact: true }).focus();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'Week', exact: true })).toBeFocused();

    await page.getByRole('button', { name: 'Month' }).click();
    await expect(page.getByRole('heading', { name: /Month overview/ })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add task' })).toHaveCount(1);
    await expect(page.getByText('No tasks planned this month.')).toBeVisible();
    await expectNoHorizontalScroll(page);
    await expectNoConsoleErrors(errors);
  });
});
