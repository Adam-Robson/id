import { capitalize } from '@/lib/utils/captialize';
import { MINOR_WORDS } from '@/lib/types/minor-words';
/**
 * Title-cases a lowercase string derived from a filename or folder name.
 * Source names in R2 are lowercase, so this only ever has to add capitals —
 * it does not try to preserve intentional casing it cannot know about.
 */
export function titleCase(input: string): string {
  const words = input.split(/\s+/).filter(Boolean);

  return words
    .map((word, i) => {
      const lower = word.toLowerCase();
      const isEdgeWord = i === 0 || i === words.length - 1;
      if (!isEdgeWord && MINOR_WORDS.has(lower)) return lower;
      return capitalize(lower);
    })
    .join(' ');
}
