import { useTranslation } from 'react-i18next';

import styles from '@/scss/home-page.module.scss';

type Stat = { label: string; value: string };

const HomeIntro = () => {
  const { t } = useTranslation();
  const stats = t('home.landing.stats.items', {
    returnObjects: true,
  }) as Stat[];

  return (
    <section id="intro" className={styles.intro}>
      <div className={styles.introInner}>
        <h2 className={styles.introTitle}>{t('home.landing.intro.title')}</h2>
        <p className={styles.introText}>
          {t('home.landing.intro.description')}
        </p>
        <ul className={styles.stats}>
          {stats.map((stat) => (
            <li key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default HomeIntro;
