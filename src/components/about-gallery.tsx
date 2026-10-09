import Image from 'next/image';

import '@/components/styles/about-gallery.css';

/**
 * A small interactive gallery component for the LE FOG website.
 * It cycles through three self-portraits with different color casts.
 */
const PORTRAITS = [
  '/images/facedeer.webp'
];

export default function AboutGallery() {
  return (
    <figure className='about-gallery'>
      <div className='about-frame'>
        <div className='about-frame-card'>
          {PORTRAITS.map((src, layer) => (
            <div className='about-layer' key={src}>
              <Image
                src={src}
                alt=''
                width={2000}
                height={2000}
                sizes='(max-width: 520px) 92vw, 480px'
                className='about-layer-img'
                priority={layer === 0}
              />
            </div>
          ))}
        </div>
      </div>

      <figcaption className='about-gallery-caption'>
        Three portraits of LE FOG: in a deer mask against a textured wall,
        tinted deep teal and oxblood; backlit by morning sun.
      </figcaption>
    </figure>
  );
}
