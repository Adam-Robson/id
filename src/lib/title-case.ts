/**
 * Words that stay lowercase inside a title. The first and last word are
 * always capitalized regardless, which is the usual convention.
 */
const MINOR_WORDS = new Set([
  'a',
  'an',
  'and',
  'as',
  'at',
  'but',
  'by',
  'for',
  'from',
  'in',
  'into',
  'nor',
  'of',
  'on',
  'or',
  'the',
  'to',
  'up',
  'via',
  'vs',
  'with',
]);

/**
 * Title-cases a lowercase string derived from a filename or folder name.
 * Source names in R2 are lowercase, so this only ever has to add capitals —
 * it does not try to preserve intentional casing it cannot know about.
 */
/**
 * Uppercases the first letter, skipping any leading punctuation so that
 * "(body" becomes "(Body" rather than being left alone.
 */
function capitalize(word: string): string {
  const i = word.search(/[a-z]/i);
  if (i === -1) return word;
  return word.slice(0, i) + word[i].toUpperCase() + word.slice(i + 1);
}

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
