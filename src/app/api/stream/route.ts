import { type NextRequest, NextResponse } from 'next/server';
import { getAccessLevel } from '@/lib/auth';
import { getStreamUrl } from '@/lib/r2';
import { clientKey, rateLimit } from '@/lib/rate-limit';

/** Generous for a listener (one request per track switch), tight for a bot. */
const LIMIT = 60;
const WINDOW_MS = 60 * 1000;

/**
 * Resolves a track to a freshly signed R2 URL and redirects to it.
 *
 * The page embeds this route's URL in the audio element rather than a
 * presigned one, so playback can't break in a long-open tab: the signature
 * is minted per request and followed immediately. Access is re-checked here
 * rather than trusted from whatever rendered the page.
 *
 * The redirect keeps audio bytes flowing straight from R2 to the listener —
 * only the signing round-trip passes through here. Range requests are
 * re-issued by the browser against the redirect target, so seeking works.
 */
export async function GET(req: NextRequest) {
  // Checked before the access lookup on purpose: every access check is a
  // Clerk Backend API call, and that quota is shared by the whole site —
  // an unthrottled client here could starve auth everywhere else.
  const limit = rateLimit(`stream:${clientKey(req.headers)}`, {
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

  // 302 rather than 307/308: this is a per-request lookup, and the signed
  // target must never be cached by a shared cache.
  const res = NextResponse.redirect(url, 302);
  res.headers.set('Cache-Control', 'private, no-store');
  return res;
}
