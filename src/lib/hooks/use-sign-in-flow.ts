import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSignIn } from '@clerk/nextjs';
/**
 * Custom hook to manage the sign-in flow.
 */
export default function useSignInFlow({ redirectTo = '/' }: { redirectTo?: string }) {
  const [blocked, setBlocked] = useState('');
  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter();
  const isSubmitting = fetchStatus === 'fetching';

  async function submit({ emailAddress, password }: { emailAddress: string, password: string }) {

    const { error } = await signIn.password({ emailAddress, password });
    if (error) {
      setBlocked(error.message);
      return;
    };

    const { error: finalizeError } = await signIn.finalize();
    if (finalizeError) {
      setBlocked(finalizeError.message);
      return;
    };

    router.push(redirectTo);
  }

  return {
    submit,
    isSubmitting,
    errors,
    blocked,
  };

}
