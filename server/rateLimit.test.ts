import { describe, expect, it, beforeEach, vi, afterEach } from 'vitest';
import { checkRateLimit, RATE_LIMIT_ERROR_PREFIX } from './rateLimit';

describe('checkRateLimit', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('allows requests under the limit', () => {
    for (let i = 0; i < 10; i++) {
      expect(checkRateLimit('client-a').allowed).toBe(true);
    }
  });

  it('blocks requests over the limit', () => {
    for (let i = 0; i < 10; i++) {
      checkRateLimit('client-b');
    }
    const result = checkRateLimit('client-b');
    expect(result.allowed).toBe(false);
    expect(result.retryAfterSeconds).toBeGreaterThan(0);
  });

  it('resets after the window expires', () => {
    for (let i = 0; i < 10; i++) {
      checkRateLimit('client-c');
    }
    expect(checkRateLimit('client-c').allowed).toBe(false);

    vi.advanceTimersByTime(60_001);

    expect(checkRateLimit('client-c').allowed).toBe(true);
  });

  it('tracks clients independently', () => {
    for (let i = 0; i < 10; i++) {
      checkRateLimit('client-x');
    }
    expect(checkRateLimit('client-x').allowed).toBe(false);
    expect(checkRateLimit('client-y').allowed).toBe(true);
  });
});

describe('RATE_LIMIT_ERROR_PREFIX', () => {
  it('is used in user-facing messages', () => {
    expect(RATE_LIMIT_ERROR_PREFIX).toBe('Too many requests');
  });
});