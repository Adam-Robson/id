import { useClerk, useUser } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { usePathname } from 'next/navigation';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import SignInPrompt from '@/components/auth/sign-in-prompt';
import UserMenu from '@/components/user-menu';
import { getAccessLevel } from '@/lib/auth/get-access-level';

const push = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
  usePathname: vi.fn(),
}));
vi.mock('@clerk/nextjs', () => ({ useUser: vi.fn(), useClerk: vi.fn() }));
vi.mock('@clerk/nextjs/server', () => ({ auth: vi.fn() }));

beforeEach(() => {
  push.mockReset();
});

describe('getAccessLevel', () => {
  const session = (value: unknown) =>
    vi.mocked(auth).mockResolvedValue(value as never);

  it('treats a signed-out visitor as a guest', async () => {
    session({ userId: null, sessionClaims: null });
    expect(await getAccessLevel()).toBe('guest');
  });

  it('treats a signed-in user as a member', async () => {
    session({ userId: 'user_1', sessionClaims: { metadata: {} } });
    expect(await getAccessLevel()).toBe('member');
  });

  it('treats a user without claims metadata as a member', async () => {
    session({ userId: 'user_1', sessionClaims: undefined });
    expect(await getAccessLevel()).toBe('member');
  });

  it('recognises admins from session claims', async () => {
    session({
      userId: 'user_1',
      sessionClaims: { metadata: { role: 'admin' } },
    });
    expect(await getAccessLevel()).toBe('admin');
  });

  it('ignores an admin role on a session with no user', async () => {
    session({ userId: null, sessionClaims: { metadata: { role: 'admin' } } });
    expect(await getAccessLevel()).toBe('guest');
  });
});

describe('<UserMenu />', () => {
  const signOut = vi.fn(async (cb?: () => void) => cb?.());

  const signedIn = (user: Record<string, unknown> = {}) =>
    vi.mocked(useUser).mockReturnValue({
      isLoaded: true,
      isSignedIn: true,
      user: {
        primaryEmailAddress: { emailAddress: 'fan@example.com' },
        fullName: 'Fan',
        imageUrl: '',
        ...user,
      },
    } as never);

  beforeEach(() => {
    signOut.mockClear();
    vi.mocked(useClerk).mockReturnValue({ signOut } as never);
  });

  it('renders nothing while Clerk loads', () => {
    vi.mocked(useUser).mockReturnValue({ isLoaded: false } as never);
    const { container } = render(<UserMenu />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing when signed out', () => {
    vi.mocked(useUser).mockReturnValue({
      isLoaded: true,
      isSignedIn: false,
    } as never);
    const { container } = render(<UserMenu />);
    expect(container).toBeEmptyDOMElement();
  });

  it('shows an initial when there is no avatar', () => {
    signedIn();
    render(<UserMenu />);
    expect(screen.getByText('F')).toBeInTheDocument();
  });

  it('opens with the account email and signs out to home', async () => {
    signedIn();
    const user = userEvent.setup();
    render(<UserMenu />);

    const trigger = screen.getByRole('button', { name: 'Account menu' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('fan@example.com')).toBeInTheDocument();

    await user.click(screen.getByRole('menuitem', { name: 'Sign out' }));

    expect(signOut).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledWith('/');
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('closes on Escape and on an outside click', async () => {
    signedIn();
    const user = userEvent.setup();
    render(<UserMenu />);
    const trigger = screen.getByRole('button', { name: 'Account menu' });

    await user.click(trigger);
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('menu')).toBeNull();

    await user.click(trigger);
    await user.click(document.body);
    expect(screen.queryByRole('menu')).toBeNull();
  });
});

describe('<SignInPrompt />', () => {
  it('invites signed-out visitors to sign up or in', () => {
    vi.mocked(usePathname).mockReturnValue('/albums');
    render(<SignInPrompt />);
    expect(screen.getByRole('link', { name: 'Sign up free' })).toHaveAttribute(
      'href',
      '/sign-up',
    );
    expect(screen.getByRole('link', { name: 'Sign in' })).toHaveAttribute(
      'href',
      '/sign-in',
    );
  });

  it.each(['/sign-in', '/sign-up', '/sign-in/factor-one'])(
    'stays out of the way on %s',
    (path) => {
      vi.mocked(usePathname).mockReturnValue(path);
      const { container } = render(<SignInPrompt />);
      expect(container).toBeEmptyDOMElement();
    },
  );
});
