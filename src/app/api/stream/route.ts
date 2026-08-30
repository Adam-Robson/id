import { type NextRequest, NextResponse } from 'next/server';
import { getAccessLevel } from '@/lib/auth';
import { getStreamUrl } from '@/lib/r2';

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
