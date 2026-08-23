import { beforeEach, describe, expect, it, vi } from 'vitest';

const currentUser = vi.hoisted(() => vi.fn());
vi.mock('@clerk/nextjs/server', () => ({ currentUser }));

const { getAccessLevel } = await import('@/lib/auth');

/** Only the shape `getAccessLevel` actually reads. */
const user = (publicMetadata: Record<string, unknown>) => ({ publicMetadata });

describe('getAccessLevel', () => {
  beforeEach(() => {
    currentUser.mockReset();
  });

  it('treats a signed-out visitor as a guest', async () => {
    currentUser.mockResolvedValue(null);
    await expect(getAccessLevel()).resolves.toBe('guest');
  });

  it('treats any signed-in user as a member by default', async () => {
    currentUser.mockResolvedValue(user({}));
    await expect(getAccessLevel()).resolves.toBe('member');
  });

  it('promotes a user whose publicMetadata marks them admin', async () => {
    currentUser.mockResolvedValue(user({ role: 'admin' }));
    await expect(getAccessLevel()).resolves.toBe('admin');
  });

  it('does not accept a near-miss role value', async () => {
    for (const role of ['Admin', 'ADMIN', 'administrator', 'admin ', true, 1]) {
      currentUser.mockResolvedValue(user({ role }));
      await expect(getAccessLevel()).resolves.toBe('member');
    }
  });

  it('does not read the role from unsafeMetadata, which users can set', async () => {
    // unsafeMetadata is writable from the browser by the user themselves;
    // if it were ever consulted, anyone could grant themselves admin.
    currentUser.mockResolvedValue({
      publicMetadata: {},
      unsafeMetadata: { role: 'admin' },
      privateMetadata: { role: 'admin' },
    });
    await expect(getAccessLevel()).resolves.toBe('member');
  });

  it('falls back to member when metadata is missing entirely', async () => {
    currentUser.mockResolvedValue({});
    await expect(getAccessLevel()).resolves.toBe('member');
  });
});
