import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// Components
import SEOHeaderComponent from '@/components/seo-header';

// Styles
import styles from '@/styles/profile.module.scss';

const ProfilePage = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  return (
    <>
      <SEOHeaderComponent
        title="La Thiên Phi - Kiến trúc sư & Nhà thiết kế nội thất"
        description="Với gần 20 năm kinh nghiệm trong lĩnh vực thiết kế kiến trúc - nội thất, La Thiên Phi đã thực hiện nhiều dự án đa dạng, từ chung cư, biệt thự đến văn phòng và không gian thương mại."
        keywords="La Thiên Phi, thiết kế nội thất, kiến trúc sư, thiết kế biệt thự, thiết kế chung cư, thiết kế văn phòng"
      />

      <motion.div
        ref={ref}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={containerVariants}
        className={styles.profileContainer}
      >
        {/* Hero Section */}
        <div className={styles.hero}>
          <motion.div className={styles.heroContent} variants={itemVariants}>
            <h1>La Thiên Phi</h1>
            <h2>Kiến trúc sư & Nhà thiết kế nội thất</h2>
          </motion.div>
        </div>

        {/* Introduction Section */}
        <div className={styles.introduction}>
          <motion.div className={styles.imageSection} variants={itemVariants}>
            {/* <div className={styles.imageWrapper}>
              <Image
                src="/images/architect.jpg"
                alt="La Thiên Phi - Kiến trúc sư"
                width={600}
                height={800}
                quality={100}
                priority
              />
            </div> */}
          </motion.div>

          <motion.div className={styles.textSection} variants={itemVariants}>
            <h3>Giới thiệu</h3>
            <p>
              Với gần 20 năm kinh nghiệm trong lĩnh vực thiết kế kiến trúc - nội
              thất, tôi đã có cơ hội thực hiện nhiều dự án đa dạng, từ chung cư,
              biệt thự, văn phòng đến các không gian thương mại.
            </p>
            <p>
              Mỗi công trình là một câu chuyện riêng, và tôi luôn tâm niệm rằng
              thiết kế không chỉ đơn thuần là việc sắp đặt nội thất mà còn là
              nghệ thuật kiến tạo không gian sống và làm việc lý tưởng.
            </p>
          </motion.div>
        </div>

        {/* Philosophy Section */}
        <motion.div className={styles.philosophy} variants={itemVariants}>
          <div className={styles.philosophyContent}>
            <h3>Triết lý thiết kế</h3>
            <div className={styles.philosophyGrid}>
              <motion.div
                className={styles.philosophyItem}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <h4>Tính ứng dụng</h4>
                <p>
                  Thiết kế không chỉ đẹp mắt mà còn mang lại sự tiện nghi, thoải
                  mái và tối ưu công năng sử dụng.
                </p>
              </motion.div>

              <motion.div
                className={styles.philosophyItem}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <h4>Sự hài hòa</h4>
                <p>
                  Đảm bảo sự cân bằng hoàn hảo giữa công năng, thẩm mỹ và cảm
                  xúc của người sử dụng.
                </p>
              </motion.div>

              <motion.div
                className={styles.philosophyItem}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <h4>Chi tiết</h4>
                <p>
                  Chú trọng đến từng chi tiết, từ cách bố trí không gian, lựa
                  chọn vật liệu, ánh sáng đến màu sắc.
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Experience Section */}
        <motion.div className={styles.experience} variants={itemVariants}>
          <div className={styles.experienceContent}>
            <h3>Kinh nghiệm</h3>
            <div className={styles.experienceGrid}>
              <motion.div
                className={styles.experienceItem}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <span className={styles.number}>20+</span>
                <span className={styles.label}>Năm kinh nghiệm</span>
              </motion.div>

              <motion.div
                className={styles.experienceItem}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <span className={styles.number}>100+</span>
                <span className={styles.label}>Dự án hoàn thành</span>
              </motion.div>

              <motion.div
                className={styles.experienceItem}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <span className={styles.number}>50+</span>
                <span className={styles.label}>Khách hàng hài lòng</span>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default ProfilePage;
