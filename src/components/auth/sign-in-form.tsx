'use client';
import FormFeedback from '@/components/auth/form-feedback';
import SignInCredentialsForm from '@/components/auth/sign-in-credentials-form';
import SignInVerifyForm from '@/components/auth/sign-in-verify-form';
import useSignInFlow from '@/lib/hooks/use-sign-in-flow';

/**
 * Picks the form for the current sign-in step. Each step is its own
 * component, so React mounts a fresh form when the step changes instead of
 * reusing one step's inputs for the next.
 */
export default function SignInForm() {
  const { step, email, blocked, errors, isSubmitting, submit, submitCode } =
    useSignInFlow({ redirectTo: '/' });

  const feedback = (
    <>
      <FormFeedback message={blocked} />
      {errors.global?.map((err) => (
        <FormFeedback key={err.code} message={err.longMessage ?? err.message} />
      ))}
    </>
  );
  const shared = { errors, isSubmitting, feedback };

  if (step === 'verify') {
    return <SignInVerifyForm {...shared} email={email} onSubmit={submitCode} />;
  }

  return <SignInCredentialsForm {...shared} onSubmit={submit} />;
}
