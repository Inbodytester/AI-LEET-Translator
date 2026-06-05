import type { HistoryEntry, LogEntry } from '../types';

const isHistoryEntry = (item: unknown): item is HistoryEntry => {
  if (!item || typeof item !== 'object') return false;
  const entry = item as Record<string, unknown>;
  return (
    typeof entry.id === 'string' &&
    typeof entry.timestamp === 'number' &&
    typeof entry.originalText === 'string' &&
    typeof entry.detectedLanguage === 'string' &&
    typeof entry.leetTranslation === 'string'
  );
};

const isLogEntry = (item: unknown): item is LogEntry => {
  if (!item || typeof item !== 'object') return false;
  const entry = item as Record<string, unknown>;
  const level = entry.level;
  return (
    typeof entry.timestamp === 'number' &&
    typeof entry.message === 'string' &&
    (level === 'info' || level === 'error') &&
    (entry.data === undefined ||
      (typeof entry.data === 'object' && entry.data !== null && !Array.isArray(entry.data)))
  );
};

export const parseHistoryEntries = (raw: string): HistoryEntry[] => {
  const parsed: unknown = JSON.parse(raw);
  if (!Array.isArray(parsed)) return [];
  return parsed.filter(isHistoryEntry);
};

export const parseLogEntries = (raw: string): LogEntry[] => {
  const parsed: unknown = JSON.parse(raw);
  if (!Array.isArray(parsed)) return [];
  return parsed.filter(isLogEntry);
};