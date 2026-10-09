import { useRef } from 'react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

import styles from '@/scss/home-page.module.scss';
import { useAfterLoad, useScrollAnimation } from '@/utils/gsap';
import { resolveImageUrl } from '@/utils/resolveImageUrl';

import type { LocalizedProject } from './types';

// Full-bleed photo that drifts slowly behind the page as you scroll past.
const HomeBand = ({ project }: { project: LocalizedProject }) => {
  const { t } = useTranslation();
  const ref = useRef<HTMLElement>(null);
  const imageReady = useAfterLoad();

  useScrollAnimation(ref, ({ gsap, mobile }) => {
    gsap.fromTo(
      '[data-band-media]',
      { yPercent: mobile ? -4 : -8 },
      {
        yPercent: mobile ? 4 : 8,
        ease: 'none',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      }
    );
  });

  return (
    <section id="image-band" ref={ref} className={styles.band}>
      <div className={styles.bandMedia} data-band-media>
        {imageReady && (
          <Image
            src={resolveImageUrl(project.thumbnail ?? '')}
            alt={t('home.landing.band.alt')}
            fill
            sizes="100vw"
            quality={85}
          />
        )}
      </div>
    </section>
  );
};

export default HomeBand;
