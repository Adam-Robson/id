import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { resetRateLimits } from '@/lib/rate-limit';
import type { AccessLevel } from '@/types/access-level';

const getAccessLevel = vi.hoisted(() => vi.fn());
const getDownloadUrl = vi.hoisted(() => vi.fn());

vi.mock('@/lib/auth', () => ({ getAccessLevel }));
vi.mock('@/lib/r2', () => ({ getDownloadUrl }));

const { GET } = await import('@/app/api/download/route');

const SIGNED = 'https://bucket.r2.example/seemsreal/01.mp3?X-Amz-Signature=abc';

function request(query = '?key=seemsreal%2F01.mp3') {
  return new NextRequest(`http://localhost:3000/api/download${query}`);
}

const as = (level: AccessLevel) => getAccessLevel.mockResolvedValue(level);

describe('GET /api/download', () => {
  beforeEach(() => {
    getAccessLevel.mockReset();
    getDownloadUrl.mockReset();
    getDownloadUrl.mockResolvedValue(SIGNED);
    resetRateLimits();
  });

  it('refuses a signed-out visitor', async () => {
    as('guest');
    expect((await GET(request())).status).toBe(403);
  });

  it('never signs anything for a signed-out visitor', async () => {
    as('guest');
    await GET(request());
    expect(getDownloadUrl).not.toHaveBeenCalled();
  });

  it.each(['member', 'admin'] as AccessLevel[])(
    'redirects a %s to the signed URL',
    async (level) => {
      as(level);
      const res = await GET(request());
      expect(res.status).toBe(302);
      expect(res.headers.get('location')).toBe(SIGNED);
    },
  );

  it('keeps the signed redirect out of shared caches', async () => {
    as('member');
    const res = await GET(request());
    expect(res.headers.get('cache-control')).toContain('no-store');
  });

  it('rejects a request with no key', async () => {
    as('member');
    expect((await GET(request(''))).status).toBe(400);
  });

  it('404s when the key is refused by the signer', async () => {
    as('member');
    getDownloadUrl.mockResolvedValue(null);
    const res = await GET(request('?key=contacts%2Fleak.json'));
    expect(res.status).toBe(404);
  });

  it('does not leak internals when signing throws', async () => {
    as('member');
    getDownloadUrl.mockRejectedValue(new Error('R2 credentials rejected'));
    const res = await GET(request());
    expect(res.status).toBe(500);
    expect(JSON.stringify(await res.json())).not.toContain('credentials');
  });

  it('throttles before it spends an access check', async () => {
    as('member');
    let last: Response | undefined;
    for (let i = 0; i < 21; i++) last = await GET(request());
    expect(last?.status).toBe(429);
    expect(last?.headers.get('retry-after')).toMatch(/^\d+$/);
    // 20 allowed lookups, not 21 — the throttled request never reached auth.
    expect(getAccessLevel).toHaveBeenCalledTimes(20);
  });
});
