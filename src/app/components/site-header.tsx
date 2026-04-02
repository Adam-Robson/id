import ThemeToggle from '@/app/components/theme-toggle';
import Navigation from '@/app/components/navigation'

type Props = {
  variant: 'home' | 'interior';
};

export default function SiteHeader({ variant }: Props) {
  return (
    <header className="site-header">
      {variant === 'home' ? (
        <Navigation />
      ) : (
        <a href="/" className="back-link">← LE FOG</a>
      )}
      <ThemeToggle />
    </header>
  );
}
