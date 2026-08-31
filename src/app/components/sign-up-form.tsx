'use client';

import { useSignUp } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import '@/app/components/auth-form.css';

/** Extra required fields this form knows how to ask for. */
const COLLECTABLE = ['username', 'first_name', 'last_name'] as const;
type Collectable = (typeof COLLECTABLE)[number];

const FIELD_LABELS: Record<string, string> = {
  username: 'Username',
  first_name: 'First name',
  last_name: 'Last name',
  phone_number: 'a phone number',
  legal_accepted: 'accepting the terms',
};

const describe = (fields: readonly string[]) =>
  fields
    .map((f) => (FIELD_LABELS[f] ?? f.replace(/_/g, ' ')).toLowerCase())
    .join(', ');

const isCollectable = (field: string): field is Collectable =>
  (COLLECTABLE as readonly string[]).includes(field);

export default function SignUpForm({
  requiredFields = [],
}: {
  /** Required beyond email and password, per the Clerk instance's settings. */
  requiredFields?: string[];
}) {
  const { signUp, errors, fetchStatus } = useSignUp();
  const router = useRouter();
  const [step, setStep] = useState<'details' | 'username' | 'verify'>(
    'details',
  );
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [blocked, setBlocked] = useState('');
  const isSubmitting = fetchStatus === 'fetching';

  const extraFields = requiredFields.filter(isCollectable);

  /**
   * Carries the sign-up to the email-code step. The page already rendered
   * whatever the instance requires, so this normally just sends the code —
   * but it re-reads `missingFields` off the live sign-up so a requirement
   * added since the page was cached still gets collected rather than
   * failing at finalize.
   */
  async function advance() {
    const missing = signUp.missingFields as readonly string[];

    if (missing.includes('username')) {
      setStep('username');
      return;
    }

    if (missing.length > 0) {
      setBlocked(
        `Accounts on this site also require ${describe(missing)}, which this form doesn't collect yet.`,
      );
      return;
    }

    const { error } = await signUp.verifications.sendEmailCode();
    if (error) return;

    setStep('verify');
  }

  async function handleDetailsSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBlocked('');

    const form = e.currentTarget;
    const value = (name: string) =>
      (form.elements.namedItem(name) as HTMLInputElement | null)?.value;

    const emailAddress = value('email') ?? '';
    const password = value('password') ?? '';
    const username = value('username');
    const firstName = value('first_name');
    const lastName = value('last_name');

    const { error } = await signUp.password({
      emailAddress,
      password,
      ...(username ? { username } : {}),
      ...(firstName ? { firstName } : {}),
      ...(lastName ? { lastName } : {}),
    });
    if (error) return;

    setEmail(emailAddress);
    await advance();
  }

  async function handleUsernameSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBlocked('');

    const form = e.currentTarget;
    const username = (form.elements.namedItem('username') as HTMLInputElement)
      .value;

    const { error } = await signUp.update({ username });
    if (error) return;

    await advance();
  }

  async function handleVerifySubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBlocked('');

    const { error } = await signUp.verifications.verifyEmailCode({ code });
    if (error) return;

    // Only a completed sign-up has a session to activate. Calling finalize()
    // before then throws "Cannot finalize sign-up without a created session",
    // which is what an unmet instance requirement looks like from here.
    if (signUp.status !== 'complete') {
      const missing = signUp.missingFields as readonly string[];
      setBlocked(
        missing.length > 0
          ? `Your email is verified, but this account still needs ${describe(missing)}.`
          : 'Your email is verified, but the account could not be completed.',
      );
      return;
    }

    const { error: finalizeError } = await signUp.finalize();
    if (finalizeError) return;

    router.push('/');
  }

  const feedback = (
    <>
      {blocked && (
        <p className='auth-feedback auth-feedback--error'>{blocked}</p>
      )}
      {errors.global?.map((err) => (
        <p key={err.code} className='auth-feedback auth-feedback--error'>
          {err.longMessage ?? err.message}
        </p>
      ))}
    </>
  );

  const usernameField = (autoFocus: boolean) => (
    <div className='auth-field'>
      <label className='auth-label' htmlFor='username'>
        Username
      </label>
      <input
        className='auth-input'
        id='username'
        name='username'
        type='text'
        autoComplete='username'
        required
        disabled={isSubmitting}
        // biome-ignore lint/a11y/noAutofocus: sole field on its own step
        autoFocus={autoFocus}
      />
      {errors.fields.username && (
        <p className='auth-feedback auth-feedback--error'>
          {errors.fields.username.message}
        </p>
      )}
    </div>
  );

  if (step === 'verify') {
    return (
      <form
        className='auth-form'
        onSubmit={handleVerifySubmit}
        autoComplete='off'
        noValidate
      >
        <p className='auth-hint'>Enter the code we sent to {email}.</p>

        <div className='auth-field'>
          <label className='auth-label' htmlFor='code'>
            Verification code
          </label>
          <input
            className='auth-input'
            id='code'
            name='code'
            type='text'
            inputMode='numeric'
            autoComplete='one-time-code'
            // Password managers (browser extensions especially) sometimes
            // offer to fill their stored password into the next text input
            // after a real password field, ignoring `autoComplete`. These
            // are the vendor-documented opt-outs.
            data-1p-ignore='true'
            data-lpignore='true'
            data-bwignore='true'
            data-form-type='other'
            required
            disabled={isSubmitting}
            value={code}
            // Belt-and-suspenders: a code is digits only, so anything else
            // that lands here (an auto-filled password, a pasted string)
            // gets stripped rather than silently sitting in the field.
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
          />
          {errors.fields.code && (
            <p className='auth-feedback auth-feedback--error'>
              {errors.fields.code.message}
            </p>
          )}
        </div>

        {feedback}

        <button className='auth-submit' type='submit' disabled={isSubmitting}>
          {isSubmitting ? 'Verifying…' : 'Verify'}
        </button>
      </form>
    );
  }

  if (step === 'username') {
    return (
      <form className='auth-form' onSubmit={handleUsernameSubmit} noValidate>
        <p className='auth-hint'>Pick a username to finish your account.</p>
        {usernameField(true)}
        {feedback}
        <button className='auth-submit' type='submit' disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : 'Continue'}
        </button>
      </form>
    );
  }

  return (
    <form className='auth-form' onSubmit={handleDetailsSubmit} noValidate>
      <div className='auth-field'>
        <label className='auth-label' htmlFor='email'>
          Email
        </label>
        <input
          className='auth-input'
          id='email'
          name='email'
          type='email'
          autoComplete='email'
          required
          disabled={isSubmitting}
        />
        {errors.fields.emailAddress && (
          <p className='auth-feedback auth-feedback--error'>
            {errors.fields.emailAddress.message}
          </p>
        )}
      </div>

      {extraFields.includes('username') && usernameField(false)}

      {(['first_name', 'last_name'] as const)
        .filter((field) => extraFields.includes(field))
        .map((field) => (
          <div className='auth-field' key={field}>
            <label className='auth-label' htmlFor={field}>
              {FIELD_LABELS[field]}
            </label>
            <input
              className='auth-input'
              id={field}
              name={field}
              type='text'
              autoComplete={
                field === 'first_name' ? 'given-name' : 'family-name'
              }
              required
              disabled={isSubmitting}
            />
          </div>
        ))}

      <div className='auth-field'>
        <label className='auth-label' htmlFor='password'>
          Password
        </label>
        <input
          className='auth-input'
          id='password'
          name='password'
          type='password'
          autoComplete='new-password'
          required
          disabled={isSubmitting}
        />
        {errors.fields.password && (
          <p className='auth-feedback auth-feedback--error'>
            {errors.fields.password.message}
          </p>
        )}
      </div>

      {/* Clerk mounts its bot-protection widget here when the instance has
          CAPTCHA enabled. Custom flows must provide this node themselves —
          without it the widget can't render and sign-ups fail invisibly. */}
      <div id='clerk-captcha' />
      {errors.fields.captcha && (
        <p className='auth-feedback auth-feedback--error'>
          {errors.fields.captcha.message}
        </p>
      )}

      {feedback}

      <button className='auth-submit' type='submit' disabled={isSubmitting}>
        {isSubmitting ? 'Creating…' : 'Create account'}
      </button>

      <p className='auth-switch'>
        Already have an account? <a href='/sign-in'>Sign in</a>
      </p>
    </form>
  );
}
