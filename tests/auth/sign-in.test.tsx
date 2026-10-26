import { useSignIn } from '@clerk/nextjs';
import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SIGN_IN_INCOMPLETE } from '@/lib/constants/sign-in-incomplete';
import { SIGN_IN_STATUS_MESSAGES } from '@/lib/constants/sign-in-status-messages';
import useSignInFlow from '@/lib/hooks/use-sign-in-flow';
import { emptyErrors, fail, fakeSignIn, ok } from '../helpers/clerk';

const push = vi.fn();

vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }));
vi.mock('@clerk/nextjs', () => ({ useSignIn: vi.fn() }));

let signIn: ReturnType<typeof fakeSignIn>;
let errors: ReturnType<typeof emptyErrors>;
let fetchStatus: 'idle' | 'fetching';

beforeEach(() => {
  push.mockReset();
  signIn = fakeSignIn();
  errors = emptyErrors();
  fetchStatus = 'idle';
  vi.mocked(useSignIn).mockImplementation(
    () => ({ signIn, errors, fetchStatus }) as never,
  );
});

const CREDS = { emailAddress: 'fan@example.com', password: 'hunter22' };

/** Clerk accepts the password but wants this device verified first. */
function needsDeviceCode() {
  signIn.status = 'needs_client_trust';
  signIn.mfa.verifyEmailCode.mockImplementation(() => {
    signIn.status = 'complete';
    return ok();
  });
}

describe('useSignInFlow', () => {
  const setup = () => renderHook(() => useSignInFlow({ redirectTo: '/next' }));

  it('starts at the credentials step', () => {
    const { result } = setup();
    expect(result.current.step).toBe('credentials');
    expect(result.current.blocked).toBe('');
  });

  it('finalizes and redirects when the password completes sign-in', async () => {
    const { result } = setup();

    await act(() => result.current.submit(CREDS));

    expect(signIn.password).toHaveBeenCalledWith(CREDS);
    expect(signIn.finalize).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledWith('/next');
  });

  it('redirects home by default', async () => {
    const { result } = renderHook(() => useSignInFlow({}));
    await act(() => result.current.submit(CREDS));
    expect(push).toHaveBeenCalledWith('/');
  });

  it('stops and reports a rejected password', async () => {
    signIn.password.mockImplementation(() => fail('Password is incorrect.'));
    const { result } = setup();

    await act(() => result.current.submit(CREDS));

    expect(result.current.blocked).toBe('Password is incorrect.');
    expect(signIn.finalize).not.toHaveBeenCalled();
    expect(push).not.toHaveBeenCalled();
  });

  // Finalizing without a session throws inside Clerk instead of returning an
  // error, so a new device must go through the emailed code first.
  it.each(['needs_client_trust', 'needs_second_factor'])(
    'emails a code instead of finalizing on %s',
    async (status) => {
      signIn.status = status;
      const { result } = setup();

      await act(() => result.current.submit(CREDS));

      expect(signIn.finalize).not.toHaveBeenCalled();
      expect(signIn.mfa.sendEmailCode).toHaveBeenCalledTimes(1);
      expect(result.current.step).toBe('verify');
      expect(result.current.email).toBe(CREDS.emailAddress);
    },
  );

  it('verifies the code, finalizes and redirects', async () => {
    needsDeviceCode();
    const { result } = setup();
    await act(() => result.current.submit(CREDS));

    await act(() => result.current.submitCode('123456'));

    expect(signIn.mfa.verifyEmailCode).toHaveBeenCalledWith({ code: '123456' });
    expect(signIn.finalize).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledWith('/next');
  });

  it('does not finalize on a wrong code', async () => {
    needsDeviceCode();
    signIn.mfa.verifyEmailCode.mockImplementation(() => fail('Incorrect code'));
    const { result } = setup();
    await act(() => result.current.submit(CREDS));

    await act(() => result.current.submitCode('000000'));

    expect(signIn.finalize).not.toHaveBeenCalled();
    expect(result.current.step).toBe('verify');
  });

  it('stays on credentials when the code cannot be sent', async () => {
    signIn.status = 'needs_client_trust';
    signIn.mfa.sendEmailCode.mockImplementation(() => fail('Rate limited'));
    const { result } = setup();

    await act(() => result.current.submit(CREDS));

    expect(result.current.blocked).toBe('Rate limited');
    expect(result.current.step).toBe('credentials');
  });

  // Only email codes have a form here; asking for any other factor would
  // leave the user on a step they cannot finish.
  it('explains a second factor without an email code', async () => {
    signIn.status = 'needs_second_factor';
    signIn.supportedSecondFactors = [{ strategy: 'totp' }];
    const { result } = setup();

    await act(() => result.current.submit(CREDS));

    expect(signIn.mfa.sendEmailCode).not.toHaveBeenCalled();
    expect(result.current.blocked).toBe(
      SIGN_IN_STATUS_MESSAGES.needs_second_factor,
    );
  });

  it.each([
    ['needs_new_password', SIGN_IN_STATUS_MESSAGES.needs_new_password],
    ['needs_protect_check', SIGN_IN_INCOMPLETE],
  ])('explains why %s cannot finish', async (status, message) => {
    signIn.status = status;
    const { result } = setup();

    await act(() => result.current.submit(CREDS));

    expect(result.current.blocked).toBe(message);
    expect(signIn.finalize).not.toHaveBeenCalled();
  });

  it('does not redirect when finalizing the session fails', async () => {
    signIn.finalize.mockImplementation(() => fail('Session could not be set.'));
    const { result } = setup();

    await act(() => result.current.submit(CREDS));

    expect(result.current.blocked).toBe('Session could not be set.');
    expect(push).not.toHaveBeenCalled();
  });

  it('reports submitting while Clerk is fetching', () => {
    fetchStatus = 'fetching';
    const { result } = setup();
    expect(result.current.isSubmitting).toBe(true);
  });
});
