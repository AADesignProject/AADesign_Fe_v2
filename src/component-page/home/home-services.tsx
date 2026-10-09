import { useTranslation } from 'react-i18next';

import styles from '@/scss/home-page.module.scss';

import type { LandingItem } from './types';

const HomeServices = () => {
  const { t } = useTranslation();
  const items = t('home.landing.services.items', {
    returnObjects: true,
  }) as LandingItem[];
  const types = t('home.landing.services.types', {
    returnObjects: true,
  }) as string[];

  return (
    <section id="services" className={styles.services}>
      <div className={styles.servicesInner}>
        <h2 className={styles.servicesTitle}>
          {t('home.landing.services.title')}
        </h2>
        <ul className={styles.serviceList}>
          {items.map((item) => (
            <li key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </li>
          ))}
        </ul>
        <div className={styles.types}>
          <h3>{t('home.landing.services.typesTitle')}</h3>
          <ul>
            {types.map((type) => (
              <li key={type}>{type}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default HomeServices;
