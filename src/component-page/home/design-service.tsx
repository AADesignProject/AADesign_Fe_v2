import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

//styles
import styles from '@/scss/home-page.module.scss';

const DesignServiceComponentPage = () => {
  const [isInView, setIsInView] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);

  const numberAnimation = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 1,
        when: 'beforeChildren',
        staggerChildren: 0.3,
      },
    },
  };

  const countAnimation = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 1,
      },
    },
  };

  const CountUp = ({ end }: { end: number }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      let current = 0;
      const increment = end / 100;
      const interval = setInterval(() => {
        current += increment;
        setCount(Math.min(current, end));
        if (current >= end) {
          clearInterval(interval);
        }
      }, 20);
      return () => clearInterval(interval);
    }, [end]);

    return (
      <motion.h2
        id={`count-${end}`}
        className={styles.number}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        {Math.floor(count)}+
      </motion.h2>
    );
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
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className={styles.designService}
    >
      <div className={styles.textContent}>
        <h2 className={styles.title}>What we offer</h2>
        <p className={styles.subTitle}>
          Full Package <br /> of Design Services
        </p>
        <p className={styles.descriptionTitle}>
          From design-project to Accessories Selection
        </p>
        <span className={styles.description}>
          Interior Agency provides its clients with the most full list of design
          services, starting from creating a design-project and its 3D
          visualization to selecting exclusive accessories right for your
          interior. Our award-winning designers offer the most exquisite
          decisions and create really unique spaces either in apartments or
          offices.
        </span>
        <motion.div
          variants={numberAnimation}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className={styles.containerNumberInfo}
        >
          <motion.div className={styles.boxContent} variants={countAnimation}>
            <CountUp end={20} />
            <p className={styles.note}>tons of paint used</p>
          </motion.div>
          <motion.div className={styles.boxContent} variants={countAnimation}>
            <CountUp end={67} />
            <p className={styles.note}>rooms done monthly</p>
          </motion.div>
        </motion.div>
      </div>

      <div className={styles.imageContent}>
        <div className={styles.listImageLeft}>
          <Image
            src={
              'https://aa-design.s3.ap-southeast-1.amazonaws.com/design_service.webp'
            }
            alt="image0"
            width={200}
            height={300}
            className={styles.image0}
          />

          <Image
            src={
              'https://aa-design.s3.ap-southeast-1.amazonaws.com/design_service.webp'
            }
            alt="image1"
            width={120}
            height={200}
            className={styles.image1}
          />
        </div>
        <div className={styles.listImageRight}>
          <Image
            src={
              'https://aa-design.s3.ap-southeast-1.amazonaws.com/design_service.webp'
            }
            alt="image2"
            width={200}
            height={300}
            className={styles.image2}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default DesignServiceComponentPage;
