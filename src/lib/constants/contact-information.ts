
export const MAX_NAME_LENGTH = 200;
export const MAX_EMAIL_LENGTH = 320;
export const MAX_MESSAGE_LENGTH = 5000;

/** Catch typos; do not police addresses. */
export const EMAIL_SHAPE = /^[^\s@]+@[^\s@.]+\.[^\s@]+$/;

export const LIMIT = 3;
export const WINDOW_MS = 10 * 60 * 1000;
