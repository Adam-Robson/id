import { COLLECTABLE } from '@/lib/constants/collectable';
import type { Collectable } from '@/lib/types/collectable';
/**
 * Determines if the given field is collectable.
 */
export const isCollectable = (field: string): field is Collectable =>
  (COLLECTABLE as readonly string[]).includes(field);
