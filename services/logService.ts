
import type { LogEntry } from '../types';
import { parseLogEntries } from '../utils/parseStorage';

const LOGS_STORAGE_KEY = 'appLogs';
const MAX_LOG_ENTRIES = 100;

export const getLogs = (): LogEntry[] => {
  try {
    const savedLogs = localStorage.getItem(LOGS_STORAGE_KEY);
    return savedLogs ? parseLogEntries(savedLogs) : [];
  } catch (e) {
    console.error("Failed to parse logs from localStorage", e);
    return [];
  }
};

export const addLog = (level: 'info' | 'error', message: string, data?: Record<string, any>): void => {
  try {
    const logs = getLogs();
    const newLog: LogEntry = {
      timestamp: Date.now(),
      level,
      message,
      data,
    };
    const updatedLogs = [newLog, ...logs].slice(0, MAX_LOG_ENTRIES);
    localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(updatedLogs));
  } catch (e) {
    console.error("Failed to add log to localStorage", e);
  }
};

export const clearLogs = (): void => {
  try {
    localStorage.removeItem(LOGS_STORAGE_KEY);
  } catch (e) {
    console.error("Failed to clear logs from localStorage", e);
  }
};
