'use client';
import Link from 'next/link';
import { useState } from 'react';
import AuthField from '@/components/auth/auth-field';
import FormFeedback from '@/components/auth/form-feedback';
import SubmitButton from '@/components/auth/submit-button';
import { FIELD_LABELS } from '@/lib/constants/field-labels';
import useSignUpFlow from '@/lib/hooks/use-sign-up-flow';
import { isCollectable } from '@/lib/utils/is-collectable';
import { readField } from '@/lib/utils/read-field';
import '@/components/styles/auth-form.css';

export default function SignUpForm({
  requiredFields = [],
}: {
  /** Required beyond email and password, per Clerk instance's settings. */
  requiredFields?: string[];
}) {
  const {
    step,
    email,
    blocked,
    errors,
    isSubmitting,
    submitDetails,
    submitUsername,
    submitCode,
  } = useSignUpFlow({ redirectTo: '/' });
  const [code, setCode] = useState('');
  const extraFields = requiredFields.filter(isCollectable);

  const feedback = (
    <>
      <FormFeedback message={blocked} />
      {errors.global?.map((err) => (
        <FormFeedback key={err.code} message={err.longMessage ?? err.message} />
      ))}
    </>
  );

  const usernameField = (autoFocus: boolean) => (
    <AuthField
      id='username'
      label='Username'
      error={errors.fields.username ?? null}
      autoFocus={autoFocus}
      disabled={isSubmitting}
    />
  );

  if (step === 'verify') {
    return (
      <form
        className='auth-form'
        onSubmit={(e) => {
          e.preventDefault();
          submitCode(code);
        }}
        autoComplete='off'
        noValidate
      >
        <p className='auth-hint'>Enter the code we sent to {email}.</p>
        <AuthField
          id='code'
          name='code'
          type='text'
          inputMode='numeric'
          autoComplete='one-time-code'
          data-1p-ignore='true'
          data-lpignore='true'
          data-bwignore='true'
          data-form-type='other'
          required
          disabled={isSubmitting}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
          label='Verification code'
          error={errors.fields.code ?? null}
          autoFocus={true}
        />

        {feedback}

        <SubmitButton pending={isSubmitting} pendingLabel='Verifying…'>
          Verify
        </SubmitButton>
      </form>
    );
  }

  if (step === 'username') {
    return (
      <form
        className='auth-form'
        onSubmit={(e) => {
          e.preventDefault();
          submitUsername(
            (document.getElementById('username') as HTMLInputElement).value,
          );
        }}
        noValidate
      >
        <p className='auth-hint'>Pick a username to finish your account.</p>
        {usernameField(true)}
        {feedback}
        <SubmitButton pending={isSubmitting} pendingLabel='Saving…'>
          Continue
        </SubmitButton>
      </form>
    );
  }

  return (
    <form
      className='auth-form'
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.currentTarget;
        submitDetails({
          email: readField(form, 'email') ?? '',
          password: readField(form, 'password') ?? '',
          username: readField(form, 'username') ?? undefined,
          firstName: readField(form, 'first_name') ?? undefined,
          lastName: readField(form, 'last_name') ?? undefined,
        });
      }}
      noValidate
    >
      <AuthField
        id='email'
        label='Email'
        name='email'
        type='email'
        required
        autoComplete='email'
        error={errors.fields.emailAddress ?? null}
        disabled={isSubmitting}
      />

      {extraFields.includes('username') && usernameField(false)}

      {(
        [
          ['first_name', 'firstName'],
          ['last_name', 'lastName'],
        ] as const
      )
        .filter(([field]) => extraFields.includes(field))
        .map(([field, errorKey]) => (
          <AuthField
            key={field}
            id={field}
            name={field}
            type='text'
            autoComplete={field === 'first_name' ? 'given-name' : 'family-name'}
            required
            disabled={isSubmitting}
            label={FIELD_LABELS[field]}
            error={errors.fields[errorKey] ?? null}
          />
        ))}

      <AuthField
        id='password'
        label='Password'
        name='password'
        type='password'
        required
        autoComplete='new-password'
        minLength={8}
        error={errors.fields.password ?? null}
        disabled={isSubmitting}
      />

      <div id='clerk-captcha' />
      <FormFeedback message={errors.fields.captcha?.message ?? null} />

      {feedback}

      <SubmitButton pending={isSubmitting} pendingLabel='Creating…'>
        Create account
      </SubmitButton>
      <p className='auth-legal'>
        By creating an account you agree to our{' '}
        <Link href='/privacy'>privacy policy</Link>.
      </p>
      <p className='auth-switch'>
        Already have an account? <a href='/sign-in'>Sign in</a>
      </p>
    </form>
  );
}
