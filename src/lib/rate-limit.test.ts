import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { clientKey, rateLimit, resetRateLimits } from '@/lib/rate-limit';

const OPTS = { limit: 3, windowMs: 60_000 };

describe('rateLimit', () => {
  beforeEach(() => {
    resetRateLimits();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('allows requests up to the limit', () => {
    for (let i = 0; i < OPTS.limit; i++) {
      expect(rateLimit('a', OPTS).ok).toBe(true);
    }
  });

  it('blocks the request after the limit', () => {
    for (let i = 0; i < OPTS.limit; i++) rateLimit('a', OPTS);
    expect(rateLimit('a', OPTS).ok).toBe(false);
  });

  it('reports how long to wait', () => {
    for (let i = 0; i <= OPTS.limit; i++) rateLimit('a', OPTS);
    const { retryAfter } = rateLimit('a', OPTS);
    expect(retryAfter).toBeGreaterThan(0);
    expect(retryAfter).toBeLessThanOrEqual(60);
  });

  it('keeps callers in separate buckets', () => {
    for (let i = 0; i <= OPTS.limit; i++) rateLimit('a', OPTS);
    expect(rateLimit('b', OPTS).ok).toBe(true);
  });

  it('lets the caller through again once the window passes', () => {
    for (let i = 0; i <= OPTS.limit; i++) rateLimit('a', OPTS);
    expect(rateLimit('a', OPTS).ok).toBe(false);

    vi.advanceTimersByTime(OPTS.windowMs + 1);
    expect(rateLimit('a', OPTS).ok).toBe(true);
  });
});

describe('clientKey', () => {
  it('takes the client from the front of x-forwarded-for', () => {
    const headers = new Headers({
      'x-forwarded-for': '203.0.113.9, 70.41.3.18, 150.172.238.178',
    });
    expect(clientKey(headers)).toBe('203.0.113.9');
  });

  it('falls back to x-real-ip', () => {
    expect(clientKey(new Headers({ 'x-real-ip': '203.0.113.9' }))).toBe(
      '203.0.113.9',
    );
  });

  it('buckets unidentifiable callers together rather than exempting them', () => {
    expect(clientKey(new Headers())).toBe('unknown');
  });
});
