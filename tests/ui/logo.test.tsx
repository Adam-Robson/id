import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Logo from '@/components/logo';
import { LOGO_ORBS } from '@/lib/constants/logo-orbs';

const root = path.resolve(import.meta.dirname, '../..');

const orbSources = (container: HTMLElement) =>
  [...container.querySelectorAll('img')].map((img) => img.getAttribute('src'));

describe('Logo', () => {
  // The lettering is a CSS mask and the orb is decorative, so nothing in
  // the logo is readable text; the name has to be given explicitly or
  // screen readers announce an unlabelled link in the header.
  it('is announced as LE FOG', () => {
    render(<Logo />);
    expect(screen.getByRole('img', { name: 'LE FOG' })).toBeInTheDocument();
  });

  // Away from the home page the brand shows its primary colourway only;
  // stacking the others would download images nobody sees.
  it('shows only the primary orb when not cycling', () => {
    const { container } = render(<Logo />);
    expect(orbSources(container)).toEqual([
      `/images/logo/orb-${LOGO_ORBS[0]}.webp`,
    ]);
  });

  // The crossfade leaves the first image in place and fades the rest over
  // it, so the primary must be first: it is what reduced-motion visitors
  // see and what shows between loops.
  it('stacks every colourway, primary first, when cycling', () => {
    const { container } = render(<Logo cycle />);
    expect(orbSources(container)).toEqual(
      LOGO_ORBS.map((name) => `/images/logo/orb-${name}.webp`),
    );
  });

  // logo.css times the loop as 5s per colourway in a 25s animation. A
  // colourway added without retiming the keyframes would overlap or leave
  // a gap, so the count and the stylesheet must agree.
  it('times the crossfade loop for every colourway', () => {
    const css = readFileSync(
      path.join(root, 'src/components/styles/logo.css'),
      'utf8',
    );
    expect(css).toContain(`orb-cycle ${LOGO_ORBS.length * 5}s`);
  });

  // The orbs are static files; a colourway named here without its file
  // would render a broken image in the header.
  it.each(LOGO_ORBS)('ships an orb image for %s', (name) => {
    const file = path.join(root, `public/images/logo/orb-${name}.webp`);
    expect(existsSync(file)).toBe(true);
  });

  it('ships the lettering the mask points at', () => {
    const file = path.join(root, 'public/images/logo/wordmark.svg');
    expect(existsSync(file)).toBe(true);
  });
});
