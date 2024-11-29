import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { memo } from 'react';

//scss
import 'swiper/css/bundle';
import 'swiper/css/autoplay';
import styles from '@/scss/carousel.module.scss';

interface ICarouselComponentProps {
  images: { src: string; content?: React.ReactNode }[];
}

const CarouselComponent = ({ images }: ICarouselComponentProps) => {
  return (
    <Swiper
      modules={[Autoplay]}
      autoplay={{ delay: 5000 }}
      scrollbar={{ draggable: true }}
      loop={true}
      spaceBetween={50}
      slidesPerView={1}
    >
      {images.map((image, index) => (
        <SwiperSlide key={index}>
          <div className={styles.slide}>
            <Image
              src={image.src}
              alt={`image-${index}`}
              width={1920}
              height={1080}
              quality={100}
            />
            {image.content && (
              <div className={styles.content}>{image.content}</div>
            )}
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default memo(CarouselComponent);
