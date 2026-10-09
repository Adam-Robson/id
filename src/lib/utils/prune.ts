import { MAX_TRACKED_IPS } from '@/lib/constants/max-tracked-ips';
import type { RateWindow } from '@/lib/types/rate-window';
/**
 * Prunes expired windows and ensures the number of tracked IPs does not exceed the maximum.
 * @param now The current window used to determine which tracked windows have expired.
 */

export const WINDOWS = new Map<string, RateWindow>();

export function pruneExpiredWindows(now: number): void {
  for (const [key, w] of WINDOWS) {
    if (w.resetAt <= now) WINDOWS.delete(key);
  }
  // Still oversized after dropping expired entries: drop oldest-first.
  if (WINDOWS.size > MAX_TRACKED_IPS) {
    const excess = WINDOWS.size - MAX_TRACKED_IPS;
    let dropped = 0;
    for (const key of WINDOWS.keys()) {
      WINDOWS.delete(key);
      if (++dropped >= excess) break;
    }
  }
}
