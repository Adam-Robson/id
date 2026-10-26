import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import AlbumLoading from '@/app/albums/[slug]/loading';
import ShelfLoading from '@/app/albums/loading';

// The header pulls in auth, theme and routing; none of it bears on how a
// skeleton lines up with the page it stands in for.
vi.mock('@/components/site-header', () => ({ default: () => null }));

describe('album loading states', () => {
  // Next scrolls to the top of the page segment after a navigation, so the
  // shell (header and print) has to be inside the page, and the skeleton
  // has to draw the same one in the same print or the print would change
  // when the page arrives.
  it.each([
    ['shelf', ShelfLoading, 'poppies'],
    ['album', AlbumLoading, 'dahlias'],
  ])(
    'the %s skeleton draws the page shell in its print',
    (_, Loading, print) => {
      const { container } = render(<Loading />);
      const wrapper = container.querySelector('.page-wrapper');
      expect(wrapper?.getAttribute('data-pattern')).toBe(print);
      expect(wrapper?.querySelector('.page-plate')).not.toBeNull();
    },
  );

  // The skeleton reuses the shelf's grid and tile classes rather than its
  // own copies, so covers sit exactly where the real covers will.
  it('lays the shelf skeleton out with the shelf grid', () => {
    const { container } = render(<ShelfLoading />);
    expect(container.querySelector('.album-shelf')).not.toBeNull();
    expect(
      container.querySelectorAll('.album-tile .album-tile-cover'),
    ).toHaveLength(3);
  });

  it('lays the album skeleton out with the album header', () => {
    const { container } = render(<AlbumLoading />);
    expect(
      container.querySelector('.album-page-header .album-page-cover'),
    ).not.toBeNull();
  });
});
