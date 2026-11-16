import { useRef } from 'react';
import { useTranslation } from 'react-i18next';

import styles from '@/scss/home-page.module.scss';
import { useReveal } from '@/utils/gsap';

import type { LandingItem } from './types';

const pad = (value: number) => String(value).padStart(2, '0');

const HomeProcess = () => {
  const { t } = useTranslation();
  const ref = useRef<HTMLElement>(null);
  const steps = t('home.landing.process.items', {
    returnObjects: true,
  }) as LandingItem[];

  // Each step rises into place once (staggered); static without JS or motion.
  useReveal(ref);

  return (
    <section
      id="process"
      ref={ref}
      className={styles.process}
      style={{ ['--steps' as string]: steps.length }}
    >
      <div className={styles.processInner}>
        <h2 className={styles.sectionTitle}>
          {t('home.landing.process.title')}
        </h2>
        <ol className={styles.processTrack}>
          {steps.map((step, index) => (
            <li className={styles.step} key={step.title} data-reveal>
              <span className={styles.stepNumber} aria-hidden="true">
                {pad(index + 1)}
              </span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default HomeProcess;
