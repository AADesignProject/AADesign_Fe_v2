import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';

//components
import SEOHeaderComponent from '@/components/seo-header';
import HomepageLandingComponent from '@/component-page/home/homepage-landing';
import { getBusinessSchema } from '@/utils/businessSchema';

//styles

const HomePage = () => {
  const { t } = useTranslation();
  const { locale = 'vi' } = useRouter();

  return (
    <>
      <SEOHeaderComponent
        title={t('seo.title_homepage')}
        description={t('seo.description_homepage')}
        structuredData={getBusinessSchema(locale)}
      />
      <HomepageLandingComponent />
    </>
  );
};

export default HomePage;
