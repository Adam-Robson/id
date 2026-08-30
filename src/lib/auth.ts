import { currentUser } from '@clerk/nextjs/server';
import { cache } from 'react';
import type { AccessLevel } from '@/types/access-level';

/**
 * Wrapped in React's `cache()` because the root layout and the page both ask
 * for the access level on every render, and each uncached call is a separate
 * round-trip to Clerk's Backend API. The cache is scoped to one server
 * request, so access is still re-checked on every request; outside a React
 * render (route handlers, tests) `cache()` is a passthrough.
 */
export const getAccessLevel = cache(async (): Promise<AccessLevel> => {
  const user = await currentUser();
  if (!user) return 'guest';
  return user.publicMetadata?.role === 'admin' ? 'admin' : 'member';
});
