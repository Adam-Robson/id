import { useSignIn } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { SIGN_IN_INCOMPLETE } from '@/lib/constants/sign-in-incomplete';
import { SIGN_IN_STATUS_MESSAGES } from '@/lib/constants/sign-in-status-messages';
import type { SignInCredentials } from '@/lib/types/sign-in-credentials';
import type { SignInStep } from '@/lib/types/sign-in-step';
/**
 * Custom hook to manage the sign-in flow with Clerk.
 * A correct password does not always finish a sign-in: Clerk can still ask
 * for an emailed code (a new device, or email MFA). Only a `complete`
 * sign-in has a session to finalize, so each step checks the status first.
 */
export default function useSignInFlow({
  redirectTo = '/',
}: {
  redirectTo?: string;
}) {
  const [step, setStep] = useState<SignInStep>('credentials');
  const [email, setEmail] = useState('');
  const [blocked, setBlocked] = useState('');
  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter();
  const isSubmitting = fetchStatus === 'fetching';
  /**
   * Re-reads the status from the live sign-in instance and moves to
   * whatever it needs next.
   */
  async function advance() {
    if (signIn.status === 'complete') {
      const { error } = await signIn.finalize();
      if (error) {
        setBlocked(error.message);
        return;
      }
      router.push(redirectTo);
      return;
    }

    const needsCode =
      signIn.status === 'needs_client_trust' ||
      signIn.status === 'needs_second_factor';
    const canEmailCode = signIn.supportedSecondFactors.some(
      (factor) => factor.strategy === 'email_code',
    );

    if (needsCode && canEmailCode) {
      const { error } = await signIn.mfa.sendEmailCode();
      if (error) {
        setBlocked(error.message);
        return;
      }
      setStep('verify');
      return;
    }

    setBlocked(SIGN_IN_STATUS_MESSAGES[signIn.status] ?? SIGN_IN_INCOMPLETE);
  }

  async function submit({ emailAddress, password }: SignInCredentials) {
    setBlocked('');

    const { error } = await signIn.password({ emailAddress, password });
    if (error) {
      setBlocked(error.message);
      return;
    }

    setEmail(emailAddress);
    await advance();
  }

  async function submitCode(code: string) {
    setBlocked('');

    const { error } = await signIn.mfa.verifyEmailCode({ code });
    if (error) return;

    await advance();
  }

  return {
    step,
    email,
    blocked,
    errors,
    isSubmitting,
    submit,
    submitCode,
  };
}
