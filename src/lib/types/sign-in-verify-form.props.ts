import type { SignInStepProps } from '@/lib/types/sign-in-step.props';

export interface SignInVerifyFormProps extends SignInStepProps {
  /** Where the code was sent, so the hint can name it. */
  email: string;
  onSubmit: (code: string) => void;
}
