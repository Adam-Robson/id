'use client';
import Link from 'next/link';
import AuthField from '@/components/auth/auth-field';
import FormFeedback from '@/components/auth/form-feedback';
import SubmitButton from '@/components/auth/submit-button';
import useSignInFlow from '@/lib/hooks/use-sign-in-flow';
import { readField } from '@/lib/utils/read-field';

export default function SignInForm() {
  const { blocked, errors, submit, isSubmitting } = useSignInFlow({
    redirectTo: '/',
  });

  const feedback = (
    <>
      <FormFeedback message={blocked} />
      {errors.global?.map((err) => (
        <FormFeedback key={err.code} message={err.longMessage ?? err.message} />
      ))}
    </>
  );

  return (
    <form
      className='auth-form'
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const email = readField(form, 'email');
        const password = readField(form, 'password');

        submit({
          emailAddress: email ?? '',
          password: password ?? '',
        });
      }}
      noValidate
    >
      <AuthField
        id='email'
        label='Email'
        name='email'
        type='email'
        error={errors.fields.identifier ?? null}
        autoComplete='email'
        required
        disabled={isSubmitting}
      />

      <AuthField
        id='password'
        label='Password'
        name='password'
        type='password'
        autoComplete='current-password'
        error={errors.fields.password ?? null}
        required
        disabled={isSubmitting}
      />

      {feedback}

      <SubmitButton pending={isSubmitting} pendingLabel='Signing in…'>
        Sign in
      </SubmitButton>

      <p className='auth-switch'>
        No account? <Link href='/sign-up'>Create one for free</Link>
      </p>
    </form>
  );
}
