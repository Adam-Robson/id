import { vi } from 'vitest';

/**
 * jsdom has no media pipeline: `paused` is always true, `readyState` is always
 * 0 and `error` is always null. This fakes just enough element state for the
 * player's branching logic, layered over the play/pause mocks in
 * src/setup.tests.ts.
 */
export function fakeMediaElement() {
  const state = {
    paused: true,
    readyState: 4,
    duration: 0,
    error: null as MediaError | null,
  };
  const proto = window.HTMLMediaElement.prototype;

  const play = vi.spyOn(proto, 'play').mockImplementation(function (
    this: HTMLMediaElement,
  ) {
    state.paused = false;
    this.dispatchEvent(new Event('play'));
    return Promise.resolve();
  });
  const pause = vi.spyOn(proto, 'pause').mockImplementation(function (
    this: HTMLMediaElement,
  ) {
    state.paused = true;
    this.dispatchEvent(new Event('pause'));
  });
  const load = vi.spyOn(proto, 'load').mockImplementation(() => {});

  vi.spyOn(proto, 'paused', 'get').mockImplementation(() => state.paused);
  vi.spyOn(proto, 'readyState', 'get').mockImplementation(
    () => state.readyState,
  );
  vi.spyOn(proto, 'duration', 'get').mockImplementation(() => state.duration);
  // jsdom doesn't implement `error` at all, so there's nothing to spy on.
  Object.defineProperty(proto, 'error', {
    configurable: true,
    get: () => state.error,
  });

  let currentTime = 0;
  vi.spyOn(proto, 'currentTime', 'get').mockImplementation(() => currentTime);
  vi.spyOn(proto, 'currentTime', 'set').mockImplementation((v: number) => {
    currentTime = v;
  });

  return {
    state,
    play,
    pause,
    load,
    setCurrentTime: (v: number) => {
      currentTime = v;
    },
  };
}
