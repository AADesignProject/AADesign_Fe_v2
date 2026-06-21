import Image from 'next/image';
import React, { memo, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

//styles
import styles from '@/scss/home-page.module.scss';
import staticContent from '@/data/static-content.json';
import { resolveImageUrl } from '@/utils/resolveImageUrl';

type TDataImageBannerSmallProps = {
  title: string;
  url: string;
  _id: string;
};

const DesignServiceComponentPage = () => {
  const [isInView, setIsInView] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);

  const dataImageBannersSmall =
    staticContent.bannerSmall as TDataImageBannerSmallProps[];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className={styles.designService}
    >
      <div className={styles.container}>
        <div className={styles.textContent}>
          <span className={styles.title}>What we offer</span>
          <h2 className={styles.subTitle}>
            Giải Pháp Thiết Kế Toàn Diện
            <br />
            Kiến Tạo Không Gian, Hiện Thực Ý Tưởng
          </h2>
          <p className={styles.descriptionTitle}>
            Tái định nghĩa không gian - nâng tầm trải nghiệm sống
          </p>
          <p className={styles.description}>
            Chúng tôi cung cấp một gói dịch vụ thiết kế nội - ngoại thất trọn
            gói, bao gồm từ lên ý tưởng, dựng bản thiết kế 3D cho đến lựa chọn
            các phụ kiện trang trí cao cấp, giúp không gian của bạn trở nên hoàn
            mỹ nhất. <br />
            Với sự tận tâm và tỉ mỉ chúng tôi tạo ra những không gian tinh tế và
            độc đáo, từ biệt thự, căn hộ cá nhân đến các dự án nhà hàng, khách
            sạn và văn phòng làm việc chuyên nghiệp. Mỗi dự án đều là sự kết hợp
            hài hòa giữa sáng tạo, công năng và phong cách riêng của khách hàng.
          </p>
          <div className={styles.containerNumberInfo}>
            <div className={styles.boxContent}>
              <span className={styles.number}>20+</span>
              <span className={styles.note}>Năm kinh nghiệm</span>
            </div>
            <div className={styles.boxContent}>
              <span className={styles.number}>100+</span>
              <span className={styles.note}>Công trình</span>
            </div>
            <div className={styles.boxContent}>
              <span className={styles.number}>3D</span>
              <span className={styles.note}>Trực quan hóa</span>
            </div>
          </div>
        </div>

        <div className={styles.imageContent}>
          <div className={styles.listImageLeft}>
            <Image
              src={resolveImageUrl(dataImageBannersSmall?.[0]?.url || '')}
              alt={dataImageBannersSmall?.[0]?.title || 'Không gian thiết kế 1'}
              width={200}
              height={400}
              className={styles.image0}
              sizes="(max-width: 768px) 45vw, 200px"
              quality={85}
            />

            <Image
              src={resolveImageUrl(dataImageBannersSmall?.[1]?.url || '')}
              alt={dataImageBannersSmall?.[1]?.title || 'Không gian thiết kế 2'}
              height={200}
              width={130}
              sizes="(max-width: 768px) 35vw, 130px"
              quality={85}
            />
          </div>
          <div className={styles.listImageRight}>
            <Image
              src={resolveImageUrl(dataImageBannersSmall?.[2]?.url || '')}
              alt={dataImageBannersSmall?.[2]?.title || 'Không gian thiết kế 3'}
              height={300}
              width={200}
              sizes="(max-width: 768px) 45vw, 200px"
              quality={85}
            />
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default memo(DesignServiceComponentPage);
