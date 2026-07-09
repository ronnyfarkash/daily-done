import { describe, expect, it } from 'vitest';
import { migrateLegacyState } from '../../src/lib/migration';

describe('legacy V1 migration', () => {
  it('converts readable legacy completions into completed scheduled tasks', () => {
    const migrated = migrateLegacyState(
      {
        version: 1,
        settings: null,
        completions: [
          {
            localDate: '2026-07-08',
            taskNameAtCompletion: 'Write',
            proofNote: 'Completed writing',
            completedAt: '2026-07-08T09:00:00.000Z',
          },
        ],
      },
      '2026-07-09',
    );

    expect(migrated?.tasks).toEqual([
      {
        id: 'legacy-completion-2026-07-08',
        title: 'Write',
        scheduledDate: '2026-07-08',
        createdAt: '2026-07-08T09:00:00.000Z',
        updatedAt: '2026-07-08T09:00:00.000Z',
        completedAt: '2026-07-08T09:00:00.000Z',
        proofNote: 'Completed writing',
      },
    ]);
  });

  it('creates an active incomplete task for today when settings exist without today completion', () => {
    const migrated = migrateLegacyState(
      {
        version: 1,
        settings: {
          taskName: 'Read',
          createdAt: '2026-07-01T08:00:00.000Z',
          updatedAt: '2026-07-02T08:00:00.000Z',
        },
        completions: [],
      },
      '2026-07-09',
    );

    expect(migrated?.tasks).toEqual([
      {
        id: 'legacy-active-2026-07-09',
        title: 'Read',
        scheduledDate: '2026-07-09',
        createdAt: '2026-07-01T08:00:00.000Z',
        updatedAt: '2026-07-02T08:00:00.000Z',
        completedAt: null,
        proofNote: null,
      },
    ]);
  });

  it('does not create an extra active task when today already has a legacy completion', () => {
    const migrated = migrateLegacyState(
      {
        version: 1,
        settings: {
          taskName: 'Read',
          createdAt: '2026-07-01T08:00:00.000Z',
          updatedAt: '2026-07-02T08:00:00.000Z',
        },
        completions: [
          {
            localDate: '2026-07-09',
            taskNameAtCompletion: 'Read',
            proofNote: 'Completed reading',
            completedAt: '2026-07-09T09:00:00.000Z',
          },
        ],
      },
      '2026-07-09',
    );

    expect(migrated?.tasks.map((task) => task.id)).toEqual(['legacy-completion-2026-07-09']);
  });

  it('adds deterministic suffixes when migrated ids collide', () => {
    const migrated = migrateLegacyState(
      {
        version: 1,
        settings: null,
        completions: [
          {
            localDate: '2026-07-08',
            taskNameAtCompletion: 'Write',
            proofNote: 'Completed writing',
            completedAt: '2026-07-08T09:00:00.000Z',
          },
          {
            localDate: '2026-07-08',
            taskNameAtCompletion: 'Read',
            proofNote: 'Completed reading',
            completedAt: '2026-07-08T10:00:00.000Z',
          },
        ],
      },
      '2026-07-09',
    );

    expect(migrated?.tasks.map((task) => task.id)).toEqual([
      'legacy-completion-2026-07-08',
      'legacy-completion-2026-07-08-2',
    ]);
  });

  it('ignores corrupt or unsupported legacy payloads safely', () => {
    expect(migrateLegacyState({ version: 1, completions: 'bad' }, '2026-07-09')).toBeNull();
    expect(migrateLegacyState('{not-json', '2026-07-09')).toBeNull();
    expect(migrateLegacyState({ version: 2, tasks: [] }, '2026-07-09')).toBeNull();
  });
});
