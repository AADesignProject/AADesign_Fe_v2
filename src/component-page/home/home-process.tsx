import { useRef } from 'react';
import { useTranslation } from 'react-i18next';

import styles from '@/scss/home-page.module.scss';
import { useScrollAnimation } from '@/utils/gsap';

import type { LandingItem } from './types';

const pad = (value: number) => String(value).padStart(2, '0');

const HomeProcess = () => {
  const { t } = useTranslation();
  const ref = useRef<HTMLElement>(null);
  const steps = t('home.landing.process.items', {
    returnObjects: true,
  }) as LandingItem[];

  // Desktop with motion: pin the section and slide the steps sideways while a
  // thin bar and counter follow the scroll. Everywhere else it stays a plain
  // vertical list (see .process in the stylesheet).
  useScrollAnimation(ref, ({ gsap, mobile }) => {
    const section = ref.current;
    const track = section?.querySelector<HTMLElement>('[data-track]');
    const bar = section?.querySelector<HTMLElement>('[data-bar]');
    const count = section?.querySelector<HTMLElement>('[data-count-current]');
    if (!section || !track || mobile) return;

    section.dataset.pinned = 'true';
    let current = 0;

    gsap.to(track, {
      x: () => -(track.offsetWidth - section.offsetWidth),
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        pin: true,
        scrub: true,
        start: 'top top',
        end: () => `+=${track.offsetWidth - section.offsetWidth}`,
        invalidateOnRefresh: true,
        onUpdate: ({ progress }) => {
          if (bar) bar.style.transform = `scaleX(${progress})`;
          const next = Math.min(
            steps.length,
            Math.floor(progress * steps.length) + 1
          );
          if (count && next !== current) {
            current = next;
            count.textContent = pad(next);
          }
        },
      },
    });

    return () => {
      delete section.dataset.pinned;
      if (bar) bar.style.transform = '';
      if (count) count.textContent = pad(1);
    };
  });

  return (
    <section
      id="process"
      ref={ref}
      className={styles.process}
      style={{ ['--steps' as string]: steps.length }}
    >
      <div className={styles.processPin}>
        <div className={styles.processHead}>
          <h2 className={styles.sectionTitle}>
            {t('home.landing.process.title')}
          </h2>
          <span className={styles.processCount} aria-hidden="true">
            <span data-count-current>{pad(1)}</span> / {pad(steps.length)}
          </span>
        </div>
        <ol className={styles.processTrack} data-track>
          {steps.map((step, index) => (
            <li className={styles.step} key={step.title}>
              <div className={styles.stepInner}>
                <span className={styles.stepNumber} aria-hidden="true">
                  {pad(index + 1)}
                </span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className={styles.processBar} aria-hidden="true">
          <span data-bar />
        </div>
      </div>
    </section>
  );
};

export default HomeProcess;
