'use client';
import FormFeedback from '@/components/auth/form-feedback';
import SignUpDetailsForm from '@/components/auth/sign-up-details-form';
import SignUpUsernameForm from '@/components/auth/sign-up-username-form';
import SignUpVerifyForm from '@/components/auth/sign-up-verify-form';
import useSignUpFlow from '@/lib/hooks/use-sign-up-flow';
import { isCollectable } from '@/lib/utils/is-collectable';

/**
 * Picks the form for the current sign-up step. Each step is its own
 * component, so React mounts a fresh form when the step changes instead of
 * reusing one step's inputs for the next.
 */
export default function SignUpForm({
  requiredFields = [],
}: {
  /** Required beyond email and password, per Clerk instance's settings. */
  requiredFields?: string[];
}) {
  const {
    step,
    email,
    blocked,
    errors,
    isSubmitting,
    submitDetails,
    submitUsername,
    submitCode,
  } = useSignUpFlow({ redirectTo: '/' });

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
    return <SignUpVerifyForm {...shared} email={email} onSubmit={submitCode} />;
  }

  if (step === 'username') {
    return <SignUpUsernameForm {...shared} onSubmit={submitUsername} />;
  }

  return (
    <SignUpDetailsForm
      {...shared}
      extraFields={requiredFields.filter(isCollectable)}
      onSubmit={submitDetails}
    />
  );
}
