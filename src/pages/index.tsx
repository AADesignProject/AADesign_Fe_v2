import { useTranslation } from 'react-i18next';

//components
import SEOHeaderComponent from '@/components/seo-header';
import HomepageLandingComponent from '@/component-page/home/homepage-landing';

//styles

const HomePage = () => {
  const { t } = useTranslation();

  return (
    <>
      <SEOHeaderComponent
        title={t('seo.title_homepage')}
        description={t('seo.description_homepage')}
        keywords={t('seo.keywords_homepage')}
      />
      <HomepageLandingComponent />
    </>
  );
};

export default HomePage;
