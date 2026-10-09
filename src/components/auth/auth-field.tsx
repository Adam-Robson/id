import FormFeedback from './form-feedback';
/**
 * A reusable input field component for authentication
 * forms that includes a label and error feedback.
 * @param param0
 * @returns
 */
export default function AuthField({
  id,
  label,
  error,
  ...input
}: {
  id: string;
  label: string;
  error?: { message: string } | null;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const errorId = `${id}-error`;

  return (
    <div className='auth-field'>
      <label htmlFor={id} className='auth-label'>
        {label}
      </label>
      <input
        {...input}
        className='auth-input'
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
      />
      <FormFeedback id={errorId} message={error?.message} />
    </div>
  );
}
