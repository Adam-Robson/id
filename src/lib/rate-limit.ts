interface Window {
  count: number;
  resetAt: number;
}

/**
 * Fixed-window counters held in module scope.
 *
 * This is deliberately best-effort. On Fluid Compute an instance is reused
 * across requests so the counters do real work, but they are per-instance
 * and vanish on a cold start — a determined flood spread across instances
 * will get through. It exists to stop the ordinary case (one bot hammering
 * the contact form) without taking on a Redis dependency for a site this
 * size. Move to Upstash or Vercel BotID if abuse ever becomes real.
 */
const windows = new Map<string, Window>();

/** Cap on tracked keys, so a spray of unique IPs can't grow the map forever. */
const MAX_TRACKED = 5000;

export interface RateLimitResult {
  ok: boolean;
  /** Seconds until the caller may retry. Zero when `ok`. */
  retryAfter: number;
}

function prune(now: number): void {
  for (const [key, window] of windows) {
    if (window.resetAt <= now) windows.delete(key);
  }
  // Still oversized after dropping expired entries: drop oldest-first.
  if (windows.size > MAX_TRACKED) {
    const excess = windows.size - MAX_TRACKED;
    let dropped = 0;
    for (const key of windows.keys()) {
      windows.delete(key);
      if (++dropped >= excess) break;
    }
  }
}

export function rateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number },
): RateLimitResult {
  const now = Date.now();
  prune(now);

  const existing = windows.get(key);
  if (!existing || existing.resetAt <= now) {
    windows.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfter: 0 };
  }

  existing.count += 1;
  if (existing.count > limit) {
    return {
      ok: false,
      retryAfter: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }

  return { ok: true, retryAfter: 0 };
}

/**
 * Best available client identifier. Vercel sets `x-forwarded-for`; the first
 * entry is the real client, later ones are proxies. Falls back to a shared
 * bucket so a request with no usable header is still limited, rather than
 * being waved through.
 */
export function clientKey(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for');
  const first = forwarded?.split(',')[0]?.trim();
  return first || headers.get('x-real-ip') || 'unknown';
}

/** Test seam — the counters are module state that would otherwise leak. */
export function resetRateLimits(): void {
  windows.clear();
}
