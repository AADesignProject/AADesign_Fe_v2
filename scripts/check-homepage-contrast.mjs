import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (relativePath) =>
  fs.readFileSync(path.join(root, relativePath), 'utf8');

const variables = read('src/styles/variables.module.scss');
const homeStyles = read('src/styles/home-page.module.scss');

const parseHex = (name) => {
  const match = variables.match(
    new RegExp(`\\$${name}:\\s*(#[0-9a-fA-F]{3,6})`)
  );
  if (!match) throw new Error(`Missing color token: ${name}`);
  const hex = match[1].replace('#', '');
  const normalized =
    hex.length === 3
      ? hex
          .split('')
          .map((char) => char + char)
          .join('')
      : hex;
  return [0, 2, 4].map((start) =>
    Number.parseInt(normalized.slice(start, start + 2), 16)
  );
};

const luminance = ([red, green, blue]) => {
  const channel = [red, green, blue].map((value) => {
    const normalized = value / 255;
    return normalized <= 0.03928
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  });

  return channel[0] * 0.2126 + channel[1] * 0.7152 + channel[2] * 0.0722;
};

const ratio = (foreground, background) => {
  const lighter = Math.max(luminance(foreground), luminance(background));
  const darker = Math.min(luminance(foreground), luminance(background));
  return (lighter + 0.05) / (darker + 0.05);
};

const assertRatio = (foregroundToken, backgroundToken, minimum) => {
  const actual = ratio(parseHex(foregroundToken), parseHex(backgroundToken));
  if (actual < minimum) {
    throw new Error(
      `${foregroundToken} on ${backgroundToken} contrast ${actual.toFixed(
        2
      )} is below ${minimum}`
    );
  }
};

const assertIncludes = (source, expected, message) => {
  if (!source.includes(expected)) {
    throw new Error(message);
  }
};

const assertNotIncludes = (source, expected, message) => {
  if (source.includes(expected)) {
    throw new Error(message);
  }
};

assertRatio('primary-dark', 'surface-color', 4.5);
assertRatio('muted-text-color', 'surface-color', 4.5);
assertRatio('secondary-color', 'surface-color', 7);

assertNotIncludes(
  homeStyles,
  '.eyebrow {\n  display: inline-flex;\n  color: $accent-color;',
  'Small eyebrow text on light backgrounds should not use the low-contrast accent color'
);
assertIncludes(
  homeStyles,
  '.mosaicItem {\n    position: relative;',
  'Mosaic items should keep captions positioned over images'
);
assertIncludes(
  homeStyles,
  'z-index: 1;',
  'Image captions should sit above the dark overlay'
);
assertIncludes(
  homeStyles,
  'rgba(23, 23, 20, 0.88) 100%',
  'Image overlays should be dark enough for readable white captions'
);

console.log('Homepage contrast checks passed.');
