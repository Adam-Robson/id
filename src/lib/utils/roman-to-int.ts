import { ROMAN_NUMERALS_MAP } from '@/lib/constants/number-parsing';
/**
 * Converts a Roman numeral string to its integer value.
 * @param roman The Roman numeral string to convert.
 * @returns The integer value of the Roman numeral.
 */

export function romanToInt(roman: string): number {
  const chars = roman.toLowerCase().split('');
  return chars.reduce((total, char, i) => {
    const value = ROMAN_NUMERALS_MAP[char] ?? 0;
    const next = ROMAN_NUMERALS_MAP[chars[i + 1]] ?? 0;
    return total + (value < next ? -value : value);
  }, 0);
}
