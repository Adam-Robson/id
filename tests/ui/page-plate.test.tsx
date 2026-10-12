import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import PagePlate from '@/components/page-plate';
import PageShell from '@/components/page-shell';
import { PATTERN_KEYS } from '@/lib/constants/pattern-keys';
import { PATTERNS } from '@/lib/constants/patterns';

// The header pulls in auth, theme and routing; none of it bears on how the
// shell pairs a page with its print.
vi.mock('@/components/site-header', () => ({ default: () => null }));

const root = path.resolve(__dirname, '../..');

describe('patterns', () => {
  // A key without an entry would render a plate with no print and no
  // caption, so every key the pages can name must be described.
  it.each(PATTERN_KEYS)('describes the %s print', (key) => {
    expect(PATTERNS[key].key).toBe(key);
    expect(PATTERNS[key].caption).not.toBe('');
  });

  // The plate draws the print from this path; a missing file leaves the
  // band an empty grey block.
  it.each(PATTERN_KEYS)('points %s at an image that ships', (key) => {
    const file = path.join(root, 'public', PATTERNS[key].src);
    expect(existsSync(file)).toBe(true);
  });

  // patterns.css lifts each print's accent onto the document by matching
  // data-pattern. A key with no rule silently falls back to the default
  // accent, so the stylesheet must name every key.
  it.each(PATTERN_KEYS)('gives %s an accent in patterns.css', (key) => {
    const css = readFileSync(
      path.join(root, 'src/app/styles/patterns.css'),
      'utf8',
    );
    if (key === 'pastels') {
      // pastels is the :root default, so it needs no rule of its own.
      expect(css).toMatch(/:root\s*\{[^}]*--p-accent:/);
    } else {
      expect(css).toContain(`[data-pattern="${key}"]`);
    }
  });
});

describe('PagePlate', () => {
  // The print is decoration, so screen readers skip it; the caption is how
  // the page credits it, so it stays ordinary, readable text.
  it('hides the print from assistive tech and shows its caption', () => {
    const { container } = render(<PagePlate pattern='dahlias' />);
    const image = container.querySelector('.page-plate-image');

    expect(image).toHaveAttribute('aria-hidden', 'true');
    expect(image).toHaveStyle({
      backgroundImage: `url(${PATTERNS.dahlias.src})`,
    });
    expect(screen.getByText(PATTERNS.dahlias.caption)).toBeVisible();
  });

  // The home page opens on a taller plate than the rest of the site.
  it('defaults to a band and can be set as the hero', () => {
    const { container, rerender } = render(<PagePlate pattern='poppies' />);
    expect(container.firstChild).toHaveClass('page-plate--band');

    rerender(<PagePlate pattern='poppies' size='hero' />);
    expect(container.firstChild).toHaveClass('page-plate--hero');
  });
});

describe('PageShell', () => {
  // The accent comes from data-pattern and the print from the plate. The
  // shell takes one key for both, so a page cannot show one print while
  // wearing another's colour.
  it('sets data-pattern and the plate from the same key', () => {
    const { container } = render(
      <PageShell pattern='peonies'>
        <main />
      </PageShell>,
    );

    expect(container.firstChild).toHaveAttribute('data-pattern', 'peonies');
    expect(screen.getByText(PATTERNS.peonies.caption)).toBeInTheDocument();
  });
});
