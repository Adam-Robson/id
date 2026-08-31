type Attribute = { enabled?: boolean; required?: boolean };

/** Supplied by the first step of the form, so never "extra". */
const ALWAYS_COLLECTED = new Set(['email_address', 'password']);

/**
 * The instance's Frontend API origin, encoded in the publishable key as
 * `pk_(test|live)_<base64 of "host$">`.
 */
function frontendApiUrl(): string | null {
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (!key) return null;

  const encoded = key.slice(key.indexOf('_', key.indexOf('_') + 1) + 1);
  try {
    const host = Buffer.from(encoded, 'base64')
      .toString('utf8')
      .replace(/\$+$/, '');
    return host ? `https://${host}` : null;
  } catch {
    return null;
  }
}

/**
 * Which sign-up fields this Clerk instance requires beyond email and
 * password, read from the instance's public environment document.
 *
 * Required attributes are dashboard configuration, and a sign-up that is
 * missing one never gets a session — it fails at the very last step with
 * "Cannot finalize sign-up without a created session". Reading the list
 * keeps the form in step with the dashboard rather than hardcoding a guess
 * that strands people after they have already verified their email.
 *
 * Falls back to an empty list: the form still recovers at runtime from
 * whatever the sign-up reports as missing.
 */
export async function requiredSignUpFields(): Promise<string[]> {
  const base = frontendApiUrl();
  if (!base) return [];

  try {
    const res = await fetch(
      `${base}/v1/environment?__clerk_api_version=2025-04-10&_clerk_js_version=5.0.0`,
      // Instance settings change about as often as someone edits the
      // dashboard, so an hour-old answer is fine and keeps this off the
      // critical path of every sign-up page render.
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return [];

    const data: unknown = await res.json();
    const attributes =
      (data as { user_settings?: { attributes?: Record<string, Attribute> } })
        ?.user_settings?.attributes ?? {};

    return Object.entries(attributes)
      .filter(
        ([name, attribute]) =>
          attribute?.enabled &&
          attribute?.required &&
          !ALWAYS_COLLECTED.has(name),
      )
      .map(([name]) => name);
  } catch (error) {
    console.error('Could not read Clerk sign-up requirements', error);
    return [];
  }
}
