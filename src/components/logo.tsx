import Image from 'next/image';
import type { CSSProperties } from 'react';
import '@/components/styles/logo.css';
import { LOGO_GEOMETRY } from '@/lib/constants/logo-geometry';
import { LOGO_ORB_SIZE, LOGO_ORBS } from '@/lib/constants/logo-orbs';
import type { LogoProps } from '@/lib/types/logo.props';

const frame = {
  '--logo-aspect': LOGO_GEOMETRY.aspectRatio,
  '--orb-left': LOGO_GEOMETRY.orb.left,
  '--orb-top': LOGO_GEOMETRY.orb.top,
  '--orb-width': LOGO_GEOMETRY.orb.width,
  '--orb-height': LOGO_GEOMETRY.orb.height,
} as CSSProperties;

/**
 * The LE FOG wordmark: hand-drawn lettering with a watercolour orb for the O.
 *
 * The lettering is a CSS mask filled with the text colour, so it follows the
 * theme. The orb is a painted image beneath it. When cycling, every
 * colourway is stacked and CSS crossfades through them, so no script runs.
 */
export default function Logo({ cycle = false }: LogoProps) {
  const orbs = cycle ? LOGO_ORBS : LOGO_ORBS.slice(0, 1);

  return (
    <span
      className={`logo${cycle ? ' logo--cycle' : ''}`}
      role='img'
      aria-label='LE FOG'
      style={frame}
    >
      <span className='logo-orbs' aria-hidden='true'>
        {orbs.map((name, i) => (
          <Image
            key={name}
            className='logo-orb'
            src={`/images/logo/orb-${name}.webp`}
            alt=''
            width={LOGO_ORB_SIZE.width}
            height={LOGO_ORB_SIZE.height}
            style={{ '--orb-index': i } as CSSProperties}
            priority={i === 0}
            unoptimized
          />
        ))}
      </span>
      <span className='logo-letters' aria-hidden='true' />
    </span>
  );
}
