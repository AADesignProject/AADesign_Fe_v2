import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
} from 'next';
import React, { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper as SwiperClass } from 'swiper/types';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

import SEOHeaderComponent from '@/components/seo-header';
import styles from '@/styles/construction-detail.module.scss';
import staticContent from '@/data/static-content.json';
import { resolveImageUrl } from '@/utils/resolveImageUrl';
import { getProjectSlug } from '@/utils/projectSlug';
import { getLocalizedProject } from '@/utils/localizedProject';

interface Project {
  _id: string;
  address: string;
  type: string;
  thumbnail: string;
  thumbnailMain?: string;
  name: string;
  images: string[];
  isTypical?: boolean;
  typical?: boolean;
}

type NavigationProject = Pick<Project, '_id' | 'name'>;

type ConstructionDetailProps = {
  locale: string;
  nextProject: NavigationProject | null;
  prevProject: NavigationProject | null;
  project: Project;
};

export const getStaticPaths: GetStaticPaths = async ({ locales = [] }) => {
  const projects = staticContent.projects as Project[];
  const targetLocales = locales.length > 0 ? locales : ['vi'];

  return {
    paths: projects.flatMap((project) =>
      targetLocales.map((locale) =>
        locale === 'vi'
          ? {
              params: { slug: getProjectSlug(project) },
            }
          : {
              locale,
              params: { slug: getProjectSlug(project) },
            }
      )
    ),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<ConstructionDetailProps> = async ({
  locale = 'vi',
  params,
}) => {
  const projects = staticContent.projects as Project[];
  const projectId = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;
  const currentIndex = projects.findIndex(
    (item) => item._id === projectId || getProjectSlug(item) === projectId
  );
  const project = currentIndex >= 0 ? projects[currentIndex] : null;

  if (!project || !project.images) {
    return {
      notFound: true,
    };
  }

  const nextProject =
    currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null;
  const prevProject = currentIndex > 0 ? projects[currentIndex - 1] : null;

  return {
    props: {
      locale,
      nextProject: nextProject
        ? {
            _id: getProjectSlug(nextProject),
            name: getLocalizedProject(nextProject, locale).displayName,
          }
        : null,
      prevProject: prevProject
        ? {
            _id: getProjectSlug(prevProject),
            name: getLocalizedProject(prevProject, locale).displayName,
          }
        : null,
      project,
    },
  };
};

const ConstructionDetail = ({
  locale,
  nextProject,
  prevProject,
  project,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation();
  const [thumbsSwiper, setThumbsSwiper] = React.useState<SwiperClass | null>(
    null
  );
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [lightboxOpen, setLightboxOpen] = React.useState(false);
  const closeButtonRef = React.useRef<HTMLButtonElement>(null);
  const previousFocusRef = React.useRef<HTMLElement | null>(null);
  const localizedProject = useMemo(
    () => getLocalizedProject(project, locale),
    [locale, project]
  );
  const projectTypeLabel = t(`project.types.${project.type}`, {
    defaultValue: project.type,
  });
  const seoDescription = t('construction.detail.seoDescription', {
    name: localizedProject.displayName,
    type: projectTypeLabel,
  });

  const overviewFacts = [
    {
      label: t('construction.detail.facts.type'),
      value: projectTypeLabel,
    },
    {
      label: t('construction.detail.facts.location'),
      value: localizedProject.displayAddress,
    },
    {
      label: t('construction.detail.facts.scope'),
      value: t('construction.detail.facts.scopeValue'),
    },
    {
      label: t('construction.detail.facts.style'),
      value: t('construction.detail.facts.styleValue'),
    },
  ];

  const allImages = [
    project.thumbnailMain,
    project.thumbnail,
    ...project.images,
  ]
    .filter((image): image is string => Boolean(image))
    .filter((image, index, collection) => collection.indexOf(image) === index);
  const heroImage = (project.thumbnailMain ||
    project.thumbnail ||
    allImages[0]) as string;
  const lightboxImage = allImages[activeIndex] as string;
  const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL || 'https://aa-design.vn'
  ).replace(/\/$/, '');
  const toAbsoluteImageUrl = (image: string) => {
    const resolvedImage = resolveImageUrl(image);
    return resolvedImage.startsWith('http')
      ? resolvedImage
      : `${siteUrl}${resolvedImage}`;
  };

  const goToPrev = React.useCallback(() => {
    setActiveIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  }, [allImages.length]);

  const goToNext = React.useCallback(() => {
    setActiveIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  }, [allImages.length]);

  React.useEffect(() => {
    if (!lightboxOpen) return;

    previousFocusRef.current = document.activeElement as HTMLElement;
    closeButtonRef.current?.focus();
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setLightboxOpen(false);
      }
      if (event.key === 'ArrowLeft') {
        goToPrev();
      }
      if (event.key === 'ArrowRight') {
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      previousFocusRef.current?.focus();
    };
  }, [goToNext, goToPrev, lightboxOpen]);

  return (
    <>
      <SEOHeaderComponent
        title={localizedProject.displayName}
        description={seoDescription}
        keywords={`${projectTypeLabel}, ${localizedProject.displayName}, interior design, construction`}
        image={toAbsoluteImageUrl(heroImage)}
        breadcrumbs={[
          { name: t('breadcrumbs.home'), url: '/' },
          {
            name: t('construction.title'),
            url: '/construction',
          },
          {
            name: localizedProject.displayName,
            url: `/construction/${getProjectSlug(project)}`,
          },
        ]}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'CreativeWork',
          name: localizedProject.displayName,
          description: seoDescription,
          image: allImages.map((item) => toAbsoluteImageUrl(item)),
          locationCreated: localizedProject.displayAddress,
          creator: {
            '@type': 'Organization',
            name: 'AA Design',
          },
        }}
      />

      <div className={styles.projectDetail}>
        <div className={styles.hero}>
          <div className={styles.heroImage}>
            <Image
              src={resolveImageUrl(heroImage)}
              alt={localizedProject.displayName}
              fill
              priority
              quality={90}
              sizes="100vw"
            />
          </div>
          <div className={styles.heroOverlay} />
          <div className={styles.heroContent}>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {localizedProject.displayName}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {localizedProject.displayAddress}
            </motion.p>
            <motion.span
              className={styles.heroTag}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
            >
              {projectTypeLabel}
            </motion.span>
            <div className={styles.heroActions}>
              <Link href="/construction" className={styles.backButton}>
                {t('construction.detail.back')}
              </Link>
              <div className={styles.navButtons}>
                {prevProject ? (
                  <Link
                    className={styles.navButton}
                    href={`/construction/${prevProject._id}`}
                  >
                    <span className={styles.navLabel}>
                      {t('construction.detail.previous')}
                    </span>
                    <span className={styles.navName}>{prevProject.name}</span>
                  </Link>
                ) : (
                  <span className={`${styles.navButton} ${styles.disabled}`}>
                    <span className={styles.navLabel}>
                      {t('construction.detail.previous')}
                    </span>
                  </span>
                )}
                {nextProject ? (
                  <Link
                    className={styles.navButton}
                    href={`/construction/${nextProject._id}`}
                  >
                    <span className={styles.navLabel}>
                      {t('construction.detail.next')}
                    </span>
                    <span className={styles.navName}>{nextProject.name}</span>
                  </Link>
                ) : (
                  <span className={`${styles.navButton} ${styles.disabled}`}>
                    <span className={styles.navLabel}>
                      {t('construction.detail.next')}
                    </span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <section className={styles.overviewSection}>
          <div className={styles.overviewCopy}>
            <span>{t('construction.detail.overviewLabel')}</span>
            <h2>{localizedProject.displayName}</h2>
            <p>{seoDescription}</p>
          </div>
          <dl className={styles.factList}>
            {overviewFacts.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className={styles.gallerySection}>
          <div className={styles.galleryHeader}>
            <h2>{t('construction.detail.galleryTitle')}</h2>
            <p>{t('construction.detail.galleryDescription')}</p>
          </div>
          <div className={styles.sliderContainer}>
            <Swiper
              spaceBetween={10}
              navigation={true}
              onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
              thumbs={{
                swiper:
                  thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
              }}
              modules={[FreeMode, Navigation, Thumbs]}
              className={styles.mainSwiper}
            >
              {allImages.map((image, index) => (
                <SwiperSlide key={index}>
                  <button
                    type="button"
                    className={styles.slideWrapper}
                    onClick={() => setLightboxOpen(true)}
                    aria-label={`${t('construction.detail.fullscreenHint')}: ${localizedProject.displayName} ${index + 1}`}
                  >
                    <Image
                      src={resolveImageUrl(image)}
                      alt={`${localizedProject.displayName} - Image ${index + 1}`}
                      width={1920}
                      height={1080}
                      quality={90}
                      sizes="(max-width: 768px) 90vw, (max-width: 1200px) 80vw, 1200px"
                      priority={index === 0}
                    />
                    <div className={styles.slideOverlay}>
                      <span>{t('construction.detail.fullscreenHint')}</span>
                    </div>
                  </button>
                </SwiperSlide>
              ))}
            </Swiper>

            {allImages.length > 1 && (
              <Swiper
                onSwiper={(swiper) => setThumbsSwiper(swiper)}
                spaceBetween={10}
                slidesPerView="auto"
                freeMode={true}
                watchSlidesProgress={true}
                modules={[FreeMode, Navigation, Thumbs]}
                className={styles.thumbsSwiper}
              >
                {allImages.map((image, index) => (
                  <SwiperSlide key={index}>
                    <div className={styles.thumbWrapper}>
                      <Image
                        src={resolveImageUrl(image)}
                        alt={`${localizedProject.displayName} - Thumbnail ${index + 1}`}
                        width={240}
                        height={135}
                        quality={80}
                        sizes="120px"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>
        </section>
        {lightboxOpen && (
          <div
            className={styles.lightbox}
            role="dialog"
            aria-modal="true"
            aria-label={t('construction.detail.galleryTitle')}
            onClick={(event) => {
              if (event.target === event.currentTarget) {
                setLightboxOpen(false);
              }
            }}
          >
            <button
              ref={closeButtonRef}
              type="button"
              className={styles.lightboxClose}
              onClick={() => setLightboxOpen(false)}
              aria-label={t('aria.close')}
            >
              x
            </button>
            <button
              type="button"
              className={styles.lightboxNavLeft}
              onClick={goToPrev}
              aria-label={t('aria.previousImage')}
            >
              {'‹'}
            </button>
            <div className={styles.lightboxImage}>
              <Image
                src={resolveImageUrl(lightboxImage)}
                alt={`${localizedProject.displayName} - Fullscreen ${activeIndex + 1}`}
                fill
                sizes="(max-width: 1200px) 92vw, 1200px"
                quality={90}
              />
              <div className={styles.lightboxCounter}>
                {activeIndex + 1} / {allImages.length}
              </div>
            </div>
            <button
              type="button"
              className={styles.lightboxNavRight}
              onClick={goToNext}
              aria-label={t('aria.nextImage')}
            >
              {'›'}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default ConstructionDetail;
