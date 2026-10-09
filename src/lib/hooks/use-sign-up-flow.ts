import { useState } from 'react';
import { useSignUp } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { describe } from '@/lib/utils/describe';
import type { SignUpStep } from '@/lib/types/sign-up-step';
/**
 * Custom hook to manage the sign-up flow with Clerk.
 * Manages the different steps of the sign-up process, including collecting user details,
 * handling username selection, and verifying the email code.
 * Provides handlers and state for each step of the sign-up flow.
 */
export default function useSignUpFlow({ redirectTo = '/'}: { redirectTo?: string }) {
  const [step, setStep] = useState<SignUpStep>(
      'details',
    );
  const [email, setEmail] = useState('');
  const [blocked, setBlocked] = useState('');
  const { signUp, errors, fetchStatus } = useSignUp();
  const isSubmitting = fetchStatus === 'fetching';
  const router = useRouter();
  /**
   * Re-reads the missing fields from the live sign-up instance.
   */
  async function advance() {
    const missing = signUp.missingFields as readonly string[];

    if (missing.includes('username')) {
      setStep('username');
      return;
    }

    if (missing.length > 0) {
      setBlocked(`Accounts on this site also require ${describe(missing)}`);
      return;
    }

    const { error } = await signUp.verifications.sendEmailCode();
    if (error) return;

    setStep('verify');
  }

  async function submitDetails(details: {
    email: string;
    password: string;
    username?: string;
    firstName?: string;
    lastName?: string;
  }) {
    setBlocked('');

    const emailAddress = details.email;
    const password = details.password;
    const username = details.username;
    const firstName = details.firstName;
    const lastName = details.lastName;

    const { error } = await signUp.password({
      emailAddress,
      password,
      ...(username ? { username } : {}),
      ...(firstName ? { firstName } : {}),
      ...(lastName ? { lastName } : {}),
    });
    if (error) return;

    setEmail(emailAddress);
    await advance();
  }

  async function submitUsername(username: string) {
    setBlocked('');

    const { error } = await signUp.update({ username });
    if (error) return;

    await advance();
  }

  async function submitCode(code: string) {
    setBlocked('');

    const { error } = await signUp.verifications.verifyEmailCode({ code });
    if (error) return;

    if (signUp.status !== 'complete') {
      const missing = signUp.missingFields as readonly string[];
      setBlocked(
        missing.length > 0
          ? `Your email is verified, but this account still needs ${describe(missing)}.`
          : 'Your email is verified, but the account could not be completed.',
      );
      return;
    }

    const { error: finalizeError } = await signUp.finalize();
    if (finalizeError) return;

    router.push(redirectTo);
  }

      return { step, email, blocked, errors, isSubmitting, submitDetails, submitUsername: submitUsername, submitCode };


}
