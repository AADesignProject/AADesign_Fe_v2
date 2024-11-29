import { useEffect, useState } from 'react';
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

const listImageCarousel = [
  { src: 'https://aa-design.s3.ap-southeast-1.amazonaws.com/ini-design.jpg' },
  { src: 'https://aa-design.s3.ap-southeast-1.amazonaws.com/design_1.webp' },
];

const components: IComponentConfig[] = [
  {
    id: 'design-service',
    component: dynamic(() => import('@/component-page/home/design-service'), {
      ssr: false,
    }),
  },
  {
    id: 'our-service',
    component: dynamic(() => import('@/component-page/home/our-service'), {
      ssr: false,
    }),
  },
  {
    id: 'our-project',
    component: dynamic(() => import('@/component-page/home/our-project'), {
      ssr: false,
    }),
  },
];

const HomePage = () => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible((prev) => ({
              ...prev,
              [entry.target.id]: true,
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    components.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => {
      components.forEach(({ id }) => {
        const element = document.getElementById(id);
        if (element) observer.unobserve(element);
      });
    };
  }, []);

  return (
    <>
      <SEOHeaderComponent
        title={t('seo.title_homepage')}
        description={t('seo.description_homepage')}
        keywords="AA DESIGN, design, interior design, Thiết kế nội thất, La văn phi, La thiên phi, aa design homepage"
      />
      <div className={styles.wrapperHomePage}>
        <CarouselComponent images={listImageCarousel} />
        {components.map(({ id, component: Component }) => (
          <div key={id} id={id}>
            {visible[id] && <Component />}
          </div>
        ))}
      </div>
    </>
  );
};

export default HomePage;
