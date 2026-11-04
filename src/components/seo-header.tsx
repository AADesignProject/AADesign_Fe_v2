import Head from 'next/head';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { siteUrl } from '@/utils/siteUrl';

// Vercel preview/development deployments must never be indexed (they would
// compete with production). Unset locally, so local builds keep `index, follow`.
// NEXT_PUBLIC_VERCEL_ENV is inlined into the browser bundle (when Vercel exposes
// system env vars) so the client render agrees with the server HTML.
const vercelEnv = process.env.NEXT_PUBLIC_VERCEL_ENV ?? process.env.VERCEL_ENV;
const robots =
  vercelEnv && vercelEnv !== 'production'
    ? 'noindex, nofollow'
    : 'index, follow';

interface ISEOHeadProps {
  breadcrumbs?: Array<{
    name: string;
    url: string;
  }>;
  title: string;
  description: string;
  image?: string;
  type?: 'website' | 'article';
  structuredData?: Record<string, unknown> | Record<string, unknown>[];
}

const SEOHeaderComponent = ({
  breadcrumbs,
  title,
  description,
  image,
  type = 'website',
  structuredData,
}: ISEOHeadProps) => {
  const router = useRouter();
  const { t } = useTranslation();
  const currentLocale = router.locale ?? router.defaultLocale ?? 'vi';
  const defaultLocale = router.defaultLocale ?? 'vi';
  const pathname = router.asPath
    .split('?')[0]
    .split('#')[0]
    .replace(/^\/(en|vi)(?=\/|$)/, '')
    .replace(/\/$/, '');
  const localeMap: Record<string, string> = {
    en: 'en_US',
    vi: 'vi_VN',
  };
  const buildLocaleUrl = (locale: string) => {
    const localePrefix = locale === defaultLocale ? '' : `/${locale}`;

    return `${siteUrl}${localePrefix}${pathname}`;
  };
  const currentUrl = buildLocaleUrl(currentLocale);
  // Breadcrumb links must point at the page in the language being viewed.
  const toAbsoluteUrl = (url: string) => {
    if (url.startsWith('http')) return url;
    const normalizedPath = url.startsWith('/') ? url : `/${url}`;
    const localePrefix =
      currentLocale === defaultLocale ? '' : `/${currentLocale}`;
    return `${siteUrl}${localePrefix}${normalizedPath === '/' ? '' : normalizedPath}`;
  };
  const pageTitle = title.includes('AA DESIGN')
    ? title
    : `${title} | AA Design`;
  const pageDescription = description || t('seo.defaultDescription');
  const socialImage = image?.startsWith('http')
    ? image
    : `${siteUrl}${image || '/images/our_service_bg.webp'}`;
  const breadcrumbStructuredData =
    breadcrumbs && breadcrumbs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: breadcrumbs.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: toAbsoluteUrl(item.url),
          })),
        }
      : null;
  const structuredDataList = [
    ...(breadcrumbStructuredData ? [breadcrumbStructuredData] : []),
    ...(Array.isArray(structuredData)
      ? structuredData
      : structuredData
        ? [structuredData]
        : []),
  ];

  return (
    <Head>
      <title key="title">{pageTitle}</title>
      <meta key="description" name="description" content={pageDescription} />
      <meta name="author" content="AA DESIGN" />
      <meta name="robots" content={robots} />
      <link rel="canonical" href={currentUrl} />
      <link rel="alternate" hrefLang="vi" href={buildLocaleUrl('vi')} />
      <link rel="alternate" hrefLang="en" href={buildLocaleUrl('en')} />
      <link
        rel="alternate"
        hrefLang="x-default"
        href={buildLocaleUrl(defaultLocale)}
      />

      <meta property="og:site_name" content="AA Design" />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={socialImage} />
      <meta property="og:image:alt" content={pageTitle} />
      <meta property="og:url" content={currentUrl} />
      <meta
        property="og:locale"
        content={localeMap[currentLocale] ?? localeMap.vi}
      />
      {Object.entries(localeMap)
        .filter(([locale]) => locale !== currentLocale)
        .map(([, openGraphLocale]) => (
          <meta
            key={openGraphLocale}
            property="og:locale:alternate"
            content={openGraphLocale}
          />
        ))}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={socialImage} />

      {structuredDataList.length > 0 ? (
        // As a child React would HTML-escape the quotes (&quot;), which makes
        // the JSON-LD in the server HTML invalid for crawlers that skip JS.
        // `<` is escaped so no field value can close the script tag.
        <script
          key="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredDataList).replace(/</g, '\\u003c'),
          }}
        />
      ) : null}
    </Head>
  );
};

export default SEOHeaderComponent;
