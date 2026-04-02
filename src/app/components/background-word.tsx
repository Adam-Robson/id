import '@/app/components/background-word.css';

export default function BackgroundWord() {
  return (
    <div className="bg-word-container" aria-hidden="true">
      <span className="bg-word">LE FOG</span>
      <span className="bg-word bg-word--extra">LE FOG</span>
      <span className="bg-word bg-word--extra">LE FOG</span>
      <span className="bg-word bg-word--extra">LE FOG</span>
    </div>
  );
}
