export interface RateLimitResult {
  ok: boolean;
  /** Seconds until the caller may retry. Zero when `ok`. */
  retryAfter: number;
}
