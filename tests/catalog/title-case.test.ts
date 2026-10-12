import { describe, expect, it } from 'vitest';
import { titleCase } from '@/lib/utils/title-case';

describe('titleCase', () => {
  // Song titles come from lowercase filenames. A word that starts with a
  // number keeps its letters lowercase, because they belong to the number:
  // "2ndhand" is one word, not "2" and "Ndhand".
  it.each([
    ['2ndhand planet', '2ndhand Planet'],
    ['7x7', '7x7'],
    ['13 days', '13 Days'],
  ])('leaves the letters after a number alone in "%s"', (input, title) => {
    expect(titleCase(input)).toBe(title);
  });

  // Leading punctuation is skipped so a parenthesised word still gets its
  // capital.
  it('capitalizes a word after an opening bracket', () => {
    expect(titleCase('sustenance pt 1 (body love)')).toBe(
      'Sustenance Pt 1 (Body Love)',
    );
  });

  // Minor words stay lowercase inside a title but not at either end.
  it('keeps minor words lowercase except at the ends', () => {
    expect(titleCase('cut up the rug')).toBe('Cut up the Rug');
    expect(titleCase('the song of')).toBe('The Song Of');
  });
});
