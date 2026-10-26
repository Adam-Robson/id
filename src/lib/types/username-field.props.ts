import type { FieldError } from '@clerk/nextjs/types';

export interface UsernameFieldProps {
  error: FieldError | null;
  disabled: boolean;
  /** True on the username step, where it is the only field. */
  autoFocus?: boolean;
}
