import Head from 'next/head';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

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
  const { i18n } = useTranslation();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aa-design.vn';
  const currentUrl = `${siteUrl}${router.asPath === '/' ? '' : router.asPath}`;
  const ogImage = `${siteUrl}/images/our_service_bg.webp`;

  return (
    <Head>
      <title>{`AA DESIGN - ${title}`}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={'AA DESIGN'} />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={currentUrl} />
      <link rel="alternate" hrefLang="vi" href={currentUrl} />
      <link rel="alternate" hrefLang="en" href={currentUrl} />
      <link rel="alternate" hrefLang="x-default" href={currentUrl} />

      {/* Thêm Open Graph tags cho social media */}
      <meta property="og:title" content={`AA DESIGN - ${title}`} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:locale" content={i18n.language || 'vi'} />

      {/* Thêm Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={`AA DESIGN - ${title}`} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Thêm structured data */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'AA DESIGN',
          url: 'https://aa-design.vn',
          // Thêm thông tin khác
        })}
      </script>
    </Head>
  );
};

export default SEOHeaderComponent;
