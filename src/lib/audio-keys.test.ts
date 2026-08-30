import { describe, expect, it } from 'vitest';
import { isAudioKey } from '@/lib/audio-keys';

describe('isAudioKey', () => {
  it('accepts the audio formats in the bucket', () => {
    for (const ext of ['mp3', 'wav', 'flac', 'ogg', 'm4a', 'aac']) {
      expect(isAudioKey(`seemsreal/01 horsey.${ext}`)).toBe(true);
    }
  });

  it('is case-insensitive about the extension', () => {
    expect(isAudioKey('seemsreal/01 horsey.MP3')).toBe(true);
  });

  it('refuses the contact submissions stored in the same bucket', () => {
    // The routes take this key from the query string, so this is what stops
    // a signed-in visitor from reading other people's messages.
    expect(isAudioKey('contacts/2026-04-16T00:00:00.000Z_abc.json')).toBe(
      false,
    );
  });

  it('refuses a key that only mentions an audio extension mid-path', () => {
    expect(isAudioKey('contacts/not-really.mp3.json')).toBe(false);
    expect(isAudioKey('mp3/secrets.json')).toBe(false);
  });

  it('refuses an empty or extensionless key', () => {
    expect(isAudioKey('')).toBe(false);
    expect(isAudioKey('seemsreal/horsey')).toBe(false);
  });
});
