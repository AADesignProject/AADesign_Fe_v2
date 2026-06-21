import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { memo } from 'react';

//components
import staticContent from '@/data/static-content.json';
import { resolveImageUrl } from '@/utils/resolveImageUrl';

//scss
import 'swiper/css/bundle';
import 'swiper/css/autoplay';
import styles from '@/scss/carousel.module.scss';

type TDataImageBannerProps = {
  description: string;
  title: string;
  url: string;
  _id: string;
};

const CarouselComponent = () => {
  const dataImageBanners = staticContent.banners as TDataImageBannerProps[];

  return (
    <Swiper
      modules={[Autoplay]}
      autoplay={{ delay: 6500, disableOnInteraction: false }}
      scrollbar={{ draggable: true }}
      loop={true}
      spaceBetween={50}
      slidesPerView={1}
      aria-label="AA Design featured projects"
    >
      {dataImageBanners?.map((data, index) => (
        <SwiperSlide key={index}>
          <div className={styles.slide}>
            <Image
              src={resolveImageUrl(data?.url)}
              alt={data.title}
              width={1920}
              height={1080}
              quality={85}
              sizes="100vw"
              priority={index === 0}
            />
            <div className={styles.overlay} />
            <div className={styles.content}>
              <span className={styles.eyebrow}>AA Design Studio</span>
              {index === 0 ? (
                <h1>Thiết kế nội thất cao cấp, thi công trọn gói</h1>
              ) : (
                <h2>{data.title}</h2>
              )}
              <p>{data.description}</p>
              <div className={styles.actions}>
                <Link href="/construction">Xem công trình</Link>
                <Link href="/contact">Tư vấn dự án</Link>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default memo(CarouselComponent);
