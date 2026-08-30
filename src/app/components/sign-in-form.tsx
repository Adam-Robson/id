'use client';

import { useSignIn } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import '@/app/components/auth-form.css';

export default function SignInForm() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter();
  const isSubmitting = fetchStatus === 'fetching';

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const emailAddress = (form.elements.namedItem('email') as HTMLInputElement)
      .value;
    const password = (form.elements.namedItem('password') as HTMLInputElement)
      .value;

    const { error } = await signIn.password({ emailAddress, password });
    if (error) return;

    const { error: finalizeError } = await signIn.finalize();
    if (finalizeError) return;

    router.push('/');
  }

  return (
    <form className='auth-form' onSubmit={handleSubmit} noValidate>
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
        {errors.fields.identifier && (
          <p className='auth-feedback auth-feedback--error'>
            {errors.fields.identifier.message}
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
          autoComplete='current-password'
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
        {isSubmitting ? 'Signing in…' : 'Sign in'}
      </button>

      <p className='auth-switch'>
        No account? <a href='/sign-up'>Create one</a>
      </p>
    </form>
  );
}
