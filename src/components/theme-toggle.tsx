'use client';
import '@/components/styles/theme-toggle.css';

import { MoonIcon, SunIcon } from '@phosphor-icons/react';
import PhosphorIcon from '@/components/phosphor-icon';
import { useTheme } from '@/context/theme-provider';

/**
 * A small round icon button, sized to sit beside the account avatar. Shows
 * the theme it will switch to.
 */
export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <button
      type='button'
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className='theme-toggle'
      aria-label='Dark theme'
      aria-pressed={isDark}
    >
      <PhosphorIcon
        as={isDark ? SunIcon : MoonIcon}
        size={16}
        aria-hidden='true'
      />
    </button>
  );
}
