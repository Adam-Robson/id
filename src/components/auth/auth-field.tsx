
import FormFeedback from './form-feedback';
/**
 * A reusable input field component for authentication
 * forms that includes a label and error feedback.
 * @param param0
 * @returns
 */
export default function AuthField({ id, label, error, ...input }: {
  id: string;
  label: string;
  error?: { message: string } | null;
} & React.InputHTMLAttributes<HTMLInputElement>
) {
  return (
    <div className='auth-field'>
      <label htmlFor={id} className='auth-label'>
        {label}
      </label>
      <input
        className='auth-input'
        id={id}
        {...input}
      />
      <FormFeedback message={error?.message} />
    </div>
  );
}

