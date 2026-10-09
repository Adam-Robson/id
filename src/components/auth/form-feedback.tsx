export default function FormFeedback({
  id,
  message,
  error = true,
}: {
  id?: string;
  /** Nothing renders when empty, so callers don't need their own guard. */
  message?: string | null;
  error?: boolean;
}) {
  if (!message) return null;

  return (
    <p
      id={id}
      className={error ? 'auth-feedback auth-feedback--error' : 'auth-feedback'}
      // Errors appear after a submit, so announce them to screen readers.
      role={error ? 'alert' : undefined}
    >
      {message}
    </p>
  );
}
