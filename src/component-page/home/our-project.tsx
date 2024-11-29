import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { AiOutlinePlus } from 'react-icons/ai';
import { motion } from 'framer-motion';

//styles
import styles from '@/scss/home-page.module.scss';

const OurProjectComponentPage = () => {
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

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className={styles.ourProject}
    >
      <h3 className={styles.title}>Our Project</h3>
      <h2 className={styles.title2}>Recent works</h2>
      <p className={styles.description}>
        Check our recent works we have just finished in different locations for
        different purposes and clients.
      </p>
      <motion.div
        className={styles.projectGallery}
        variants={containerVariants}
      >
        <motion.div className={styles.column} variants={itemVariants}>
          <div className={styles.imageWrapper}>
            <Image
              src={
                'https://aa-design.s3.ap-southeast-1.amazonaws.com/design_service.webp'
              }
              alt="design_service"
              width={300}
              height={400}
            />
            <div className={styles.overlay}>
              <p className={styles.topTitle}>interior design</p>
              <AiOutlinePlus className={styles.icon} />
              <p className={styles.address}>Tây Hồ, Hà Nội</p>
              <p className={styles.name}>Westlake Villa</p>
            </div>
          </div>
          <div className={styles.imageWrapper}>
            <Image
              src={
                'https://aa-design.s3.ap-southeast-1.amazonaws.com/design_service.webp'
              }
              alt="design_service"
              width={300}
              height={400}
            />
            <div className={styles.overlay}>
              <p className={styles.topTitle}>interior design</p>
              <AiOutlinePlus className={styles.icon} />
              <p className={styles.address}>Tây Hồ, Hà Nội</p>
              <p className={styles.name}>Westlake Villa</p>
            </div>
          </div>
          <div className={styles.imageWrapper}>
            <Image
              src={
                'https://aa-design.s3.ap-southeast-1.amazonaws.com/design_service.webp'
              }
              alt="design_service"
              width={300}
              height={400}
            />
            <div className={styles.overlay}>
              <p className={styles.topTitle}>interior design</p>
              <AiOutlinePlus className={styles.icon} />
              <p className={styles.address}>Tây Hồ, Hà Nội</p>
              <p className={styles.name}>Westlake Villa</p>
            </div>
          </div>
        </motion.div>
        <motion.div className={styles.column} variants={itemVariants}>
          <div className={styles.imageWrapper}>
            <Image
              src={
                'https://aa-design.s3.ap-southeast-1.amazonaws.com/design_service.webp'
              }
              alt="design_service"
              width={300}
              height={400}
            />
            <div className={styles.overlay}>
              <p className={styles.topTitle}>interior design</p>
              <AiOutlinePlus className={styles.icon} />
              <p className={styles.address}>Tây Hồ, Hà Nội</p>
              <p className={styles.name}>Westlake Villa</p>
            </div>
          </div>
          <div className={styles.imageWrapper}>
            <Image
              src={
                'https://aa-design.s3.ap-southeast-1.amazonaws.com/design_service.webp'
              }
              alt="design_service"
              width={300}
              height={400}
            />
            <div className={styles.overlay}>
              <p className={styles.topTitle}>interior design</p>
              <AiOutlinePlus className={styles.icon} />
              <p className={styles.address}>Tây Hồ, Hà Nội</p>
              <p className={styles.name}>Westlake Villa</p>
            </div>
          </div>
        </motion.div>
        <motion.div className={styles.column} variants={itemVariants}>
          <div className={styles.imageWrapper}>
            <Image
              src={
                'https://aa-design.s3.ap-southeast-1.amazonaws.com/design_service.webp'
              }
              alt="design_service"
              width={300}
              height={400}
            />
            <div className={styles.overlay}>
              <p className={styles.topTitle}>interior design</p>
              <AiOutlinePlus className={styles.icon} />
              <p className={styles.address}>Tây Hồ, Hà Nội</p>
              <p className={styles.name}>Westlake Villa</p>
            </div>
          </div>
          <div className={styles.imageWrapper}>
            <Image
              src={
                'https://aa-design.s3.ap-southeast-1.amazonaws.com/design_service.webp'
              }
              alt="design_service"
              width={300}
              height={400}
            />
            <div className={styles.overlay}>
              <p className={styles.topTitle}>interior design</p>
              <AiOutlinePlus className={styles.icon} />
              <p className={styles.address}>Tây Hồ, Hà Nội</p>
              <p className={styles.name}>Westlake Villa</p>
            </div>
          </div>
          <div className={styles.imageWrapper}>
            <Image
              src={
                'https://aa-design.s3.ap-southeast-1.amazonaws.com/design_service.webp'
              }
              alt="design_service"
              width={300}
              height={400}
            />
            <div className={styles.overlay}>
              <p className={styles.topTitle}>interior design</p>
              <AiOutlinePlus className={styles.icon} />
              <p className={styles.address}>Tây Hồ, Hà Nội</p>
              <p className={styles.name}>Westlake Villa</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default OurProjectComponentPage;
