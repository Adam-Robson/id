import { useSignIn } from '@clerk/nextjs';
import { act, render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import SignInForm from '@/components/auth/sign-in-form';
import useSignInFlow from '@/lib/hooks/use-sign-in-flow';
import { emptyErrors, fail, fakeSignIn } from '../helpers/clerk';

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

describe('useSignInFlow', () => {
  it('signs in, finalizes the session, then redirects', async () => {
    const { result } = renderHook(() =>
      useSignInFlow({ redirectTo: '/albums' }),
    );

    await act(() => result.current.submit(CREDS));

    expect(signIn.password).toHaveBeenCalledWith(CREDS);
    expect(signIn.finalize).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledWith('/albums');
    expect(result.current.blocked).toBe('');
  });

  it('redirects home by default', async () => {
    const { result } = renderHook(() => useSignInFlow({}));
    await act(() => result.current.submit(CREDS));
    expect(push).toHaveBeenCalledWith('/');
  });

  it('stops and reports a rejected password', async () => {
    signIn.password.mockImplementation(() => fail('Password is incorrect.'));
    const { result } = renderHook(() => useSignInFlow({}));

    await act(() => result.current.submit(CREDS));

    expect(result.current.blocked).toBe('Password is incorrect.');
    expect(signIn.finalize).not.toHaveBeenCalled();
    expect(push).not.toHaveBeenCalled();
  });

  it('does not redirect when finalizing the session fails', async () => {
    signIn.finalize.mockImplementation(() => fail('Session could not be set.'));
    const { result } = renderHook(() => useSignInFlow({}));

    await act(() => result.current.submit(CREDS));

    expect(result.current.blocked).toBe('Session could not be set.');
    expect(push).not.toHaveBeenCalled();
  });

  it('reports submitting while Clerk is fetching', () => {
    fetchStatus = 'fetching';
    const { result } = renderHook(() => useSignInFlow({}));
    expect(result.current.isSubmitting).toBe(true);
  });
});

describe('<SignInForm />', () => {
  it('submits the entered credentials and redirects home', async () => {
    const user = userEvent.setup();
    render(<SignInForm />);

    await user.type(screen.getByLabelText('Email'), CREDS.emailAddress);
    await user.type(screen.getByLabelText('Password'), CREDS.password);
    await user.click(screen.getByRole('button', { name: 'Sign in' }));

    expect(signIn.password).toHaveBeenCalledWith(CREDS);
    expect(push).toHaveBeenCalledWith('/');
  });

  it('shows a blocking error from Clerk', async () => {
    signIn.password.mockImplementation(() =>
      fail("Couldn't find your account."),
    );
    const user = userEvent.setup();
    render(<SignInForm />);

    await user.click(screen.getByRole('button', { name: 'Sign in' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      "Couldn't find your account.",
    );
  });

  it('shows field and global errors', () => {
    errors.fields.password = { message: 'Password is too short' };
    errors.global = [
      { code: 'rate', message: 'short', longMessage: 'Too many attempts' },
    ];
    render(<SignInForm />);

    const alerts = screen.getAllByRole('alert').map((a) => a.textContent);
    expect(alerts).toContain('Password is too short');
    expect(alerts).toContain('Too many attempts');
  });

  it('disables the form while signing in', () => {
    fetchStatus = 'fetching';
    render(<SignInForm />);

    expect(screen.getByRole('button', { name: 'Signing in…' })).toBeDisabled();
    expect(screen.getByLabelText('Email')).toBeDisabled();
    expect(screen.getByLabelText('Password')).toBeDisabled();
  });

  it('links to sign up', () => {
    render(<SignInForm />);
    expect(
      screen.getByRole('link', { name: 'Create one for free' }),
    ).toHaveAttribute('href', '/sign-up');
  });
});
