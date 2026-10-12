/**
 * Build every logo asset from the designer's exports into assets/logo.
 */
import { mkdir } from 'node:fs/promises';
import { buildIcons } from './logo/build-icons.mjs';
import { buildOrbs } from './logo/build-orbs.mjs';
import { buildWordmark } from './logo/build-wordmark.mjs';
import { OUT } from './logo/sources.mjs';

await mkdir(OUT.logoDir, { recursive: true });

for (const line of [
  await buildWordmark(),
  ...(await buildOrbs()),
  ...(await buildIcons()),
]) {
  console.log(line);
}
