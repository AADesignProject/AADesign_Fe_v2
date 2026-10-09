import { Fragment, useRef } from 'react';
import { getImageProps } from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

import styles from '@/scss/home-page.module.scss';
import { useScrollAnimation } from '@/utils/gsap';
import { getProjectSlug } from '@/utils/projectSlug';
import { resolveImageUrl } from '@/utils/resolveImageUrl';

import type { LocalizedProject } from './types';

// Portrait phones only show the middle band of the wide photo, so they get a
// pre-cropped file (a fraction of the weight) instead of the 1920px original.
const mobileHeroImage = '/images/hero/hero-mobile.webp';

const HomeHero = ({ project }: { project: LocalizedProject }) => {
  const { t } = useTranslation();
  const ref = useRef<HTMLElement>(null);

  // Slow zoom/drift of the photo and a gentle lift of the title as you scroll.
  useScrollAnimation(ref, ({ gsap, mobile }) => {
    const scrollTrigger = {
      trigger: ref.current,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    };

    gsap.fromTo(
      '[data-hero-media]',
      { yPercent: 0, scale: 1 },
      {
        yPercent: mobile ? 4 : 8,
        scale: mobile ? 1.05 : 1.12,
        ease: 'none',
        scrollTrigger,
      }
    );
    gsap.to('[data-hero-content]', {
      yPercent: mobile ? -6 : -14,
      opacity: 0,
      ease: 'none',
      scrollTrigger,
    });
  });

  const titleLines = t('home.landing.hero.titleLines', {
    returnObjects: true,
  }) as string[];

  // Landscape `thumbnail` on purpose: `thumbnailMain` is often portrait.
  const { props } = getImageProps({
    src: resolveImageUrl(project.thumbnail ?? ''),
    alt: `${t('home.landing.hero.imageAlt')} - ${project.displayName}`,
    width: 1920,
    height: 1200,
    priority: true,
    quality: 85,
    sizes: '(orientation: portrait) 200vh, 100vw',
  });
  // React 18 only knows the lowercase attribute name.
  const { fetchPriority, ...image } = props;

  return (
    <section id="hero" ref={ref} className={styles.heroSection}>
      <div className={styles.heroMedia} data-hero-media>
        <picture>
          <source
            media="(max-width: 767px)"
            srcSet={mobileHeroImage}
            type="image/webp"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            {...image}
            {...{ fetchpriority: fetchPriority }}
            alt={image.alt}
            className={styles.heroImage}
          />
        </picture>
      </div>
      <div className={styles.heroOverlay} />
      <div className={styles.heroContent} data-hero-content>
        <h1>
          {titleLines.map((line, index) => (
            <Fragment key={line}>
              <span className={styles.heroLine}>
                <span style={{ ['--line' as string]: index }}>{line}</span>
              </span>{' '}
            </Fragment>
          ))}
        </h1>
        <div className={styles.heroFoot}>
          <div className={styles.heroActions}>
            <Link href="/contact" className={styles.heroCta}>
              {t('home.landing.hero.primaryCta')}
            </Link>
            <Link href="/construction" className={styles.heroLink}>
              {t('home.landing.hero.secondaryCta')}
            </Link>
          </div>
          <Link
            href={`/construction/${getProjectSlug(project)}`}
            className={styles.heroCaption}
          >
            <span>{t('home.landing.hero.metaProject')}</span>
            <strong>{project.displayName}</strong>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomeHero;
