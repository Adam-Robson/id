import { useState } from 'react';
import AuthField from '@/components/auth/auth-field';
import SubmitButton from '@/components/auth/submit-button';
import type { SignUpVerifyFormProps } from '@/lib/types/sign-up-verify-form.props';

/** The last sign-up step: the code Clerk emailed. */
export default function SignUpVerifyForm({
  email,
  errors,
  isSubmitting,
  feedback,
  onSubmit,
}: SignUpVerifyFormProps) {
  const [code, setCode] = useState('');

  return (
    <form
      className='auth-form'
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(code);
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
