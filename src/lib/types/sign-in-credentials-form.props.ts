import type { SignInCredentials } from '@/lib/types/sign-in-credentials';
import type { SignInStepProps } from '@/lib/types/sign-in-step.props';

export interface SignInCredentialsFormProps extends SignInStepProps {
  onSubmit: (credentials: SignInCredentials) => void;
}
