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
import styles from '@/scss/construction-detail.module.scss';
import staticContent from '@/data/static-content.json';
import { resolveImageUrl } from '@/utils/resolveImageUrl';
import { siteUrl } from '@/utils/siteUrl';
import { businessId } from '@/utils/businessSchema';
import { getProjectSlug } from '@/utils/projectSlug';
import { getLocalizedProject } from '@/utils/localizedProject';
import { getLocaleContent, getProjectContent } from '@/utils/projectContent';
import { getImageAlt, getProjectSeo } from '@/utils/projectSeo';

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

type NavigationProject = { slug: string; name: string };

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
            slug: getProjectSlug(nextProject),
            name: getLocalizedProject(nextProject, locale).displayName,
          }
        : null,
      prevProject: prevProject
        ? {
            slug: getProjectSlug(prevProject),
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
  const { area, year } = getProjectContent(project._id);
  const localeContent = getLocaleContent(project._id, locale);
  const descriptionParagraphs = (localeContent.description ?? '')
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  // Only facts that have real data are listed; nothing is shown as a placeholder.
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
      label: t('construction.detail.facts.area'),
      value: area ? `${area} m²` : '',
    },
    {
      label: t('construction.detail.facts.year'),
      value: year ? String(year) : '',
    },
    {
      label: t('construction.detail.facts.style'),
      value: localeContent.style ?? '',
    },
    {
      label: t('construction.detail.facts.materials'),
      value: localeContent.materials ?? '',
    },
    {
      label: t('construction.detail.facts.highlights'),
      value: localeContent.highlights ?? '',
    },
  ].filter((fact) => fact.value);

  const allImages = [
    project.thumbnailMain,
    project.thumbnail,
    ...project.images,
  ]
    .filter((image): image is string => Boolean(image))
    .filter((image, index, collection) => collection.indexOf(image) === index);
  // Landscape `thumbnail` first: `thumbnailMain` is often portrait and blurs
  // when stretched across a full-width hero.
  const heroImage = (project.thumbnail ||
    project.thumbnailMain ||
    allImages[0]) as string;
  const lightboxImage = allImages[activeIndex] as string;
  const seo = getProjectSeo(t, localizedProject, {
    description: descriptionParagraphs[0],
    imageCount: allImages.length,
    locale,
  });
  const imageAlt = (image: string) =>
    getImageAlt(t, localizedProject, image, allImages.indexOf(image));
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
        title={seo.title}
        description={seo.description}
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
          description: seo.description,
          inLanguage: locale,
          dateModified: getProjectContent(project._id).updatedAt,
          image: allImages.map((item) => toAbsoluteImageUrl(item)),
          locationCreated: {
            '@type': 'Place',
            name: localizedProject.displayAddress,
          },
          // Same @id as the home page node (one entity); type + name so this
          // page's JSON-LD also validates without resolving that node.
          creator: {
            '@type': 'HomeAndConstructionBusiness',
            '@id': businessId,
            name: 'AA Design',
          },
        }}
      />

      <div className={styles.projectDetail}>
        <div className={styles.hero}>
          <div className={styles.heroImage}>
            <Image
              src={resolveImageUrl(heroImage)}
              alt={imageAlt(heroImage)}
              fill
              priority
              quality={90}
              sizes="(orientation: portrait) 150vh, 100vw"
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
                    href={`/construction/${prevProject.slug}`}
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
                    href={`/construction/${nextProject.slug}`}
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
            <h2>{t('construction.detail.overviewTitle')}</h2>
            {descriptionParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
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
                      alt={imageAlt(image)}
                      width={1920}
                      height={1080}
                      quality={90}
                      sizes="(max-width: 1344px) 100vw, 1344px"
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
                        alt=""
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
                alt={imageAlt(lightboxImage)}
                fill
                sizes="(max-width: 1240px) 92vw, 1240px"
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
