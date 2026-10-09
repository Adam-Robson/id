/**
 * Uppercases the first letter, skipping any leading punctuation so that
 * "(body" becomes "(Body" rather than being left alone.
 */
export function capitalize(word: string): string {
  const i = word.search(/[a-z]/i);
  if (i === -1) return word;
  return word.slice(0, i) + word[i].toUpperCase() + word.slice(i + 1);
}
