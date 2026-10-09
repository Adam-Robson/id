import { useSignUp } from '@clerk/nextjs';
import { act, render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import SignUpForm from '@/components/auth/sign-up-form';
import useSignUpFlow from '@/lib/hooks/use-sign-up-flow';
import { emptyErrors, fail, fakeSignUp, ok } from '../helpers/clerk';

const push = vi.fn();

vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }));
vi.mock('@clerk/nextjs', () => ({ useSignUp: vi.fn() }));

let signUp: ReturnType<typeof fakeSignUp>;
let errors: ReturnType<typeof emptyErrors>;
let fetchStatus: 'idle' | 'fetching';

beforeEach(() => {
  push.mockReset();
  signUp = fakeSignUp();
  errors = emptyErrors();
  fetchStatus = 'idle';
  vi.mocked(useSignUp).mockImplementation(
    () => ({ signUp, errors, fetchStatus }) as never,
  );
  // Verifying the code completes the sign-up, as Clerk does.
  signUp.verifications.verifyEmailCode.mockImplementation(() => {
    signUp.status = 'complete';
    return ok();
  });
});

const DETAILS = { email: 'fan@example.com', password: 'correct-horse' };

describe('useSignUpFlow', () => {
  const setup = () => renderHook(() => useSignUpFlow({ redirectTo: '/next' }));

  it('starts at the details step', () => {
    const { result } = setup();
    expect(result.current.step).toBe('details');
    expect(result.current.blocked).toBe('');
  });

  it('creates the account, sends a code and moves to verify', async () => {
    const { result } = setup();

    await act(() => result.current.submitDetails(DETAILS));

    expect(signUp.password).toHaveBeenCalledWith({
      emailAddress: DETAILS.email,
      password: DETAILS.password,
    });
    expect(signUp.verifications.sendEmailCode).toHaveBeenCalledTimes(1);
    expect(result.current.step).toBe('verify');
    expect(result.current.email).toBe(DETAILS.email);
  });

  it('passes optional fields only when filled in', async () => {
    const { result } = setup();

    await act(() =>
      result.current.submitDetails({
        ...DETAILS,
        username: 'fan',
        firstName: '',
        lastName: 'Doe',
      }),
    );

    expect(signUp.password).toHaveBeenCalledWith({
      emailAddress: DETAILS.email,
      password: DETAILS.password,
      username: 'fan',
      lastName: 'Doe',
    });
  });

  it('stays on details when Clerk rejects them', async () => {
    signUp.password.mockImplementation(() => fail('Email taken'));
    const { result } = setup();

    await act(() => result.current.submitDetails(DETAILS));

    expect(result.current.step).toBe('details');
    expect(signUp.verifications.sendEmailCode).not.toHaveBeenCalled();
  });

  it('asks for a username when Clerk requires one', async () => {
    signUp.missingFields = ['username'];
    const { result } = setup();

    await act(() => result.current.submitDetails(DETAILS));

    expect(result.current.step).toBe('username');
    expect(signUp.verifications.sendEmailCode).not.toHaveBeenCalled();
  });

  it('continues to verify once the username is accepted', async () => {
    signUp.missingFields = ['username'];
    signUp.update.mockImplementation(() => {
      signUp.missingFields = [];
      return ok();
    });
    const { result } = setup();
    await act(() => result.current.submitDetails(DETAILS));

    await act(() => result.current.submitUsername('fan'));

    expect(signUp.update).toHaveBeenCalledWith({ username: 'fan' });
    expect(result.current.step).toBe('verify');
  });

  it('stays on the username step when it is rejected', async () => {
    signUp.missingFields = ['username'];
    signUp.update.mockImplementation(() => fail('Username taken'));
    const { result } = setup();
    await act(() => result.current.submitDetails(DETAILS));

    await act(() => result.current.submitUsername('taken'));

    expect(result.current.step).toBe('username');
  });

  it('blocks on required fields the form cannot collect', async () => {
    signUp.missingFields = ['phone_number', 'legal_accepted'];
    const { result } = setup();

    await act(() => result.current.submitDetails(DETAILS));

    expect(result.current.step).toBe('details');
    expect(result.current.blocked).toBe(
      'Accounts on this site also require phone number, accepting the terms',
    );
  });

  it('stays on details if the code cannot be sent', async () => {
    signUp.verifications.sendEmailCode.mockImplementation(() =>
      fail('Too many codes'),
    );
    const { result } = setup();

    await act(() => result.current.submitDetails(DETAILS));

    expect(result.current.step).toBe('details');
  });

  it('verifies the code, finalizes and redirects', async () => {
    const { result } = setup();
    await act(() => result.current.submitDetails(DETAILS));

    await act(() => result.current.submitCode('123456'));

    expect(signUp.verifications.verifyEmailCode).toHaveBeenCalledWith({
      code: '123456',
    });
    expect(signUp.finalize).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledWith('/next');
  });

  it('does not finalize on a wrong code', async () => {
    signUp.verifications.verifyEmailCode.mockImplementation(() =>
      fail('Incorrect code'),
    );
    const { result } = setup();
    await act(() => result.current.submitDetails(DETAILS));

    await act(() => result.current.submitCode('000000'));

    expect(signUp.finalize).not.toHaveBeenCalled();
    expect(push).not.toHaveBeenCalled();
    expect(result.current.step).toBe('verify');
  });

  it('explains what is still missing after verification', async () => {
    signUp.verifications.verifyEmailCode.mockImplementation(() => {
      signUp.missingFields = ['first_name'];
      return ok();
    });
    const { result } = setup();
    await act(() => result.current.submitDetails(DETAILS));
    signUp.missingFields = ['first_name'];

    await act(() => result.current.submitCode('123456'));

    expect(result.current.blocked).toBe(
      'Your email is verified, but this account still needs first name.',
    );
    expect(signUp.finalize).not.toHaveBeenCalled();
  });

  it('reports an incomplete account with nothing missing', async () => {
    signUp.verifications.verifyEmailCode.mockImplementation(ok);
    const { result } = setup();
    await act(() => result.current.submitDetails(DETAILS));

    await act(() => result.current.submitCode('123456'));

    expect(result.current.blocked).toBe(
      'Your email is verified, but the account could not be completed.',
    );
    expect(push).not.toHaveBeenCalled();
  });

  it('does not redirect if finalizing fails', async () => {
    signUp.finalize.mockImplementation(() => fail('Session error'));
    const { result } = setup();
    await act(() => result.current.submitDetails(DETAILS));

    await act(() => result.current.submitCode('123456'));

    expect(push).not.toHaveBeenCalled();
  });

  it('clears a previous block on resubmit', async () => {
    signUp.missingFields = ['phone_number'];
    const { result } = setup();
    await act(() => result.current.submitDetails(DETAILS));
    expect(result.current.blocked).not.toBe('');

    signUp.missingFields = [];
    await act(() => result.current.submitDetails(DETAILS));
    expect(result.current.blocked).toBe('');
    expect(result.current.step).toBe('verify');
  });
});

describe('<SignUpForm />', () => {
  it('walks through details → verify → redirect', async () => {
    const user = userEvent.setup();
    render(<SignUpForm />);

    await user.type(screen.getByLabelText('Email'), DETAILS.email);
    await user.type(screen.getByLabelText('Password'), DETAILS.password);
    await user.click(screen.getByRole('button', { name: 'Create account' }));

    expect(
      await screen.findByText(`Enter the code we sent to ${DETAILS.email}.`),
    ).toBeInTheDocument();

    const code = screen.getByLabelText('Verification code');
    expect(code).toHaveFocus();
    await user.type(code, '12-34 56');
    expect(code).toHaveValue('123456');

    await user.click(screen.getByRole('button', { name: 'Verify' }));

    expect(signUp.verifications.verifyEmailCode).toHaveBeenCalledWith({
      code: '123456',
    });
    expect(push).toHaveBeenCalledWith('/');
  });

  it('collects a username on its own step when Clerk asks', async () => {
    signUp.missingFields = ['username'];
    signUp.update.mockImplementation(() => {
      signUp.missingFields = [];
      return ok();
    });
    const user = userEvent.setup();
    render(<SignUpForm />);

    await user.type(screen.getByLabelText('Email'), DETAILS.email);
    await user.type(screen.getByLabelText('Password'), DETAILS.password);
    await user.click(screen.getByRole('button', { name: 'Create account' }));

    const username = await screen.findByLabelText('Username');
    expect(username).toHaveFocus();
    await user.type(username, 'fan');
    await user.click(screen.getByRole('button', { name: 'Continue' }));

    expect(signUp.update).toHaveBeenCalledWith({ username: 'fan' });
    expect(
      await screen.findByLabelText('Verification code'),
    ).toBeInTheDocument();
  });

  it('renders extra required fields up front and submits them', async () => {
    const user = userEvent.setup();
    render(
      <SignUpForm
        requiredFields={['username', 'first_name', 'last_name', 'phone_number']}
      />,
    );

    // phone_number isn't collectable here, so it isn't rendered.
    expect(screen.queryByLabelText('Phone Number')).toBeNull();

    await user.type(screen.getByLabelText('Email'), DETAILS.email);
    await user.type(screen.getByLabelText('Username'), 'fan');
    await user.type(screen.getByLabelText('First Name'), 'Ada');
    await user.type(screen.getByLabelText('Last Name'), 'Lovelace');
    await user.type(screen.getByLabelText('Password'), DETAILS.password);
    await user.click(screen.getByRole('button', { name: 'Create account' }));

    expect(signUp.password).toHaveBeenCalledWith({
      emailAddress: DETAILS.email,
      password: DETAILS.password,
      username: 'fan',
      firstName: 'Ada',
      lastName: 'Lovelace',
    });
  });

  it('shows field, captcha and global errors', () => {
    errors.fields.emailAddress = { message: 'That email is taken' };
    errors.fields.captcha = { message: 'Captcha failed' };
    errors.global = [{ code: 'x', message: 'Something went wrong' }];
    render(<SignUpForm />);

    const alerts = screen.getAllByRole('alert').map((a) => a.textContent);
    expect(alerts).toEqual(
      expect.arrayContaining([
        'That email is taken',
        'Captcha failed',
        'Something went wrong',
      ]),
    );
  });

  it('shows a blocking message for uncollectable requirements', async () => {
    signUp.missingFields = ['phone_number'];
    const user = userEvent.setup();
    render(<SignUpForm />);

    await user.click(screen.getByRole('button', { name: 'Create account' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Accounts on this site also require phone number',
    );
  });

  it('disables the form while creating', () => {
    fetchStatus = 'fetching';
    render(<SignUpForm />);
    expect(screen.getByRole('button', { name: 'Creating…' })).toBeDisabled();
    expect(screen.getByLabelText('Email')).toBeDisabled();
  });

  it('renders the captcha mount point Clerk needs', () => {
    const { container } = render(<SignUpForm />);
    expect(container.querySelector('#clerk-captcha')).not.toBeNull();
  });
});
