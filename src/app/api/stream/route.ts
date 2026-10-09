import { type NextRequest, NextResponse } from 'next/server';
import { getAccessLevel } from '@/lib/auth/get-access-level';
import { REQUEST_LIMIT, WINDOW_MS } from '@/lib/constants/request-limits';
import { getStreamUrl } from '@/lib/db/r2/get-stream-url';
import { clientKey } from '@/lib/utils/client-key';
import { rateLimit } from '@/lib/utils/rate-limit';
/**
 * Get the stream URL for the currently authenticated user.
 */
export async function GET(req: NextRequest) {
  const limit = await rateLimit(`stream:${clientKey(req.headers)}`, {
    limit: REQUEST_LIMIT,
    windowMs: WINDOW_MS,
  });
  if (!limit.ok) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } },
    );
  }

  const accessLevel = await getAccessLevel();
  if (accessLevel === 'guest') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const key = req.nextUrl.searchParams.get('key');
  if (!key) {
    return NextResponse.json({ error: 'Missing key' }, { status: 400 });
  }

  let url: string | null;
  try {
    url = await getStreamUrl(key);
  } catch (error) {
    console.error('Failed to sign stream URL', error);
    return NextResponse.json(
      { error: 'Failed to sign stream URL' },
      { status: 500 },
    );
  }

  if (!url) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const res = NextResponse.redirect(url, 302);
  res.headers.set('Cache-Control', 'private, no-store');
  return res;
}
