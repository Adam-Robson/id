import AuthField from '@/components/auth/auth-field';
import type { UsernameFieldProps } from '@/lib/types/username-field.props';

/**
 * The username input, shared by the details form (when the Clerk instance
 * requires one up front) and the username step (when Clerk asks afterwards).
 */
export default function UsernameField({
  error,
  disabled,
  autoFocus = false,
}: UsernameFieldProps) {
  return (
    <AuthField
      id='username'
      label='Username'
      name='username'
      type='text'
      autoComplete='username'
      required
      error={error}
      autoFocus={autoFocus}
      disabled={disabled}
    />
  );
}
