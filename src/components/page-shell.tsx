import PagePlate from '@/components/page-plate';
import SiteHeader from '@/components/site-header';
import type { PageShellProps } from '@/lib/types/page-shell.props';

/**
 * The frame every page shares: header, the page's print, then the page.
 * Taking one pattern key keeps `data-pattern` (which sets the accent) and
 * the plate (which shows the print) from ever disagreeing.
 */
export default function PageShell({
  pattern,
  plate = 'band',
  children,
}: PageShellProps) {
  return (
    <div className='page-wrapper' data-pattern={pattern}>
      <SiteHeader />
      <PagePlate pattern={pattern} size={plate} />
      {children}
    </div>
  );
}
