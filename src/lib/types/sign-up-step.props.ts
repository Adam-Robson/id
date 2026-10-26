import type { SignUpErrors } from '@clerk/nextjs/types';
import type { ReactNode } from 'react';

/** What every sign-up step form needs, whichever step it is. */
export interface SignUpStepProps {
  errors: SignUpErrors;
  isSubmitting: boolean;
  /** Blocking and global messages, shown above the submit button. */
  feedback: ReactNode;
}
