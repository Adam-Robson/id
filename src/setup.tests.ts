import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';

/**
 * Mocks HTMLMediaElement methods for testing purposes in jsdom environment.
 */
beforeEach(() => {
  vi.spyOn(window.HTMLMediaElement.prototype, 'play').mockImplementation(
    function (this: HTMLMediaElement) {
      this.dispatchEvent(new Event('play'));
      return Promise.resolve();
    },
  );
  vi.spyOn(window.HTMLMediaElement.prototype, 'pause').mockImplementation(
    function (this: HTMLMediaElement) {
      this.dispatchEvent(new Event('pause'));
    },
  );
  vi.spyOn(window.HTMLMediaElement.prototype, 'load').mockImplementation(
    () => {},
  );
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});
