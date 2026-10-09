import { auth } from '@clerk/nextjs/server';
import type { AccessLevel } from '@/lib/types/access-level';

/**
 * Get the access level of the currently authenticated user.
 */
export const getAccessLevel = async (): Promise<AccessLevel> => {
  const { userId, sessionClaims } = await auth();
  if (!userId) return 'guest';
  return sessionClaims?.metadata?.role === 'admin' ? 'admin' : 'member';
};
