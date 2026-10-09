import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

// Components
import SEOHeaderComponent from '@/components/seo-header';

// Styles
import styles from '@/styles/profile.module.scss';
import {
  parseStat,
  useCountUp,
  useReveal,
  useScrollAnimation,
} from '@/utils/gsap';

type Stat = { label: string; value: string };
type Principle = { description: string; title: string };

// Local photos of finished AA Design work (no stock photography).
const images = {
  hero: '/images/project/banners/1743410060872-coover_3.webp',
  story: '/images/project/banners/1743410060884-coover_2_1.webp',
  scope: '/images/project/biet_thu_au_co/1744345135709-p_tho_4.webp',
};

const pad = (index: number) => String(index + 1).padStart(2, '0');

const ProfilePage = () => {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);

  const stats = t('profile.stats', { returnObjects: true }) as Stat[];
  const paragraphs = t('profile.story.paragraphs', {
    returnObjects: true,
  }) as string[];
  const principles = t('profile.philosophy.items', {
    returnObjects: true,
  }) as Principle[];
  const types = t('home.landing.services.types', {
    returnObjects: true,
  }) as string[];

  useReveal(ref);
  useCountUp(ref);

  // The hero and story photos drift slowly against the page as it scrolls.
  useScrollAnimation(ref, ({ gsap, mobile }) => {
    ref.current
      ?.querySelectorAll<HTMLElement>('[data-parallax]')
      .forEach((node) => {
        gsap.fromTo(
          node,
          { yPercent: mobile ? -3 : -6 },
          {
            yPercent: mobile ? 3 : 6,
            ease: 'none',
            scrollTrigger: {
              trigger: node.parentElement,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        );
      });
  });

  return (
    <>
      <SEOHeaderComponent
        title={t('seo.title_profile')}
        description={t('seo.description_profile')}
        keywords={t('seo.keywords_profile')}
        breadcrumbs={[
          { name: t('breadcrumbs.home'), url: '/' },
          { name: t('header.menu.introduction'), url: '/profile' },
        ]}
      />

      <div ref={ref}>
        <section className={styles.hero}>
          <div className={styles.heroText}>
            <span className={styles.eyebrow}>{t('profile.hero.eyebrow')}</span>
            <h1>{t('profile.hero.title')}</h1>
            <p className={styles.lead}>{t('profile.hero.lead')}</p>
            <div className={styles.signature}>
              <span>{t('profile.hero.founder')}</span>
              <strong>{t('profile.hero.name')}</strong>
              <em>{t('profile.hero.role')}</em>
            </div>
          </div>
          <div className={styles.heroFrame}>
            <div className={styles.heroMedia}>
              <div className={styles.parallax} data-parallax>
                <Image
                  src={images.hero}
                  alt={t('profile.hero.imageAlt')}
                  fill
                  priority
                  quality={85}
                  // The wide photo is cropped to a portrait arch, so the file
                  // has to be ~2.2x wider than the frame to stay sharp.
                  sizes="(max-width: 900px) 220vw, 1200px"
                />
              </div>
            </div>
          </div>
        </section>

        <section className={styles.stats}>
          <ul className={styles.statsInner}>
            {stats.map((stat) => {
              const { number, suffix } = parseStat(stat.value);
              return (
                <li key={stat.label} data-reveal>
                  <strong data-count={number} data-suffix={suffix}>
                    {stat.value}
                  </strong>
                  <span>{stat.label}</span>
                </li>
              );
            })}
          </ul>
        </section>

        <section className={styles.story}>
          <div className={styles.storyInner}>
            <span className={styles.eyebrow}>{t('profile.story.eyebrow')}</span>
            <div className={styles.storyBody} data-reveal>
              <h2>{t('profile.story.title')}</h2>
              <p className={styles.storyLead}>{t('profile.story.lead')}</p>
              <div className={styles.storyColumns}>
                {paragraphs.map((text) => (
                  <p key={text}>{text}</p>
                ))}
              </div>
            </div>
            <figure className={styles.storyFigure} data-reveal>
              <div className={styles.parallax} data-parallax>
                <Image
                  src={images.story}
                  alt={t('profile.story.imageAlt')}
                  fill
                  quality={80}
                  sizes="(max-width: 1440px) 100vw, 1440px"
                />
              </div>
            </figure>
          </div>
        </section>

        <section className={styles.philosophy}>
          <div className={styles.philosophyInner}>
            <span className={styles.eyebrow}>
              {t('profile.philosophy.eyebrow')}
            </span>
            <h2 data-reveal>{t('profile.philosophy.title')}</h2>
            <ol className={styles.principles}>
              {principles.map((item, index) => (
                <li key={item.title} data-reveal>
                  <span>{pad(index)}</span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className={styles.scope}>
          <div className={styles.scopeInner}>
            <figure className={styles.scopeFigure} data-reveal>
              <Image
                src={images.scope}
                alt={t('profile.scope.imageAlt')}
                fill
                quality={80}
                sizes="(max-width: 900px) 100vw, 560px"
              />
            </figure>
            <div className={styles.scopeBody}>
              <h2 data-reveal>{t('home.landing.services.typesTitle')}</h2>
              <ol className={styles.types}>
                {types.map((type, index) => (
                  <li key={type} data-reveal>
                    <span>{pad(index)}</span>
                    {type}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className={styles.cta}>
          <div className={styles.ctaInner}>
            <h2 data-reveal>{t('profile.quote')}</h2>
            <div className={styles.ctaActions}>
              <Link href="/contact" className={styles.ctaButton}>
                {t('home.landing.hero.primaryCta')}
              </Link>
              <Link href="/construction" className={styles.ctaLink}>
                {t('home.landing.hero.secondaryCta')}
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ProfilePage;
