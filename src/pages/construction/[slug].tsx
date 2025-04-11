import React from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { Swiper as SwiperClass } from 'swiper/types';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import axiosInstance from '@/services/axios';
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

interface Project {
  _id: string;
  address: string;
  type: string;
  thumbnail: string;
  thumbnailMain: string;
  name: string;
  images: string[];
}

const ConstructionDetail = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [thumbsSwiper, setThumbsSwiper] = React.useState<SwiperClass | null>(
    null
  );

  const {
    data: project,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['project', slug],
    queryFn: async () => {
      const response = await axiosInstance.get<Project>(`/projects/${slug}`);
      return response.data;
    },
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingSpinner}></div>
      </div>
    );
  }

  if (isError || !project || !project.images) {
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
  ].filter(Boolean);

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
            {project.type}
          </motion.p>
        </div>

        {/* Image Slider */}
        <div className={styles.sliderContainer}>
          <Swiper
            spaceBetween={10}
            navigation={true}
            thumbs={{
              swiper:
                thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
            }}
            modules={[FreeMode, Navigation, Thumbs]}
            className={styles.mainSwiper}
          >
            {allImages.map((image, index) => (
              <SwiperSlide key={index}>
                <div className={styles.slideWrapper}>
                  <Image
                    src={`${process.env.NEXT_PUBLIC_LINK_S3}/${image}`}
                    alt={`${project.name} - Image ${index + 1}`}
                    width={1920}
                    height={1080}
                    quality={100}
                    priority={index === 0}
                  />
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
                      src={`${process.env.NEXT_PUBLIC_LINK_S3}/${image}`}
                      alt={`${project.name} - Thumbnail ${index + 1}`}
                      width={240}
                      height={135}
                      quality={80}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>
    </>
  );
};

export default ConstructionDetail;
