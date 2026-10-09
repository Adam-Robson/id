import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import AlbumTracks from '@/components/album-tracks';
import AudioControls from '@/components/audio-controls';
import { AudioProvider } from '@/context/audio-provider';
import type { AccessLevel } from '@/lib/types/access-level';
import { fakeMediaElement } from '../helpers/media';
import { META, SONGS } from '../helpers/songs';

let media: ReturnType<typeof fakeMediaElement>;

beforeEach(() => {
  media = fakeMediaElement();
});

/** An album page for the first album, with the player bar mounted. */
function renderPlayer(accessLevel: AccessLevel = 'member') {
  const onToggleList = vi.fn();
  const ui = render(
    <AudioProvider>
      <AlbumTracks
        catalog={SONGS}
        albumSongs={META.filter((s) => s.album === 'First').map(
          (s) => SONGS.find((song) => song.key === s.key) ?? s,
        )}
        accessLevel={accessLevel}
      />
      <AudioControls onToggleList={onToggleList} listOpen={false} />
    </AudioProvider>,
  );
  return { ...ui, onToggleList, user: userEvent.setup() };
}

describe('track list', () => {
  it('lets a member start a track and marks it active', async () => {
    const { user } = renderPlayer('member');

    await user.click(screen.getByRole('button', { name: 'Play Middle' }));

    expect(media.play).toHaveBeenCalledTimes(1);
    expect(document.querySelector('audio')?.getAttribute('src')).toBe(
      SONGS[1].url,
    );
    expect(screen.getByRole('button', { name: 'Play Middle' })).toHaveAttribute(
      'aria-current',
      'true',
    );
    expect(screen.getByRole('button', { name: 'Pause' })).toBeInTheDocument();
  });

  it('pauses when the active track is clicked again', async () => {
    const { user } = renderPlayer('member');
    const track = screen.getByRole('button', { name: 'Play Opening' });

    await user.click(track);
    await user.click(track);

    expect(media.pause).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: 'Play' })).toBeInTheDocument();
  });

  it('offers downloads to members', () => {
    renderPlayer('member');
    expect(
      screen.getByRole('link', { name: 'Download Opening' }),
    ).toHaveAttribute(
      'href',
      `/api/download?key=${encodeURIComponent(META[0].key)}`,
    );
  });

  it('locks playback and downloads for guests', () => {
    renderPlayer('guest');

    expect(screen.getByText('Opening')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^Play / })).toBeNull();
    expect(screen.queryByRole('link', { name: /^Download / })).toBeNull();
    // The catalog is never handed to the player, so no audio element exists.
    expect(document.querySelector('audio')).toBeNull();
  });
});

describe('audio controls', () => {
  it('shows the current song and toggles play/pause', async () => {
    const { user } = renderPlayer();

    expect(screen.getByText('Opening', { selector: '.song-title' }));
    await user.click(screen.getByRole('button', { name: 'Play' }));
    expect(media.play).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole('button', { name: 'Pause' }));
    expect(media.pause).toHaveBeenCalledTimes(1);
  });

  it('skips forward and back', async () => {
    const { user } = renderPlayer();

    await user.click(screen.getByRole('button', { name: 'Next song' }));
    expect(screen.getByText('Middle', { selector: '.song-title' }));

    await user.click(screen.getByRole('button', { name: 'Previous song' }));
    await user.click(screen.getByRole('button', { name: 'Previous song' }));
    expect(screen.getByText('Closing', { selector: '.song-title' }));
    expect(screen.getByText('Second', { selector: '.song-album' }));
  });

  it('reflects progress and seeks', () => {
    renderPlayer();
    const audio = document.querySelector('audio') as HTMLAudioElement;
    media.state.duration = 200;
    act(() => {
      audio.dispatchEvent(new Event('loadedmetadata'));
    });
    media.setCurrentTime(65);
    act(() => {
      audio.dispatchEvent(new Event('timeupdate'));
    });

    const seek = screen.getByRole('slider', { name: 'Seek' });
    expect(seek).toHaveAttribute('max', '200');
    expect(seek).toHaveAttribute('aria-valuetext', '1:05 of 3:20');
    expect(screen.getByText('1:05 / 3:20')).toBeInTheDocument();

    act(() => {
      // Range inputs can't be typed into; set the value and fire change.
      const setter = Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        'value',
      )?.set;
      setter?.call(seek, '150');
      seek.dispatchEvent(new Event('input', { bubbles: true }));
    });
    expect(audio.currentTime).toBe(150);
    expect(screen.getByText('2:30 / 3:20')).toBeInTheDocument();
  });

  it('toggles the song list', async () => {
    const { user, onToggleList } = renderPlayer();
    await user.click(screen.getByRole('button', { name: 'Open song list' }));
    expect(onToggleList).toHaveBeenCalledTimes(1);
  });
});
