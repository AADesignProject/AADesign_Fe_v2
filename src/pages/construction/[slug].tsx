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

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

import SEOHeaderComponent from '@/components/seo-header';
import styles from '@/styles/construction-detail.module.scss';
import staticContent from '@/data/static-content.json';
import { resolveImageUrl } from '@/utils/resolveImageUrl';
import { getProjectSlug } from '@/utils/projectSlug';

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

type ConstructionDetailProps = {
  locale: string;
  nextProject: Pick<Project, '_id' | 'name'> | null;
  prevProject: Pick<Project, '_id' | 'name'> | null;
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

  return {
    props: {
      locale,
      nextProject:
        currentIndex < projects.length - 1
          ? {
              _id: getProjectSlug(projects[currentIndex + 1]),
              name: projects[currentIndex + 1].name,
            }
          : null,
      prevProject:
        currentIndex > 0
          ? {
              _id: getProjectSlug(projects[currentIndex - 1]),
              name: projects[currentIndex - 1].name,
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
  const [thumbsSwiper, setThumbsSwiper] = React.useState<SwiperClass | null>(
    null
  );
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [lightboxOpen, setLightboxOpen] = React.useState(false);
  const closeButtonRef = React.useRef<HTMLButtonElement>(null);
  const previousFocusRef = React.useRef<HTMLElement | null>(null);

  const detailCopy = useMemo(
    () =>
      locale === 'en'
        ? {
            back: 'Back to projects',
            fullscreenHint: 'Click to view fullscreen',
            galleryDescription: 'Explore the project through the image gallery',
            galleryTitle: 'Project gallery',
            next: 'Next project',
            previous: 'Previous project',
          }
        : {
            back: 'Quay lại danh sách',
            fullscreenHint: 'Click vào ảnh để xem toàn màn hình',
            galleryDescription:
              'Khám phá chi tiết không gian qua bộ sưu tập hình ảnh',
            galleryTitle: 'Hình ảnh công trình',
            next: 'Dự án tiếp theo',
            previous: 'Dự án trước',
          },
    [locale]
  );

  const seoDescription =
    locale === 'en'
      ? `${project.name} is one of AA Design's ${project.type} projects, showcasing the design language, materials, and completed spaces in detail.`
      : `${project.name} là một trong những công trình ${project.type} của AA Design, giới thiệu chi tiết phong cách thiết kế, vật liệu và không gian hoàn thiện.`;

  const overviewFacts = [
    {
      label: locale === 'en' ? 'Project type' : 'Loại công trình',
      value: project.type,
    },
    {
      label: locale === 'en' ? 'Location' : 'Địa điểm',
      value: project.address,
    },
    {
      label: locale === 'en' ? 'Scope' : 'Hạng mục',
      value: locale === 'en' ? 'Design & construction' : 'Thiết kế & thi công',
    },
    {
      label: locale === 'en' ? 'Style' : 'Phong cách',
      value: locale === 'en' ? 'Refined modern' : 'Hiện đại, tinh tế',
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
        title={project.name}
        description={seoDescription}
        keywords={`${project.type}, ${project.name}, interior design, construction`}
        image={toAbsoluteImageUrl(heroImage)}
        breadcrumbs={[
          { name: locale === 'en' ? 'Home' : 'Trang chủ', url: '/' },
          {
            name: locale === 'en' ? 'Projects' : 'Công trình',
            url: '/construction',
          },
          {
            name: project.name,
            url: `/construction/${getProjectSlug(project)}`,
          },
        ]}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'CreativeWork',
          name: project.name,
          description: seoDescription,
          image: allImages.map((item) => toAbsoluteImageUrl(item)),
          locationCreated: project.address,
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
              alt={project.name}
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
              {project.name}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {project.address}
            </motion.p>
            <motion.span
              className={styles.heroTag}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
            >
              {project.type}
            </motion.span>
            <div className={styles.heroActions}>
              <Link href="/construction" className={styles.backButton}>
                {detailCopy.back}
              </Link>
              <div className={styles.navButtons}>
                {prevProject ? (
                  <Link
                    className={styles.navButton}
                    href={`/construction/${prevProject._id}`}
                  >
                    <span className={styles.navLabel}>
                      {detailCopy.previous}
                    </span>
                    <span className={styles.navName}>{prevProject.name}</span>
                  </Link>
                ) : (
                  <span className={`${styles.navButton} ${styles.disabled}`}>
                    <span className={styles.navLabel}>
                      {detailCopy.previous}
                    </span>
                  </span>
                )}
                {nextProject ? (
                  <Link
                    className={styles.navButton}
                    href={`/construction/${nextProject._id}`}
                  >
                    <span className={styles.navLabel}>{detailCopy.next}</span>
                    <span className={styles.navName}>{nextProject.name}</span>
                  </Link>
                ) : (
                  <span className={`${styles.navButton} ${styles.disabled}`}>
                    <span className={styles.navLabel}>{detailCopy.next}</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <section className={styles.overviewSection}>
          <div className={styles.overviewCopy}>
            <span>Project notes</span>
            <h2>{project.name}</h2>
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
            <h2>{detailCopy.galleryTitle}</h2>
            <p>{detailCopy.galleryDescription}</p>
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
                    aria-label={`${detailCopy.fullscreenHint}: ${project.name} ${index + 1}`}
                  >
                    <Image
                      src={resolveImageUrl(image)}
                      alt={`${project.name} - Image ${index + 1}`}
                      width={1920}
                      height={1080}
                      quality={90}
                      sizes="(max-width: 768px) 90vw, (max-width: 1200px) 80vw, 1200px"
                      priority={index === 0}
                    />
                    <div className={styles.slideOverlay}>
                      <span>{detailCopy.fullscreenHint}</span>
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
                        alt={`${project.name} - Thumbnail ${index + 1}`}
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
            aria-label={detailCopy.galleryTitle}
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
              aria-label="Đóng"
            >
              ×
            </button>
            <button
              type="button"
              className={styles.lightboxNavLeft}
              onClick={goToPrev}
              aria-label="Ảnh trước"
            >
              ‹
            </button>
            <div className={styles.lightboxImage}>
              <Image
                src={resolveImageUrl(lightboxImage)}
                alt={`${project.name} - Fullscreen ${activeIndex + 1}`}
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
              aria-label="Ảnh sau"
            >
              ›
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default ConstructionDetail;
