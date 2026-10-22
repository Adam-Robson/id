import type { SignUpStepProps } from '@/lib/types/sign-up-step.props';

export interface SignUpUsernameFormProps extends SignUpStepProps {
  onSubmit: (username: string) => void;
}
