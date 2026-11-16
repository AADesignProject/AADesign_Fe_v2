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
  'color: $accent-color;\n  font-size: 12px',
  'Small text on light backgrounds should not use the low-contrast accent color'
);
// Captions sit under the photo on the page surface (no overlay), so they must
// never be hidden until hover: the text has to be readable on touch and for
// keyboard users without any interaction.
const captionBlocks = homeStyles.match(/\.caption\s*\{[^}]*\}/g) ?? [];
if (captionBlocks.length === 0) {
  throw new Error('Homepage styles should define a .caption rule');
}
for (const block of captionBlocks) {
  if (/opacity:\s*0\s*[;}]/.test(block)) {
    throw new Error(
      '.caption must not use opacity: 0 (text hidden by default)'
    );
  }
}

console.log('Homepage contrast checks passed.');
