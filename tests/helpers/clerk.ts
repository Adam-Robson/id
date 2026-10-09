import { vi } from 'vitest';

type ClerkError = { code: string; message: string; longMessage?: string };
type Result = Promise<{ error: ClerkError | null }>;

export const ok = (): Result => Promise.resolve({ error: null });
export const fail = (message: string, code = 'form_error'): Result =>
  Promise.resolve({ error: { code, message } });

export function emptyErrors() {
  return {
    fields: {} as Record<string, { message: string } | undefined>,
    global: null as ClerkError[] | null,
  };
}

/** Stand-in for the `signIn` resource returned by Clerk's `useSignIn()`. */
export function fakeSignIn() {
  return {
    password: vi.fn(ok),
    finalize: vi.fn(ok),
  };
}

/** Stand-in for the `signUp` resource returned by Clerk's `useSignUp()`. */
export function fakeSignUp() {
  return {
    status: 'missing_requirements' as string,
    missingFields: [] as string[],
    password: vi.fn(ok),
    update: vi.fn(ok),
    finalize: vi.fn(ok),
    verifications: {
      sendEmailCode: vi.fn(ok),
      verifyEmailCode: vi.fn(ok),
    },
  };
}
