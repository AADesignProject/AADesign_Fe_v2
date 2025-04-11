import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { memo } from 'react';
import { useQuery } from '@tanstack/react-query';

//components
import axiosInstance from '@/services/axios';
import { listApiUrl } from '@/utils/apiUrl';

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

const fetchImages = async () => {
  const { data } = await axiosInstance.get(listApiUrl.banner);
  return data;
};

const CarouselComponent = () => {
  const { data: dataImageBanners } = useQuery<TDataImageBannerProps[]>({
    queryKey: ['images-banner'],
    queryFn: fetchImages,
  });

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
              src={`${process.env.NEXT_PUBLIC_LINK_S3}/${data?.url}`}
              alt={data.title}
              width={1920}
              height={1080}
              quality={100}
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
