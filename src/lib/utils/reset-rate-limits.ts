import { WINDOWS } from '@/lib/utils/prune';

/** Test seam — the counters are module state that would otherwise leak. */
export function resetRateLimits(): void {
  WINDOWS.clear();
}
