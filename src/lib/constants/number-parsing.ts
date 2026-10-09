
/** Arabic track prefix: "07 ", "07-", "07." */
export const ARABIC_PREFIX = /^(\d+)[\s._-]+(.+)$/;
/** Roman track prefix: "iv ", "viii-". Validity is checked separately. */
export const ROMAN_PREFIX = /^([ivxlcdm]+)[\s._-]+(.+)$/i;
/** Rejects malfrmed numerals like "iiii" or "vv" that the loose class allows. */
export const ROMAN_NUMERALS = /^m{0,3}(cm|cd|d?c{0,3})(xc|xl|l?x{0,3})(ix|iv|v?i{0,3})$/i;

/** Digit values behind the roman numerals, keyed lowercase to match the parse. */
export const ROMAN_NUMERALS_MAP: Record<string, number> = {
  i: 1,
  v: 5,
  x: 10,
  l: 50,
  c: 100,
  d: 500,
  m: 1000,
};
