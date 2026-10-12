import type { PatternKey } from '@/lib/types/pattern-key';

export interface Pattern {
  key: PatternKey;
  /* Public path of the seamless tile. */
  src: string;
  /* The line shown beneath the plate, as a gallery labels a work. */
  caption: string;
}
