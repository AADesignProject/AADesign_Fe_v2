import projectContent from '@/data/project-content.json';

type LocaleContent = {
  description?: string;
  style?: string;
  materials?: string;
  highlights?: string;
};

// Per-project facts written by the studio, keyed by project `_id`. Empty or
// missing fields are simply not shown on the page. Fill them from
// CONTENT_TODO.csv; `updatedAt` feeds the sitemap <lastmod>, bump it when the
// project's content really changes.
export type ProjectContent = {
  updatedAt?: string;
  area?: number;
  year?: number;
  vi?: LocaleContent;
  en?: LocaleContent;
};

const content = projectContent as Record<string, ProjectContent>;

export const getProjectContent = (id: string): ProjectContent =>
  content[id] ?? {};

export const getLocaleContent = (id: string, locale?: string): LocaleContent =>
  getProjectContent(id)[locale === 'en' ? 'en' : 'vi'] ?? {};
