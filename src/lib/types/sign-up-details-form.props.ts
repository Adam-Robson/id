import type { SignUpDetails } from '@/lib/types/sign-up-details';
import type { SignUpStepProps } from '@/lib/types/sign-up-step.props';

export interface SignUpDetailsFormProps extends SignUpStepProps {
  /** Collectable fields Clerk requires beyond email and password. */
  extraFields: string[];
  onSubmit: (details: SignUpDetails) => void;
}
