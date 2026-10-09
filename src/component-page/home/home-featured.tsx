import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

import styles from '@/scss/home-page.module.scss';
import { useAfterLoad, useScrollAnimation } from '@/utils/gsap';
import { getProjectSlug } from '@/utils/projectSlug';
import { resolveImageUrl } from '@/utils/resolveImageUrl';

import type { LocalizedProject } from './types';

type Slot = {
  id: string;
  shape: 'portrait' | 'wide';
  col: string; // desktop grid placement
  speed: number; // parallax travel in px: +/- decides direction and depth
  dropped?: boolean; // pushed down to stagger the row
};

// Asymmetric rows: tall and wide photos alternate, and each one drifts at its
// own pace while scrolling so the rows seem to sit at different depths.
export const featuredRows: Slot[][] = [
  [
    {
      id: '67f9ef7a6644672a6bf73b57',
      shape: 'portrait',
      col: '1 / span 5',
      speed: 44,
    },
    {
      id: '67f9f50f6644672a6bf73b87',
      shape: 'wide',
      col: '7 / span 6',
      speed: -36,
      dropped: true,
    },
  ],
  [
    {
      id: '67fa23db6644672a6bf73ba8',
      shape: 'wide',
      col: '1 / span 7',
      speed: 40,
    },
    {
      id: '67f9ed566644672a6bf73b4a',
      shape: 'portrait',
      col: '9 / span 4',
      speed: -48,
      dropped: true,
    },
  ],
  [
    {
      id: '67f9f0e06644672a6bf73b63',
      shape: 'portrait',
      col: '2 / span 4',
      speed: 36,
    },
    {
      id: '67f9f04f6644672a6bf73b5f',
      shape: 'wide',
      col: '7 / span 6',
      speed: -44,
      dropped: true,
    },
  ],
];

const shapes = {
  portrait: { ratio: '4 / 5', sizes: '(max-width: 767px) 86vw, 40vw' },
  wide: { ratio: '3 / 2', sizes: '(max-width: 767px) 100vw, 56vw' },
};

const HomeFeatured = ({ projects }: { projects: LocalizedProject[] }) => {
  const { t } = useTranslation();
  const ref = useRef<HTMLElement>(null);
  // Below-the-fold photos wait for the page's own resources (hero, fonts, JS)
  // so they never compete with them for bandwidth. The frame keeps its ratio.
  const imagesReady = useAfterLoad();

  useScrollAnimation(ref, ({ gsap, mobile }) => {
    ref.current
      ?.querySelectorAll<HTMLElement>('[data-speed]')
      .forEach((card) => {
        const shift = Number(card.dataset.speed) * (mobile ? 0.4 : 1);

        gsap.fromTo(
          card,
          { y: shift },
          {
            y: -shift,
            ease: 'none',
            // The row is the trigger: the card itself moves, which would skew
            // its own start/end positions.
            scrollTrigger: {
              trigger: card.parentElement,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        );
      });
  });

  const byId = new Map(projects.map((project) => [project._id, project]));

  return (
    <section id="featured-projects" ref={ref} className={styles.featured}>
      <div className={styles.featuredHead}>
        <h2 className={styles.sectionTitle}>
          {t('home.landing.featuredProjects.title')}
        </h2>
        <Link href="/construction" className={styles.textLink}>
          {t('home.landing.featuredProjects.viewAll')}
        </Link>
      </div>
      <div className={styles.featuredRows}>
        {featuredRows.map((row) => (
          <div className={styles.featuredRow} key={row[0].id}>
            {row.map((slot) => {
              const project = byId.get(slot.id);
              if (!project) return null;

              const shape = shapes[slot.shape];
              const source =
                slot.shape === 'portrait'
                  ? (project.thumbnailMain ?? project.thumbnail)
                  : project.thumbnail;

              return (
                <figure
                  key={slot.id}
                  className={`${styles.card} ${slot.dropped ? styles.dropped : ''}`}
                  style={{ ['--col' as string]: slot.col }}
                  data-speed={slot.speed}
                >
                  <Link href={`/construction/${getProjectSlug(project)}`}>
                    <span
                      className={styles.frame}
                      style={{ ['--ratio' as string]: shape.ratio }}
                    >
                      {imagesReady && (
                        <Image
                          src={resolveImageUrl(source ?? '')}
                          alt={`${project.displayName}, ${project.displayAddress}`}
                          fill
                          sizes={shape.sizes}
                          quality={85}
                        />
                      )}
                      <figcaption className={styles.caption}>
                        <span className={styles.captionName}>
                          {project.displayName}
                        </span>
                        <span className={styles.captionMeta}>
                          {project.displayAddress}
                        </span>
                        <span className={styles.captionMeta}>
                          {t('home.landing.featuredProjects.scopeLabel', {
                            type: t(`project.types.${project.type}`),
                          })}
                        </span>
                      </figcaption>
                    </span>
                  </Link>
                </figure>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
};

export default HomeFeatured;
