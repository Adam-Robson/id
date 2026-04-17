import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// jsdom doesn't implement HTMLMediaElement playback APIs — stub them
// so AudioProvider's togglePlay/seek/load effects don't blow up.
window.HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined);
window.HTMLMediaElement.prototype.pause = vi.fn();
window.HTMLMediaElement.prototype.load = vi.fn();

afterEach(() => {
  cleanup();
});
