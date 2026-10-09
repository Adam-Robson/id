// @vitest-environment node
import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GET as download } from '@/app/api/download/route';
import { GET as stream } from '@/app/api/stream/route';
import { getAccessLevel } from '@/lib/auth/get-access-level';
import { getDownloadUrl } from '@/lib/db/r2/get-download-url';
import { getStreamUrl } from '@/lib/db/r2/get-stream-url';
import { resetRateLimits } from '@/lib/utils/reset-rate-limits';

vi.mock('@/lib/auth/get-access-level', () => ({ getAccessLevel: vi.fn() }));
vi.mock('@/lib/db/r2/get-stream-url', () => ({ getStreamUrl: vi.fn() }));
vi.mock('@/lib/db/r2/get-download-url', () => ({ getDownloadUrl: vi.fn() }));

const KEY = 'albums/first/01 Opening.mp3';
const SIGNED = 'https://r2.example.com/signed?X-Amz-Signature=abc';

const request = (path: string, ip = '203.0.113.7') =>
  new NextRequest(`http://localhost${path}`, {
    headers: { 'x-forwarded-for': ip },
  });

beforeEach(() => {
  resetRateLimits();
  vi.mocked(getAccessLevel).mockResolvedValue('member');
  vi.mocked(getStreamUrl).mockResolvedValue(SIGNED);
  vi.mocked(getDownloadUrl).mockResolvedValue(SIGNED);
});

describe.each([
  {
    name: 'GET /api/stream',
    handler: stream,
    path: '/api/stream',
    sign: getStreamUrl,
    guestStatus: 401,
    limit: 60,
  },
  {
    name: 'GET /api/download',
    handler: download,
    path: '/api/download',
    sign: getDownloadUrl,
    guestStatus: 403,
    limit: 20,
  },
])('$name', ({ handler, path, sign, guestStatus, limit }) => {
  const withKey = `${path}?key=${encodeURIComponent(KEY)}`;

  it('redirects a member to a signed URL that is never cached', async () => {
    const res = await handler(request(withKey));

    expect(res.status).toBe(302);
    expect(res.headers.get('location')).toBe(SIGNED);
    expect(res.headers.get('cache-control')).toBe('private, no-store');
    expect(sign).toHaveBeenCalledWith(KEY);
  });

  it('serves admins too', async () => {
    vi.mocked(getAccessLevel).mockResolvedValue('admin');
    const res = await handler(request(withKey));
    expect(res.status).toBe(302);
  });

  it(`rejects guests with ${guestStatus} without signing anything`, async () => {
    vi.mocked(getAccessLevel).mockResolvedValue('guest');

    const res = await handler(request(withKey));

    expect(res.status).toBe(guestStatus);
    expect(res.headers.get('location')).toBeNull();
    expect(sign).not.toHaveBeenCalled();
  });

  it('requires a key', async () => {
    const res = await handler(request(path));
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: 'Missing key' });
  });

  it('404s when the key is not a signable audio file', async () => {
    vi.mocked(sign).mockResolvedValue(null);
    const res = await handler(
      request(`${path}?key=${encodeURIComponent('contacts/secret.json')}`),
    );
    expect(res.status).toBe(404);
  });

  it('500s without leaking details when signing throws', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(sign).mockRejectedValue(new Error('bad credentials'));

    const res = await handler(request(withKey));

    expect(res.status).toBe(500);
    expect(JSON.stringify(await res.json())).not.toContain('bad credentials');
  });

  it(`rate limits after ${limit} requests per client, before checking auth`, async () => {
    for (let i = 0; i < limit; i++) {
      expect((await handler(request(withKey))).status).toBe(302);
    }
    vi.mocked(getAccessLevel).mockClear();

    const res = await handler(request(withKey));

    expect(res.status).toBe(429);
    expect(Number(res.headers.get('retry-after'))).toBeGreaterThan(0);
    expect(getAccessLevel).not.toHaveBeenCalled();

    // A different client still gets through.
    expect((await handler(request(withKey, '198.51.100.1'))).status).toBe(302);
  });
});
