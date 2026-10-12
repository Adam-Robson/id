import Image from 'next/image';

import '@/components/styles/about-gallery.css';

/**
 * The portrait beside the About text. The caption is visually hidden; it
 * gives screen readers the description the empty alt leaves out, without
 * repeating it for sighted visitors who can see the photo.
 */
export default function AboutGallery() {
  return (
    <figure className='about-gallery'>
      <div className='about-frame'>
        <Image
          src='/images/facedeer.webp'
          alt=''
          width={2000}
          height={2000}
          sizes='(max-width: 520px) 92vw, 480px'
          className='about-portrait'
          priority
        />
      </div>

      <figcaption className='about-gallery-caption'>
        A portrait of LE FOG in a deer mask against a textured wall, tinted deep
        teal and oxblood.
      </figcaption>
    </figure>
  );
}
