import Link from 'next/link';
import AuthField from '@/components/auth/auth-field';
import FormFeedback from '@/components/auth/form-feedback';
import SubmitButton from '@/components/auth/submit-button';
import UsernameField from '@/components/auth/username-field';
import { FIELD_LABELS } from '@/lib/constants/field-labels';
import type { SignUpDetailsFormProps } from '@/lib/types/sign-up-details-form.props';
import { readField } from '@/lib/utils/read-field';

/** The first sign-up step: email, password and any extra required fields. */
export default function SignUpDetailsForm({
  extraFields,
  errors,
  isSubmitting,
  feedback,
  onSubmit,
}: SignUpDetailsFormProps) {
  return (
    <form
      className='auth-form'
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.currentTarget;
        onSubmit({
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

      {extraFields.includes('username') && (
        <UsernameField
          error={errors.fields.username ?? null}
          disabled={isSubmitting}
        />
      )}

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
        Already have an account? <Link href='/sign-in'>Sign in</Link>
      </p>
    </form>
  );
}
