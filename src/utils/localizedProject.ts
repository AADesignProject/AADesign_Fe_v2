export type SupportedLocale = 'en' | 'vi';

export type ProjectLike = {
  _id: string;
  address: string;
  name: string;
  type: string;
};

type ProjectTranslation = {
  address?: string;
  name?: string;
};

const englishProjectTranslations: Record<string, ProjectTranslation> = {
  '67f898307d268cfebb8c0af4': {
    address: 'Au Co, Hanoi',
    name: 'Au Co Villa',
  },
  '67f9ed566644672a6bf73b4a': {
    address: 'Ha Dong, Hanoi',
    name: 'Van Phu Villa',
  },
  '67f90c4ff603a839446d4911': {
    address: 'Ba Vi, Hanoi',
    name: 'Amour Resort Ba Vi',
  },
  '67f9ef7a6644672a6bf73b57': {
    address: 'Vinhomes, Hanoi',
    name: 'Hoa Lan Vinhomes',
  },
  '67f9f04f6644672a6bf73b5f': {
    address: 'Khai Minh Duc, Bac Ninh',
    name: 'Bac Ninh Kindergarten',
  },
  '67f9f0e06644672a6bf73b63': {
    address: 'Tay Ho, Hanoi',
    name: 'Lac Hong Office',
  },
  '67f9f24d6644672a6bf73b6b': {
    address: 'Kim Do, Bac Ninh',
    name: 'Kim Do Model Villa 06',
  },
  '67f9f2a56644672a6bf73b6f': {
    address: 'District 5, Ho Chi Minh City',
    name: 'District 5 Villa',
  },
  '67f9f3a96644672a6bf73b77': {
    address: 'Ho Chi Minh City',
    name: 'Vinhomes Apartment',
  },
  '67f9f4086644672a6bf73b7b': {
    address: 'Nghia Lo, Yen Bai',
    name: 'Nghia Lo Villa',
  },
  '67f9f4386644672a6bf73b7f': {
    address: 'Long Bien, Hanoi',
    name: 'Khai Son Hill',
  },
  '67f9f4a46644672a6bf73b83': {
    address: 'Hiep Hoa, Bac Giang',
    name: 'Hiep Hoa Urban Area',
  },
  '67f9f50f6644672a6bf73b87': {
    address: 'Tam Dao, Vinh Phuc',
    name: 'Venus Resort',
  },
  '67f9f5526644672a6bf73b8b': {
    address: 'Hang Chao, Hanoi',
    name: 'House No. 9',
  },
  '67fa23066644672a6bf73ba0': {
    address: 'Kim Do, Bac Ninh',
    name: 'Kim Do Villa',
  },
  '67fa237d6644672a6bf73ba4': {
    address: 'Tam Dao, Vinh Phuc',
    name: 'Vinh Phuc Villa',
  },
  '67fa23db6644672a6bf73ba8': {
    address: 'Le Van Luong, Hanoi',
    name: 'BGR Diamond Residence',
  },
  '67fa23fd6644672a6bf73bac': {
    address: 'Hang Trong, Hanoi',
    name: 'Worship Room',
  },
  '67fa24db6644672a6bf73bb0': {
    address: 'Nguyen Du, Quy Nhon',
    name: 'No. 6 Nguyen Du',
  },
  '67fa25306644672a6bf73bb4': {
    address: 'Vung Tau',
    name: 'Lavida Residences Villa',
  },
  '67fa25856644672a6bf73bb8': {
    address: 'Ba Vi, Hanoi',
    name: 'Traditional House Project',
  },
  '67fa25f76644672a6bf73bbc': {
    address: 'Quy Nhon',
    name: 'Dai Phu Gia',
  },
};

export const normalizeLocale = (locale?: string): SupportedLocale =>
  locale === 'en' ? 'en' : 'vi';

export const getLocalizedProject = <TProject extends ProjectLike>(
  project: TProject,
  locale?: string
) => {
  const normalizedLocale = normalizeLocale(locale);
  const translation =
    normalizedLocale === 'en' ? englishProjectTranslations[project._id] : null;

  return {
    ...project,
    displayAddress: translation?.address ?? project.address,
    displayName: translation?.name ?? project.name,
  };
};

export const getLocalizedProjects = <TProject extends ProjectLike>(
  projects: TProject[],
  locale?: string
) => projects.map((project) => getLocalizedProject(project, locale));
