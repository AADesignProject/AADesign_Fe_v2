import Image from 'next/image';
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
      autoplay={{ delay: 5000 }}
      scrollbar={{ draggable: true }}
      loop={true}
      spaceBetween={50}
      slidesPerView={1}
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
            {/* {image.content && (
              <div className={styles.content}>{image.content}</div>
            )} */}
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default memo(CarouselComponent);
