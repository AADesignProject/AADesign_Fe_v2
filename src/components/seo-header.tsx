import Head from 'next/head';

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
  return (
    <Head>
      <title>{`AA DESIGN - ${title}`}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={'AA DESIGN'} />

      {/* Thêm Open Graph tags cho social media */}
      <meta property="og:title" content={`AA DESIGN - ${title}`} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      {/* <meta property="og:image" content={ogImage} /> */}
      {/* <meta property="og:url" content={currentUrl} /> */}

      {/* Thêm Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={`AA DESIGN - ${title}`} />
      <meta name="twitter:description" content={description} />
      {/* <meta name="twitter:image" content={ogImage} /> */}

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
