import SubmitButton from '@/components/auth/submit-button';
import UsernameField from '@/components/auth/username-field';
import type { SignUpUsernameFormProps } from '@/lib/types/sign-up-username-form.props';
import { readField } from '@/lib/utils/read-field';

/** The step Clerk asks for when it needs a username after the details. */
export default function SignUpUsernameForm({
  errors,
  isSubmitting,
  feedback,
  onSubmit,
}: SignUpUsernameFormProps) {
  return (
    <form
      className='auth-form'
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(readField(e.currentTarget, 'username') ?? '');
      }}
      noValidate
    >
      <p className='auth-hint'>Pick a username to finish your account.</p>
      <UsernameField
        error={errors.fields.username ?? null}
        disabled={isSubmitting}
        autoFocus
      />
      {feedback}
      <SubmitButton pending={isSubmitting} pendingLabel='Saving…'>
        Continue
      </SubmitButton>
    </form>
  );
}
