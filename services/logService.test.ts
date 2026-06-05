import { describe, expect, it } from 'vitest';
import * as logService from './logService';

const STORAGE_KEY = 'appLogs';

describe('logService', () => {

  it('returns empty array when no logs exist', () => {
    expect(logService.getLogs()).toEqual([]);
  });

  it('adds and retrieves log entries', () => {
    logService.addLog('info', 'Test message', { foo: 'bar' });
    const logs = logService.getLogs();
    expect(logs).toHaveLength(1);
    expect(logs[0].level).toBe('info');
    expect(logs[0].message).toBe('Test message');
    expect(logs[0].data).toEqual({ foo: 'bar' });
    expect(typeof logs[0].timestamp).toBe('number');
  });

  it('prepends newest logs first', () => {
    logService.addLog('info', 'First');
    logService.addLog('error', 'Second');
    const logs = logService.getLogs();
    expect(logs[0].message).toBe('Second');
    expect(logs[1].message).toBe('First');
  });

  it('ignores invalid entries in localStorage', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([{ bad: true }, { timestamp: 1, level: 'info', message: 'ok' }]));
    const logs = logService.getLogs();
    expect(logs).toHaveLength(1);
    expect(logs[0].message).toBe('ok');
  });

  it('clears all logs', () => {
    logService.addLog('info', 'Test');
    logService.clearLogs();
    expect(logService.getLogs()).toEqual([]);
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });
});