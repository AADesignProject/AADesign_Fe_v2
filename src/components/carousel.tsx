import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
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
      {dataImageBanners?.map((data, index) => {
        const title = t(`static.banners.${data._id}.title`, {
          defaultValue: data.title,
        });
        const description = t(`static.banners.${data._id}.description`, {
          defaultValue: data.description,
        });

        return (
          <SwiperSlide key={data._id}>
            <div className={styles.slide}>
              <Image
                src={resolveImageUrl(data?.url)}
                alt={title}
                width={1920}
                height={1080}
                quality={85}
                sizes="100vw"
                priority={index === 0}
              />
              <div className={styles.overlay} />
              <div className={styles.content}>
                <span className={styles.eyebrow}>
                  {t('home.carousel.eyebrow')}
                </span>
                {index === 0 ? (
                  <h1>{t('home.carousel.heroTitle')}</h1>
                ) : (
                  <h2>{title}</h2>
                )}
                <p>{description}</p>
                <div className={styles.actions}>
                  <Link href="/construction">
                    {t('home.carousel.actions.projects')}
                  </Link>
                  <Link href="/contact">
                    {t('home.carousel.actions.consult')}
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

export default memo(CarouselComponent);
