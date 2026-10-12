import { GLYPH_INK } from './sources.mjs';

/** One lettering group: ink wrapper, positioning group, then a path or nothing. */
const GLYPH_GROUP = new RegExp(
  `<g fill="${GLYPH_INK}"[^>]*><g transform="[^"]*">(?:<g><path d="[^"]*"/></g>|<g/>)</g></g>`,
  'g',
);

const ROOT_TAG = /^<svg[^>]*>/;

/** Every lettering group that draws something, in source order. */
export function glyphGroups(svg) {
  return (svg.match(GLYPH_GROUP) ?? []).filter((g) => g.includes('<path'));
}

/** The export with its lettering removed: just the masked orb. */
export function orbOnly(svg) {
  return svg.replace(GLYPH_GROUP, '');
}

/** Wraps body markup in a root that maps `frame` onto `px` pixels. */
export function framed(body, frame, px) {
  const { x, y, w, h } = frame;
  const height = Math.round((px * h) / w);
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="${x} ${y} ${w} ${h}" width="${px}" height="${height}">${body}</svg>`;
}

/** The export's content without its root element. */
export function body(svg) {
  return svg.replace(ROOT_TAG, '').replace(/<\/svg>\s*$/, '');
}
