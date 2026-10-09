import { act, render, renderHook, screen } from '@testing-library/react';
import type { ChangeEvent } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import SongCatalog from '@/components/song-catalog';
import { AudioProvider, useAudio } from '@/context/audio-provider';
import { STREAM_URL_REFRESH_MS } from '@/lib/constants/stream-url';
import { fakeMediaElement } from '../helpers/media';
import { SONGS } from '../helpers/songs';

let media: ReturnType<typeof fakeMediaElement>;

beforeEach(() => {
  media = fakeMediaElement();
});

const audioEl = () => {
  const el = document.querySelector('audio');
  if (!el) throw new Error('audio element not rendered');
  return el;
};

const fire = (type: string) =>
  act(() => {
    audioEl().dispatchEvent(new Event(type));
  });

/** Renders the provider and loads the given catalog. */
function setup(songs = SONGS) {
  const hook = renderHook(() => useAudio(), { wrapper: AudioProvider });
  act(() => hook.result.current.setSongs(songs));
  return hook;
}

describe('useAudio', () => {
  it('throws outside an AudioProvider', () => {
    expect(() => renderHook(() => useAudio())).toThrow(
      'useAudio must be used within an AudioProvider',
    );
  });
});

describe('AudioProvider', () => {
  it('renders no audio element until songs are loaded', () => {
    const { result } = renderHook(() => useAudio(), { wrapper: AudioProvider });
    expect(document.querySelector('audio')).toBeNull();
    expect(result.current.songsLoaded).toBe(false);
  });

  it('loads the first track without autoplaying', () => {
    const { result } = setup();
    expect(result.current.songsLoaded).toBe(true);
    expect(result.current.current).toBe(0);
    expect(result.current.isPlaying).toBe(false);
    expect(audioEl().getAttribute('src')).toBe(SONGS[0].url);
    expect(media.play).not.toHaveBeenCalled();
  });

  it('keeps the first catalog it is given', () => {
    const { result } = setup();
    act(() => result.current.setSongs(SONGS.slice(1)));
    expect(result.current.songs).toEqual(SONGS);
  });

  it('announces the current track to screen readers', () => {
    setup();
    expect(screen.getByRole('status')).toHaveTextContent(
      'Now playing: Opening from First',
    );
  });

  describe('togglePlay', () => {
    it('plays then pauses the loaded track', () => {
      const { result } = setup();

      act(() => result.current.togglePlay());
      expect(media.play).toHaveBeenCalledTimes(1);
      expect(result.current.isPlaying).toBe(true);

      act(() => result.current.togglePlay());
      expect(media.pause).toHaveBeenCalledTimes(1);
      expect(result.current.isPlaying).toBe(false);
    });

    it('does not reload a healthy, already-loaded source', () => {
      const { result } = setup();
      act(() => result.current.togglePlay());
      expect(media.load).not.toHaveBeenCalled();
    });

    it('reloads the source before playing when the element has errored', () => {
      const { result } = setup();
      media.state.error = { code: 2 } as MediaError;

      act(() => result.current.togglePlay());

      expect(media.load).toHaveBeenCalledTimes(1);
      expect(media.load.mock.invocationCallOrder[0]).toBeLessThan(
        media.play.mock.invocationCallOrder[0],
      );
      expect(audioEl().getAttribute('src')).toBe(SONGS[0].url);
    });

    it('reloads when the element has no data yet', () => {
      const { result } = setup();
      media.state.readyState = 0;
      act(() => result.current.togglePlay());
      expect(media.load).toHaveBeenCalledTimes(1);
    });

    it('swallows a rejected play() (e.g. autoplay blocked)', async () => {
      const { result } = setup();
      media.play.mockImplementationOnce(() =>
        Promise.reject(new DOMException('blocked', 'NotAllowedError')),
      );
      act(() => result.current.togglePlay());
      // Let the rejection settle; an unhandled one would fail the run.
      await act(async () => {});
      expect(result.current.isPlaying).toBe(false);
    });
  });

  describe('playAt', () => {
    it('switches to and plays a different track', () => {
      const { result } = setup();

      act(() => result.current.playAt(2));

      expect(result.current.current).toBe(2);
      expect(audioEl().getAttribute('src')).toBe(SONGS[2].url);
      expect(media.play).toHaveBeenCalledTimes(1);
      expect(result.current.isPlaying).toBe(true);
      expect(screen.getByRole('status')).toHaveTextContent(
        'Now playing: Closing from Second',
      );
    });

    it('does not call load() when switching, so play() is not aborted', () => {
      const { result } = setup();
      act(() => result.current.playAt(1));
      expect(media.load).not.toHaveBeenCalled();
    });

    it('does not interrupt the newly started track when the effect re-runs', () => {
      const { result } = setup();
      act(() => result.current.playAt(1));
      // The sync effect ran for current=1; it must not have reset playback.
      expect(result.current.isPlaying).toBe(true);
      expect(media.pause).not.toHaveBeenCalled();
    });

    it('resets progress when switching tracks', () => {
      const { result } = setup();
      media.setCurrentTime(42);
      fire('timeupdate');
      expect(result.current.progress).toBe(42);

      act(() => result.current.playAt(1));
      expect(result.current.progress).toBe(0);
    });

    it('toggles pause/play when the current track is chosen again', () => {
      const { result } = setup();

      act(() => result.current.playAt(0));
      expect(result.current.isPlaying).toBe(true);

      act(() => result.current.playAt(0));
      expect(media.pause).toHaveBeenCalledTimes(1);
      expect(result.current.isPlaying).toBe(false);
      expect(result.current.current).toBe(0);
    });
  });

  describe('next / prev', () => {
    it('advances and wraps to the start', () => {
      const { result } = setup();
      act(() => result.current.next());
      expect(result.current.current).toBe(1);
      act(() => result.current.next());
      act(() => result.current.next());
      expect(result.current.current).toBe(0);
      expect(media.play).toHaveBeenCalledTimes(3);
    });

    it('goes back and wraps to the end', () => {
      const { result } = setup();
      act(() => result.current.prev());
      expect(result.current.current).toBe(SONGS.length - 1);
      expect(audioEl().getAttribute('src')).toBe(SONGS.at(-1)?.url);
    });

    it('does nothing with an empty catalog', () => {
      const { result } = renderHook(() => useAudio(), {
        wrapper: AudioProvider,
      });
      act(() => result.current.next());
      act(() => result.current.prev());
      expect(result.current.current).toBe(0);
      expect(media.play).not.toHaveBeenCalled();
    });
  });

  describe('media events', () => {
    it('tracks progress and duration', () => {
      const { result } = setup();
      media.state.duration = 185;
      fire('loadedmetadata');
      media.setCurrentTime(61.7);
      fire('timeupdate');

      expect(result.current.duration).toBe(185);
      expect(result.current.progress).toBe(61.7);
    });

    it('auto-advances to the next track when one ends', () => {
      const { result } = setup();
      act(() => result.current.playAt(1));

      fire('ended');

      expect(result.current.current).toBe(2);
      expect(audioEl().getAttribute('src')).toBe(SONGS[2].url);
      expect(media.play).toHaveBeenCalledTimes(2);
    });

    it('wraps to the first track after the last one ends', () => {
      const { result } = setup();
      act(() => result.current.playAt(2));
      fire('ended');
      expect(result.current.current).toBe(0);
    });

    it('loops a single-track catalog from the start', () => {
      const { result } = setup(SONGS.slice(0, 1));
      act(() => result.current.togglePlay());
      media.setCurrentTime(200);

      fire('ended');

      expect(result.current.current).toBe(0);
      expect(audioEl().currentTime).toBe(0);
      expect(media.play).toHaveBeenCalledTimes(2);
    });

    it('stops playing on error and reloads on the next attempt', () => {
      const { result } = setup();
      act(() => result.current.togglePlay());
      expect(result.current.isPlaying).toBe(true);

      media.state.paused = true;
      fire('error');
      expect(result.current.isPlaying).toBe(false);

      // Error cleared the loaded-source marker, so play must reload.
      act(() => result.current.togglePlay());
      expect(media.load).toHaveBeenCalledTimes(1);
      expect(result.current.isPlaying).toBe(true);
    });
  });

  describe('expiring stream URLs', () => {
    // The element reuses the signed URL it was redirected to, so once that
    // expires it plays its buffer and then stalls with no error.
    const later = () =>
      vi
        .spyOn(Date, 'now')
        .mockReturnValue(Date.now() + STREAM_URL_REFRESH_MS + 1);

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('re-resolves a stale source before playing, keeping its position', () => {
      const { result } = setup();
      media.setCurrentTime(42);
      later();

      act(() => result.current.togglePlay());

      expect(media.load).toHaveBeenCalledTimes(1);
      expect(media.play).toHaveBeenCalledTimes(1);
      media.setCurrentTime(0);
      fire('loadedmetadata');
      expect(audioEl().currentTime).toBe(42);
    });

    it('recovers from a stall on a stale source while playing', () => {
      const { result } = setup();
      act(() => result.current.togglePlay());
      const srcSet = vi.spyOn(HTMLMediaElement.prototype, 'src', 'set');
      later();

      fire('stalled');

      expect(srcSet).toHaveBeenCalledWith(SONGS[0].url);
      expect(media.play).toHaveBeenCalledTimes(2);
    });

    it('leaves an ordinary network stall alone', () => {
      const { result } = setup();
      act(() => result.current.togglePlay());
      const srcSet = vi.spyOn(HTMLMediaElement.prototype, 'src', 'set');

      fire('stalled');

      expect(srcSet).not.toHaveBeenCalled();
      expect(media.play).toHaveBeenCalledTimes(1);
    });
  });

  it('seeks the element and progress', () => {
    const { result } = setup();
    act(() =>
      result.current.seek({
        target: { value: '90' },
      } as ChangeEvent<HTMLInputElement>),
    );
    expect(audioEl().currentTime).toBe(90);
    expect(result.current.progress).toBe(90);
  });

  it.each([
    [0, '0:00'],
    [9.9, '0:09'],
    [61, '1:01'],
    [600, '10:00'],
  ])('formats %s seconds as %s', (s, expected) => {
    const { result } = setup();
    expect(result.current.fmt(s)).toBe(expected);
  });

  it('removes its listeners on unmount', () => {
    const { unmount } = render(
      <AudioProvider>
        <SongCatalog songs={SONGS} />
      </AudioProvider>,
    );
    const el = audioEl();
    unmount();
    el.dispatchEvent(new Event('ended'));
    expect(media.play).not.toHaveBeenCalled();
  });
});
