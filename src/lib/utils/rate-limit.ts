
import type { RateLimitResult } from '@/lib/types/rate-limit-result';
import { pruneExpiredWindows } from '@/lib/utils/prune';
import { WINDOWS } from '@/lib/utils/prune';

export function rateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number },
): RateLimitResult {
  const now = Date.now();
  pruneExpiredWindows(now);

  const existing = WINDOWS.get(key);
  if (!existing || existing.resetAt <= now) {
    WINDOWS.set(key, { count: 1, resetAt: now + windowMs });
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

