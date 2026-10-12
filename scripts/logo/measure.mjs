import sharp from 'sharp';
import { framed } from './parse-logo.mjs';

const CANVAS = { x: 0, y: 0, w: 1500, h: 1500 };

/** The tight box, in source units, around what `markup` actually paints. */
export async function inkBox(markup) {
  const svg = Buffer.from(framed(markup, CANVAS, CANVAS.w));
  const { info } = await sharp(svg)
    .trim({ threshold: 0 })
    .toBuffer({ resolveWithObject: true });

  return {
    x: -info.trimOffsetLeft,
    y: -info.trimOffsetTop,
    w: info.width,
    h: info.height,
  };
}

/** The smallest box that contains every box given. */
export function union(...boxes) {
  const x = Math.min(...boxes.map((b) => b.x));
  const y = Math.min(...boxes.map((b) => b.y));
  const right = Math.max(...boxes.map((b) => b.x + b.w));
  const bottom = Math.max(...boxes.map((b) => b.y + b.h));
  return { x, y, w: right - x, h: bottom - y };
}

/** A square around `box`, centred on it, with `pad` of its side as margin. */
export function square(box, pad = 0) {
  const side = Math.max(box.w, box.h) * (1 + 2 * pad);
  return {
    x: box.x + box.w / 2 - side / 2,
    y: box.y + box.h / 2 - side / 2,
    w: side,
    h: side,
  };
}
