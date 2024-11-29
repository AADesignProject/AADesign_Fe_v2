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
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content={'AA DESIGN'} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="UTF-8" />
    </Head>
  );
};

export default SEOHeaderComponent;
