import type { SignInErrors } from '@clerk/nextjs/types';
import type { ReactNode } from 'react';

/** What every sign-in step form needs, whichever step it is. */
export interface SignInStepProps {
  errors: SignInErrors;
  isSubmitting: boolean;
  /** Blocking and global messages, shown above the submit button. */
  feedback: ReactNode;
}
