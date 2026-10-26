import type { SignUpStepProps } from '@/lib/types/sign-up-step.props';

export interface SignUpVerifyFormProps extends SignUpStepProps {
  /** Where the code was sent, so the hint can name it. */
  email: string;
  onSubmit: (code: string) => void;
}
