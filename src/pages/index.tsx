import { useTranslation } from 'react-i18next';
import dynamic from 'next/dynamic';

//components
import SEOHeaderComponent from '@/components/seo-header';
import CarouselComponent from '@/components/carousel';

//styles
import styles from '@/scss/home-page.module.scss';

interface IComponentConfig {
  id: string;
  component: React.ComponentType<object>;
}

const components: IComponentConfig[] = [
  {
    id: 'design-service',
    component: dynamic(() => import('@/component-page/home/design-service')),
  },
  {
    id: 'our-service',
    component: dynamic(() => import('@/component-page/home/our-service')),
  },
  {
    id: 'our-project',
    component: dynamic(() => import('@/component-page/home/our-project')),
  },
];

const HomePage = () => {
  const { t } = useTranslation();

  return (
    <>
      <SEOHeaderComponent
        title={t('seo.title_homepage')}
        description={t('seo.description_homepage')}
        keywords="AA DESIGN, design, interior design, Thiết kế nội thất, La Van Phi, La Thien Phi, aa design homepage, aa-design, aa-design.vn"
      />
      <div className={styles.wrapperHomePage}>
        <CarouselComponent />
        {components.map(({ id, component: Component }) => (
          <div key={id} id={id}>
            <Component />
          </div>
        ))}
      </div>
    </>
  );
};

export default HomePage;
