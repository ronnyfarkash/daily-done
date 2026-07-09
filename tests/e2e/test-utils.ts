import { expect, type Page } from '@playwright/test';
import { STORAGE_KEY } from '../../src/lib/storage';
import type { AppState, CompletionRecord } from '../../src/lib/types';

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
  await page.evaluate((key) => window.localStorage.removeItem(key), STORAGE_KEY);
  await page.reload();
}

export async function seedAppState(page: Page, state: AppState) {
  await page.goto('/');
  await page.evaluate(
    ({ key, value }) => window.localStorage.setItem(key, value),
    { key: STORAGE_KEY, value: JSON.stringify(state) },
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

export async function getStoredAppState(page: Page): Promise<AppState | null> {
  return page.evaluate((key) => {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as AppState) : null;
  }, STORAGE_KEY);
}

export async function configureTask(page: Page, taskName: string) {
  await page.getByRole('button', { name: 'Set daily task' }).click();
  await page.getByLabel('Daily task').fill(taskName);
  await page.getByRole('button', { name: 'Save task' }).click();
}

export async function completeToday(page: Page, taskName: string, note: string) {
  await configureTask(page, taskName);
  await page.getByLabel('Proof note').fill(note);
  await page.getByRole('button', { name: 'Mark done' }).click();
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

export function buildSeededState(count: number): AppState {
  const today = localDateKey();
  const completions: CompletionRecord[] = Array.from({ length: count }, (_, index) => {
    const localDate = addLocalDays(today, -index);
    return {
      localDate,
      taskNameAtCompletion: `Task ${index + 1}`,
      proofNote: `Proof note for day ${index + 1}`,
      completedAt: new Date(2026, 0, index + 1, 9, 30).toISOString(),
    };
  });

  return {
    version: 1,
    settings: {
      taskName: 'Current daily task',
      createdAt: new Date(2026, 0, 1, 8, 0).toISOString(),
      updatedAt: new Date(2026, 0, 1, 8, 0).toISOString(),
    },
    completions,
  };
}
