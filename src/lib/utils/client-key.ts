
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
