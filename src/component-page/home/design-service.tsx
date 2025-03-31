import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

//styles
import styles from '@/scss/home-page.module.scss';

const DesignServiceComponentPage = () => {
  const [isInView, setIsInView] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);

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
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className={styles.designService}
    >
      <div className={styles.container}>
        <div className={styles.textContent}>
          {/* <h2 className={styles.title}>What we offer</h2> */}
          <p className={styles.subTitle}>
            Giải Pháp Thiết Kế Toàn Diện
            <br />
            Kiến Tạo Không Gian, Hiện Thực Ý Tưởng
          </p>
          <p className={styles.descriptionTitle}>
            Tái định nghĩa không gian - nâng tầm trải nghiệm sống
          </p>
          <span className={styles.description}>
            Chúng tôi cung cấp một gói dịch vụ thiết kế nội - ngoại thất trọn
            gói, bao gồm từ lên ý tưởng, dựng bản thiết kế 3D cho đến lựa chọn
            các phụ kiện trang trí cao cấp, giúp không gian của bạn trở nên hoàn
            mỹ nhất. <br />
            Với sự tận tâm và tỉ mỉ chúng tôi tạo ra những không gian tinh tế và
            độc đáo, từ biệt thự, căn hộ cá nhân đến các dự án nhà hàng, khách
            sạn và văn phòng làm việc chuyên nghiệp. Mỗi dự án đều là sự kết hợp
            hài hòa giữa sáng tạo, công năng và phong cách riêng của khách hàng.
          </span>
        </div>

        <div className={styles.imageContent}>
          <div className={styles.listImageLeft}>
            <Image
              src={
                'https://aa-design.s3.ap-southeast-1.amazonaws.com/design_service.webp'
              }
              alt="image0"
              width={200}
              height={400}
              className={styles.image0}
            />

            <Image
              src={
                'https://aa-design.s3.ap-southeast-1.amazonaws.com/design_service.webp'
              }
              alt="image1"
              height={200}
              width={130}
            />
          </div>
          <div className={styles.listImageRight}>
            <Image
              src={
                'https://aa-design.s3.ap-southeast-1.amazonaws.com/design_service.webp'
              }
              alt="image2"
              height={300}
              width={200}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DesignServiceComponentPage;
