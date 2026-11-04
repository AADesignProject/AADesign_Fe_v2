import type { TFunction } from 'i18next';

// Room guessed from the photo's file name (the studio names files like
// `p_khach_2`, `bep_1`, `ngu_master_3`). Tokens must match whole words, so
// "nguyen" never reads as "ngu". Order matters: first match wins.
const spaceRules: Array<[tokens: string, space: string]> = [
  ['wc', 'bathroom'],
  ['thay_do', 'dressing'],
  ['tho', 'worship'],
  ['gym', 'gym'],
  ['giam_doc', 'director'],
  ['doc', 'reading'],
  ['mat_tien|facade', 'facade'],
  ['nha_hang', 'restaurant'],
  ['caffe', 'cafe'],
  ['sanh|le_tan', 'lobby'],
  ['khach', 'living'],
  ['bep', 'kitchen'],
  ['phong_an', 'dining'],
  ['ngu|master|con_gai|ong_ba', 'bedroom'],
  ['thang', 'stairs'],
  ['sinh_hoat', 'family'],
  ['vuon', 'garden'],
];

const compiledSpaceRules = spaceRules.map(
  ([tokens, space]) =>
    [new RegExp(`(^|_)(?:${tokens})(_|$)`), space] as [RegExp, string]
);

export const getSpaceKey = (imagePath: string) => {
  const name = (imagePath.split('/').pop() ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/^\d+-/, '')
    .replace(/\.(webp|jpe?g|png)/g, '')
    .replace(/[^a-z0-9]+/g, '_');

  return compiledSpaceRules.find(([pattern]) => pattern.test(name))?.[1];
};

// "Âu Cơ, Hà Nội" -> "Hà Nội"
const getCity = (address: string) =>
  address.split(',').pop()?.trim() || address;

// Search-result snippets read best at 140-160 characters (counted as code
// points, like the SEO check script does).
const MIN_DESCRIPTION = 140;
const MAX_DESCRIPTION = 160;
const length = (text: string) => [...text].length;

// Cuts at a word boundary and adds "…", never exceeding `max` characters.
const truncate = (text: string, max = MAX_DESCRIPTION) => {
  const chars = [...text.replace(/\s+/g, ' ').trim()];
  if (chars.length <= max) return chars.join('');
  const end = chars.lastIndexOf(' ', max - 1);
  return `${chars.slice(0, end > 0 ? end : max - 1).join('')}…`;
};

// Every combination of the filler clauses, fewest clauses first.
const combinations = (items: string[]) =>
  items
    .reduce<string[][]>(
      (all, item) => [...all, ...all.map((combo) => [...combo, item])],
      [[]]
    )
    .sort((a, b) => a.length - b.length);

// Pads `base` with generic filler clauses and the contact line until it lands
// in 140-160 characters. Copy that is already long enough (real project text)
// is kept as is, or word-trimmed if it is too long.
const fitDescription = (base: string, fillers: string[], cta: string) => {
  const flat = base.replace(/\s+/g, ' ').trim();
  const fitted = combinations(fillers)
    .map((extra) => [flat, ...extra, cta].join(' '))
    .find(
      (text) =>
        length(text) >= MIN_DESCRIPTION && length(text) <= MAX_DESCRIPTION
    );

  return fitted ?? truncate(flat);
};

type SeoProject = {
  displayAddress: string;
  displayName: string;
  type: string;
};

export const getProjectPhrase = (t: TFunction, type: string) =>
  t(`project.seoPhrase.${type}`, {
    defaultValue: t('project.seoPhrase.all'),
  });

export const getProjectSeo = (
  t: TFunction,
  project: SeoProject,
  options: { description?: string; imageCount: number; locale?: string }
) => {
  const phrase = getProjectPhrase(t, project.type);

  return {
    title: t('construction.detail.seoTitle', {
      name: project.displayName,
      phrase,
      city: getCity(project.displayAddress),
    }),
    // Real copy wins; otherwise a line built only from the project's own name,
    // address, type and photo count plus generic service/contact wording (no
    // invented claims), padded to 140-160 characters.
    description: fitDescription(
      options.description ||
        t('construction.detail.seoDescription', {
          name: project.displayName,
          address: project.displayAddress,
          phrase: phrase.toLocaleLowerCase(options.locale),
        }),
      [
        t('construction.detail.seoPhotos', { count: options.imageCount }),
        ...(t('construction.detail.seoFillers', {
          returnObjects: true,
        }) as unknown as string[]),
      ],
      t('construction.detail.seoCta')
    ),
  };
};

export const getImageAlt = (
  t: TFunction,
  project: SeoProject,
  imagePath: string,
  index: number
) => {
  const phrase = getProjectPhrase(t, project.type);
  const space = getSpaceKey(imagePath);

  return space
    ? t('construction.detail.imageAlt', {
        space: t(`project.spaces.${space}`),
        name: project.displayName,
        phrase,
      })
    : t('construction.detail.imageAltGeneric', {
        name: project.displayName,
        index: index + 1,
        phrase,
      });
};
