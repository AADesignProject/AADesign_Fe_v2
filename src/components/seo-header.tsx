import Head from 'next/head';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { email, phoneNumberHref } from '@/constant/general';

interface ISEOHeadProps {
  breadcrumbs?: Array<{
    name: string;
    url: string;
  }>;
  title: string;
  description: string;
  keywords: string;
  image?: string;
  type?: 'website' | 'article';
  structuredData?: Record<string, unknown> | Record<string, unknown>[];
}

const SEOHeaderComponent = ({
  breadcrumbs,
  title,
  description,
  keywords,
  image,
  type = 'website',
  structuredData,
}: ISEOHeadProps) => {
  const router = useRouter();
  const { t } = useTranslation();
  const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL || 'https://aa-design.vn'
  ).replace(/\/$/, '');
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
  const toAbsoluteUrl = (url: string) => {
    if (url.startsWith('http')) return url;
    const normalizedPath = url.startsWith('/') ? url : `/${url}`;
    return `${siteUrl}${normalizedPath === '/' ? '' : normalizedPath}`;
  };
  const pageTitle = title.includes('AA DESIGN')
    ? title
    : `${title} | AA Design`;
  const pageDescription = description || t('seo.defaultDescription');
  const socialImage = image?.startsWith('http')
    ? image
    : `${siteUrl}${image || '/images/our_service_bg.webp'}`;
  const baseStructuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'AA Design',
      url: siteUrl,
      logo: `${siteUrl}/favicon.ico`,
      email,
      telephone: phoneNumberHref,
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Lac Hong Westlake',
        addressLocality: 'Tay Ho',
        addressRegion: 'Ha Noi',
        addressCountry: 'VN',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      name: 'AA Design',
      url: siteUrl,
      image: socialImage,
      telephone: phoneNumberHref,
      email,
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Lac Hong Westlake',
        addressLocality: 'Tay Ho',
        addressRegion: 'Ha Noi',
        addressCountry: 'VN',
      },
      areaServed: {
        '@type': 'Country',
        name: 'Vietnam',
      },
      serviceType: [
        'Architecture design',
        'Interior design',
        'Turnkey construction',
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'AA Design',
      url: siteUrl,
      inLanguage: currentLocale,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: pageTitle,
      description: pageDescription,
      url: currentUrl,
      inLanguage: currentLocale,
      isPartOf: {
        '@type': 'WebSite',
        name: 'AA Design',
        url: siteUrl,
      },
    },
  ];
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
    ...baseStructuredData,
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
      {keywords ? <meta name="keywords" content={keywords} /> : null}
      <meta name="author" content="AA DESIGN" />
      <meta name="robots" content="index, follow" />
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

      <script type="application/ld+json">
        {JSON.stringify(structuredDataList)}
      </script>
    </Head>
  );
};

export default SEOHeaderComponent;
