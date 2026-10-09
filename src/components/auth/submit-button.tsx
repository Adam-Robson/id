export default function SubmitButton({
  pending,
  pendingLabel = 'Submitting…',
  children,
}: {
  pending: boolean;
  pendingLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <button className='auth-submit' type='submit' disabled={pending}>
      {pending ? pendingLabel : children}
    </button>
  );
}
