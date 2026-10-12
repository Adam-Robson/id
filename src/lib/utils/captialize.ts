/**
 * Uppercases the first letter, skipping any leading punctuation so that
 * "(body" becomes "(Body" rather than being left alone.
 *
 * A word that starts with a digit is left as it is: the letters after the
 * number belong to it ("2ndhand", "7x7", "13th"), so capitalizing them
 * would give "2Ndhand" and "7X7".
 */
export function capitalize(word: string): string {
  const i = word.search(/[a-z0-9]/i);
  if (i === -1 || /\d/.test(word[i])) return word;
  return word.slice(0, i) + word[i].toUpperCase() + word.slice(i + 1);
}
