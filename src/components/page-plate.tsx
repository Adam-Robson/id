import { PATTERNS } from '@/lib/constants/patterns';
import type { PagePlateProps } from '@/lib/types/page-plate.props';
import '@/components/styles/page-plate.css';

/**
 * The page's print, presented as a work on the wall: a framed band of the
 * seamless tile with a small caption beneath. The print is decorative, so
 * it is hidden from assistive tech; the caption is ordinary visible text.
 */
export default function PagePlate({ pattern, size = 'band' }: PagePlateProps) {
  const { src, caption } = PATTERNS[pattern];

  return (
    <div className={`page-plate page-plate--${size}`}>
      <div
        className='page-plate-image'
        aria-hidden='true'
        style={{ backgroundImage: `url(${src})` }}
      />
      <p className='page-plate-caption label'>{caption}</p>
    </div>
  );
}
