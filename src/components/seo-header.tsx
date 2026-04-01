import Head from 'next/head';
import { useRouter } from 'next/router';

interface ISEOHeadProps {
  title: string;
  description: string;
  keywords: string;
}

const SEOHeaderComponent = ({
  title,
  description,
  keywords,
}: ISEOHeadProps) => {
  const router = useRouter();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aa-design.vn';
  const currentLocale = router.locale ?? router.defaultLocale ?? 'vi';
  const defaultLocale = router.defaultLocale ?? 'vi';
  const pathname = router.asPath
    .split('?')[0]
    .split('#')[0]
    .replace(/^\/(en|vi)(?=\/|$)/, '')
    .replace(/\/$/, '');
  const ogImage = `${siteUrl}/images/our_service_bg.webp`;
  const localeMap: Record<string, string> = {
    en: 'en_US',
    vi: 'vi_VN',
  };
  const buildLocaleUrl = (locale: string) => {
    const localePrefix = locale === defaultLocale ? '' : `/${locale}`;

    return `${siteUrl}${localePrefix}${pathname}`;
  };
  const currentUrl = buildLocaleUrl(currentLocale);

  return (
    <Head>
      <title>{`AA DESIGN - ${title}`}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
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

      <meta property="og:title" content={`AA DESIGN - ${title}`} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={currentUrl} />
      <meta
        property="og:locale"
        content={localeMap[currentLocale] ?? localeMap.vi}
      />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={`AA DESIGN - ${title}`} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'AA DESIGN',
          url: 'https://aa-design.vn',
        })}
      </script>
    </Head>
  );
};

export default SEOHeaderComponent;
