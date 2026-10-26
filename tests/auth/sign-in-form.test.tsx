import { useSignIn } from '@clerk/nextjs';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import SignInForm from '@/components/auth/sign-in-form';
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

async function signInWith(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('Email'), CREDS.emailAddress);
  await user.type(screen.getByLabelText('Password'), CREDS.password);
  await user.click(screen.getByRole('button', { name: 'Sign in' }));
}

describe('<SignInForm />', () => {
  it('submits the entered credentials and redirects home', async () => {
    const user = userEvent.setup();
    render(<SignInForm />);

    await signInWith(user);

    expect(signIn.password).toHaveBeenCalledWith(CREDS);
    expect(push).toHaveBeenCalledWith('/');
  });

  it('walks a new device through credentials → code → redirect', async () => {
    signIn.status = 'needs_client_trust';
    signIn.mfa.verifyEmailCode.mockImplementation(() => {
      signIn.status = 'complete';
      return ok();
    });
    const user = userEvent.setup();
    render(<SignInForm />);

    await signInWith(user);

    expect(
      await screen.findByText(
        `Enter the code we sent to ${CREDS.emailAddress}.`,
      ),
    ).toBeInTheDocument();

    // The code field mounts as a fresh form, so autoFocus runs and the
    // password input is not reused in its place.
    const code = screen.getByLabelText('Verification code');
    expect(code).toHaveFocus();
    await user.type(code, '12-34 56');
    expect(code).toHaveValue('123456');

    await user.click(screen.getByRole('button', { name: 'Verify' }));

    expect(signIn.mfa.verifyEmailCode).toHaveBeenCalledWith({
      code: '123456',
    });
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
