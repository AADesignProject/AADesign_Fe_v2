import React, { useMemo } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { Swiper as SwiperClass } from 'swiper/types';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import { motion } from 'framer-motion';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

// Components
import SEOHeaderComponent from '@/components/seo-header';

// Styles
import styles from '@/styles/construction-detail.module.scss';
import staticContent from '@/data/static-content.json';
import { resolveImageUrl } from '@/utils/resolveImageUrl';

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

const ConstructionDetail = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [thumbsSwiper, setThumbsSwiper] = React.useState<SwiperClass | null>(
    null
  );
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [lightboxOpen, setLightboxOpen] = React.useState(false);
  const projectId = Array.isArray(slug) ? slug[0] : slug;
  const project = useMemo(
    () =>
      (staticContent.projects as Project[]).find(
        (item) => item._id === projectId
      ),
    [projectId]
  );
  const isLoading = !router.isReady;

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingSpinner}></div>
      </div>
    );
  }

  if (!project || !project.images) {
    return (
      <div className={styles.error}>
        <h1>Project not found</h1>
        <button onClick={() => router.push('/construction')}>
          Back to Projects
        </button>
      </div>
    );
  }

  const allImages = [
    project.thumbnailMain,
    project.thumbnail,
    ...project.images,
  ].filter((image): image is string => Boolean(image));
  const heroImage = (project.thumbnailMain ||
    project.thumbnail ||
    allImages[0]) as string;
  const lightboxImage = allImages[activeIndex] as string;

  const goToPrev = () => {
    setActiveIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setActiveIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  React.useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setLightboxOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen]);

  return (
    <>
      <SEOHeaderComponent
        title={project.name}
        description={`Đây là dự án ${project.name} của ${project.type} thuộc về aa-design construction`}
        keywords={`${project.type}, ${project.name}, interior design, construction`}
      />

      <div className={styles.projectDetail}>
        {/* Hero Section */}
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
          </div>
        </div>

        {/* Gallery Section */}
        <section className={styles.gallerySection}>
          <div className={styles.galleryHeader}>
            <h2>Hình ảnh công trình</h2>
            <p>Khám phá chi tiết không gian qua bộ sưu tập hình ảnh</p>
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
                  <div
                    className={styles.slideWrapper}
                    onClick={() => setLightboxOpen(true)}
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
                      <span>Click vào ảnh to để xem toàn màn hình</span>
                    </div>
                  </div>
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
          <div className={styles.lightbox}>
            <button
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
