import { useRef } from 'react';
import { useTranslation } from 'react-i18next';

import styles from '@/scss/home-page.module.scss';
import { parseStat, useCountUp } from '@/utils/gsap';

type Stat = { label: string; value: string };

const HomeIntro = () => {
  const { t } = useTranslation();
  const ref = useRef<HTMLElement>(null);
  const stats = t('home.landing.stats.items', {
    returnObjects: true,
  }) as Stat[];

  // Numbers count up once when they scroll into view.
  useCountUp(ref);

  return (
    <section id="intro" ref={ref} className={styles.intro}>
      <div className={styles.introInner}>
        <h2 className={styles.introTitle}>{t('home.landing.intro.title')}</h2>
        <p className={styles.introText}>
          {t('home.landing.intro.description')}
        </p>
        <ul className={styles.stats}>
          {stats.map((stat) => {
            const { number, suffix } = parseStat(stat.value);
            return (
              <li key={stat.label}>
                <strong data-count={number} data-suffix={suffix}>
                  {stat.value}
                </strong>
                <span>{stat.label}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default HomeIntro;
