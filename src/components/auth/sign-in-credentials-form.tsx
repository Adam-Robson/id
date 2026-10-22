import Link from 'next/link';
import AuthField from '@/components/auth/auth-field';
import SubmitButton from '@/components/auth/submit-button';
import type { SignInCredentialsFormProps } from '@/lib/types/sign-in-credentials-form.props';
import { readField } from '@/lib/utils/read-field';

/** The first sign-in step: email and password. */
export default function SignInCredentialsForm({
  errors,
  isSubmitting,
  feedback,
  onSubmit,
}: SignInCredentialsFormProps) {
  return (
    <form
      className='auth-form'
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.currentTarget;
        onSubmit({
          emailAddress: readField(form, 'email') ?? '',
          password: readField(form, 'password') ?? '',
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
