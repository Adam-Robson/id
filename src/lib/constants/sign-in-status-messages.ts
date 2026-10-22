/**
 * Why a sign-in stopped short of a session, for the statuses this site
 * cannot carry the user through itself.
 */
export const SIGN_IN_STATUS_MESSAGES: Record<string, string> = {
  needs_new_password:
    'This account needs a new password before it can sign in.',
  needs_second_factor:
    'This account uses a second factor this site cannot verify yet.',
  needs_client_trust:
    'This device needs verifying, but no email code is available for it.',
};
