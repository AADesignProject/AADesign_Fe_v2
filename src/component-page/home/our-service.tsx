import React, { useEffect, useRef, useState } from 'react';
import { SiVorondesign } from 'react-icons/si';
import { motion } from 'framer-motion';

//styles
import styles from '@/scss/home-page.module.scss';

const listOurService = [
  {
    icon: <SiVorondesign />,
    title: 'Thiết Kế Kiến Trúc',
    description: `Kiến tạo không gian sống đẳng cấp với những thiết kế độc đáo, bền vững và tối ưu công năng, đảm bảo sự hài hòa giữa kiến trúc, phong cách và môi trường.`,
  },
  {
    icon: <SiVorondesign />,
    title: 'Thiết Kế Nội Thất',
    description:
      'Biến ý tưởng thành không gian sống lý tưởng, kết hợp giữa thẩm mỹ, tiện nghi và cá tính, mang đến mang đến dấu ấn cá nhân cho từng công trình.',
  },
  {
    icon: <SiVorondesign />,
    title: 'Thi Công',
    description: `Từ bản vẽ đến thực tế – quy trình thi công chuyên nghiệp, chính xác và đúng tiến độ, đảm bảo chất lượng hoàn thiện cao nhất cho từng công trình.`,
  },
  {
    icon: <SiVorondesign />,
    title: 'Tư Vấn & Cung Cấp Vật Phẩm Phong Thủy',
    description: `Ứng dụng các nguyên tắc phong thủy vào thiết kế kiến trúc và nội thất, tạo nên không gian cân bằng năng lượng, hài hòa thiên nhiên và mang lại sự thịnh vượng, may mắn, bình an cho gia chủ.`,
  },
];

const OurServiceComponentPage = () => {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        when: 'beforeChildren',
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

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
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={containerVariants}
      className={styles.ourService}
    >
      {/* <h2 className={styles.title}>Meet</h2> */}
      <h2 className={styles.title2}>DỊCH VỤ CỦA CHÚNG TÔI</h2>
      <p className={styles.description}>
        Giải pháp chuyên nghiệp - Thi công nhanh chóng - Hoàn thiện tỉ mỉ từng
        chi tiết
      </p>

      <div className={styles.serviceWrapper}>
        <motion.div variants={containerVariants} className={styles.container}>
          {listOurService?.map((item, index) => (
            <motion.div
              variants={itemVariants}
              key={index}
              className={styles.serviceBox}
            >
              <div className={styles.icon}>{item.icon}</div>
              <h3 className={styles.title}>{item.title}</h3>
              <p className={styles.description}>{item.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default OurServiceComponentPage;
