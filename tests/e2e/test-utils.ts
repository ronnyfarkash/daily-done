import { expect, type Page } from '@playwright/test';
import { LEGACY_STORAGE_KEY, STORAGE_KEY } from '../../src/lib/storage';
import type { AppStateV2, LegacyDailyDoneStateV1 } from '../../src/lib/types';

export function collectConsoleErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') {
      errors.push(message.text());
    }
  });
  page.on('pageerror', (error) => errors.push(error.message));
  return errors;
}

export async function openFresh(page: Page) {
  await page.goto('/');
  await page.evaluate(
    ({ v1, v2 }) => {
      window.localStorage.removeItem(v1);
      window.localStorage.removeItem(v2);
    },
    { v1: LEGACY_STORAGE_KEY, v2: STORAGE_KEY },
  );
  await page.reload();
}

export async function seedAppState(page: Page, state: AppStateV2) {
  await page.goto('/');
  await page.evaluate(
    ({ key, value, legacyKey }) => {
      window.localStorage.removeItem(legacyKey);
      window.localStorage.setItem(key, value);
    },
    { key: STORAGE_KEY, legacyKey: LEGACY_STORAGE_KEY, value: JSON.stringify(state) },
  );
  await page.reload();
}

export async function seedLegacyState(page: Page, state: LegacyDailyDoneStateV1 | string) {
  await page.goto('/');
  await page.evaluate(
    ({ key, legacyKey, value }) => {
      window.localStorage.removeItem(key);
      window.localStorage.setItem(legacyKey, value);
    },
    {
      key: STORAGE_KEY,
      legacyKey: LEGACY_STORAGE_KEY,
      value: typeof state === 'string' ? state : JSON.stringify(state),
    },
  );
  await page.reload();
}

export async function expectNoConsoleErrors(errors: string[]) {
  expect(errors).toEqual([]);
}

export async function expectNoHorizontalScroll(page: Page) {
  const hasHorizontalScroll = await page.evaluate(
    () =>
      document.documentElement.scrollWidth > document.documentElement.clientWidth ||
      document.body.scrollWidth > document.body.clientWidth,
  );
  expect(hasHorizontalScroll).toBe(false);
}

export async function setMobileViewport(page: Page) {
  await page.setViewportSize({ width: 375, height: 812 });
}

export async function setDesktopViewport(page: Page) {
  await page.setViewportSize({ width: 1280, height: 900 });
}

export async function getStoredAppState(page: Page): Promise<AppStateV2 | null> {
  return page.evaluate((key) => {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as AppStateV2) : null;
  }, STORAGE_KEY);
}

export function localDateKey(date = new Date()): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

export function addLocalDays(localDate: string, amount: number): string {
  const [year, month, day] = localDate.split('-').map(Number);
  const date = new Date(year, month - 1, day, 12, 0, 0, 0);
  date.setDate(date.getDate() + amount);
  return localDateKey(date);
}

export function makeTask(
  id: string,
  title: string,
  scheduledDate: string,
  completed = false,
) {
  return {
    id,
    title,
    scheduledDate,
    createdAt: `${scheduledDate}T08:00:00.000Z`,
    updatedAt: `${scheduledDate}T08:00:00.000Z`,
    completedAt: completed ? `${scheduledDate}T09:00:00.000Z` : null,
    proofNote: completed ? `Proof note for ${title}` : null,
  };
}

export async function addTaskViaUi(page: Page, title: string, scheduledDate: string) {
  await page.getByRole('button', { name: 'Add task' }).click();
  await page.getByLabel('Task title').fill(title);
  await page.getByLabel('Scheduled date').fill(scheduledDate);
  await page.getByRole('button', { name: 'Save task' }).click();
}
