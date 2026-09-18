import Image from 'next/image';
import '@/app/components/about-gallery.css';

/**
 * One frame that works its way through the three self-portraits.
 *
 * The photos sit stacked in a single card and dissolve between each other on
 * uneven beats — see the cycle in about-gallery.css. Ordered cool -> warm ->
 * hot: the shots have very different colour casts (teal, gold, magenta), and
 * passing through the sunlit one between the other two makes the sequence
 * read as a drift rather than a collision.
 */
const PORTRAITS = [
  '/images/facedeer.webp',
  '/images/coffeecup.webp',
  '/images/facestars.webp',
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
                /* The set is described once, in the caption below, rather
                   than three times over for what reads as one picture. */
                alt=''
                width={2000}
                height={2000}
                /* Without this the browser fetches for the full 2000px
                   intrinsic width whatever the frame is actually shown at. */
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
        tinted deep teal and oxblood; backlit by morning sun, holding a mug
        printed with a coffee-drinking loop written in code; and under pink neon
        in heart-shaped sunglasses, a star decal on one cheek.
      </figcaption>
    </figure>
  );
}
