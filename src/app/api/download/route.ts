import { type NextRequest, NextResponse } from 'next/server';
import { getAccessLevel } from '@/lib/auth';
import { getDownloadUrl } from '@/lib/r2';
import { clientKey, rateLimit } from '@/lib/rate-limit';

/** A person saves a handful of tracks; a scraper asks for the catalog. */
const LIMIT = 20;
const WINDOW_MS = 60 * 1000;

export async function GET(req: NextRequest) {
  // Checked before the access lookup on purpose: every access check is a
  // Clerk Backend API call, and that quota is shared by the whole site.
  const limit = rateLimit(`download:${clientKey(req.headers)}`, {
    limit: LIMIT,
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
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const key = req.nextUrl.searchParams.get('key');
  if (!key) {
    return NextResponse.json({ error: 'Missing key' }, { status: 400 });
  }

  let url: string | null;
  try {
    url = await getDownloadUrl(key);
  } catch (error) {
    console.error('Failed to sign download URL', error);
    return NextResponse.json(
      { error: 'Failed to sign download URL' },
      { status: 500 },
    );
  }

  if (!url) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  // The Location header carries a signed credential — keep it out of any
  // shared cache, same as the streaming route.
  const res = NextResponse.redirect(url, 302);
  res.headers.set('Cache-Control', 'private, no-store');
  return res;
}
