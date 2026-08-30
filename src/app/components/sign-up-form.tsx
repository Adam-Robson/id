'use client';

import { useSignUp } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import '@/app/components/auth-form.css';

export default function SignUpForm() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const router = useRouter();
  const [step, setStep] = useState<'details' | 'verify'>('details');
  const [email, setEmail] = useState('');
  const isSubmitting = fetchStatus === 'fetching';

  async function handleDetailsSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const emailAddress = (form.elements.namedItem('email') as HTMLInputElement)
      .value;
    const password = (form.elements.namedItem('password') as HTMLInputElement)
      .value;

    const { error } = await signUp.password({ emailAddress, password });
    if (error) return;

    const { error: sendError } = await signUp.verifications.sendEmailCode();
    if (sendError) return;

    setEmail(emailAddress);
    setStep('verify');
  }

  async function handleVerifySubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const code = (form.elements.namedItem('code') as HTMLInputElement).value;

    const { error } = await signUp.verifications.verifyEmailCode({ code });
    if (error) return;

    const { error: finalizeError } = await signUp.finalize();
    if (finalizeError) return;

    router.push('/');
  }

  if (step === 'verify') {
    return (
      <form className='auth-form' onSubmit={handleVerifySubmit} noValidate>
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
            required
            disabled={isSubmitting}
          />
          {errors.fields.code && (
            <p className='auth-feedback auth-feedback--error'>
              {errors.fields.code.message}
            </p>
          )}
        </div>

        {errors.global?.map((err) => (
          <p key={err.code} className='auth-feedback auth-feedback--error'>
            {err.longMessage ?? err.message}
          </p>
        ))}

        <button className='auth-submit' type='submit' disabled={isSubmitting}>
          {isSubmitting ? 'Verifying…' : 'Verify'}
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

      {errors.global?.map((err) => (
        <p key={err.code} className='auth-feedback auth-feedback--error'>
          {err.longMessage ?? err.message}
        </p>
      ))}

      <button className='auth-submit' type='submit' disabled={isSubmitting}>
        {isSubmitting ? 'Creating…' : 'Create account'}
      </button>

      <p className='auth-switch'>
        Already have an account? <a href='/sign-in'>Sign in</a>
      </p>
    </form>
  );
}
