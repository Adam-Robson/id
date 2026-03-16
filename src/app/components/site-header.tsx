import ThemeToggle from '@/app/components/theme-toggle';

type Props = {
  variant: 'home' | 'interior';
};

export default function SiteHeader({ variant }: Props) {
  return (
    <header className="site-header">
      {variant === 'home' ? (
        <nav className="site-nav">
          <a href="/about" className="nav-link">About</a>
          <a href="/contact" className="nav-link">Contact</a>
        </nav>
      ) : (
        <a href="/" className="back-link">← LE FOG</a>
      )}
      <ThemeToggle />
    </header>
  );
}
