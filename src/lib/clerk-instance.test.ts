import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { requiredSignUpFields } = await import('@/lib/clerk-instance');

/** `pk_<env>_<base64 of "host$">`, the shape Clerk publishes. */
const publishableKey = (env: 'test' | 'live', host: string) =>
  `pk_${env}_${Buffer.from(`${host}$`).toString('base64')}`;

const attribute = (enabled: boolean, required: boolean) => ({
  enabled,
  required,
});

function mockEnvironment(attributes: Record<string, unknown>) {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ user_settings: { attributes } }),
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

describe('requiredSignUpFields', () => {
  beforeEach(() => {
    vi.stubEnv(
      'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
      publishableKey('live', 'clerk.lefog.xyz'),
    );
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('asks the instance named by the publishable key', async () => {
    const fetchMock = mockEnvironment({});
    await requiredSignUpFields();
    expect(fetchMock.mock.calls[0][0]).toContain(
      'https://clerk.lefog.xyz/v1/environment',
    );
  });

  it('reports a required attribute the sign-up form has to collect', async () => {
    mockEnvironment({
      email_address: attribute(true, true),
      password: attribute(true, true),
      username: attribute(true, true),
    });
    await expect(requiredSignUpFields()).resolves.toEqual(['username']);
  });

  it('ignores attributes that are enabled but optional', async () => {
    mockEnvironment({
      username: attribute(true, false),
      first_name: attribute(true, false),
    });
    await expect(requiredSignUpFields()).resolves.toEqual([]);
  });

  it('ignores a required attribute that is disabled', async () => {
    mockEnvironment({ username: attribute(false, true) });
    await expect(requiredSignUpFields()).resolves.toEqual([]);
  });

  it('omits the fields the first step always collects', async () => {
    mockEnvironment({
      email_address: attribute(true, true),
      password: attribute(true, true),
    });
    await expect(requiredSignUpFields()).resolves.toEqual([]);
  });

  it('reports every extra requirement, including ones it cannot render', async () => {
    mockEnvironment({
      username: attribute(true, true),
      phone_number: attribute(true, true),
    });
    await expect(requiredSignUpFields()).resolves.toEqual([
      'username',
      'phone_number',
    ]);
  });

  it('falls back to no extra fields when the instance cannot be reached', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
    vi.spyOn(console, 'error').mockImplementation(() => {});
    await expect(requiredSignUpFields()).resolves.toEqual([]);
  });

  it('falls back when the environment endpoint answers with an error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));
    await expect(requiredSignUpFields()).resolves.toEqual([]);
  });

  it('does not call out at all without a publishable key', async () => {
    vi.stubEnv('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY', '');
    const fetchMock = mockEnvironment({});
    await expect(requiredSignUpFields()).resolves.toEqual([]);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
