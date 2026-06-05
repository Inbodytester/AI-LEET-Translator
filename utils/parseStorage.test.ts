import { describe, expect, it } from 'vitest';
import { parseHistoryEntries, parseLogEntries } from './parseStorage';

describe('parseHistoryEntries', () => {
  it('parses valid history entries', () => {
    const raw = JSON.stringify([
      {
        id: '1',
        timestamp: 100,
        originalText: 'hi',
        detectedLanguage: 'English',
        leetTranslation: 'h1',
      },
    ]);
    expect(parseHistoryEntries(raw)).toHaveLength(1);
  });

  it('filters invalid entries', () => {
    const raw = JSON.stringify([{ id: 1 }, { foo: 'bar' }]);
    expect(parseHistoryEntries(raw)).toEqual([]);
  });

  it('returns empty array for non-array JSON', () => {
    expect(parseHistoryEntries('{}')).toEqual([]);
  });
});

describe('parseLogEntries', () => {
  it('parses valid log entries', () => {
    const raw = JSON.stringify([{ timestamp: 1, level: 'error', message: 'fail' }]);
    expect(parseLogEntries(raw)).toHaveLength(1);
  });

  it('rejects invalid log levels', () => {
    const raw = JSON.stringify([{ timestamp: 1, level: 'warn', message: 'x' }]);
    expect(parseLogEntries(raw)).toEqual([]);
  });
});