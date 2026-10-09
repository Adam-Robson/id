'use client';
import Link from 'next/link'
import AuthInput from '@/components/auth/auth-field';
import AuthField from '@/components/auth/auth-field';
import FormFeedback from '@/components/auth/form-feedback';
import SubmitButton from '@/components/auth/submit-button';
import useSignInFlow from '@/lib/hooks/use-sign-in-flow';
import { readField } from '@/lib/utils/read-field';

export default function SignInForm() {

  const { blocked, errors, submit, isSubmitting } = useSignInFlow({ redirectTo: '/' });

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
          emailAddress: String(email ?? ''), password: String(password ?? ''),
        });
      }}
      noValidate
    >
      <AuthInput
        id='email'
        label='Email'
        name='email'
        type='email'
        error={errors.fields.identifier ?? null}
        className='auth-input'
        autoComplete='email'
        required
        disabled={isSubmitting}
      />
      <FormFeedback message={errors.fields.identifier?.message} />

      <AuthField
        id='password'
        label='Password'
        name='password'
        type='password'
        autoComplete='current-password'
        error={errors.fields.password ?? null}
        className='auth-input'
        required
        disabled={isSubmitting}
      />
      <FormFeedback message={errors.fields.password?.message} />

      {feedback}

      <SubmitButton
        pending={isSubmitting}
        pendingLabel='Signing in…'
      >
        Sign in
      </SubmitButton>

      <p className='auth-switch'>
        No account? <Link href='/sign-up'>Create one</Link>
      </p>
    </form>
  );
}
