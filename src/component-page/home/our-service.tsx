import React, { useEffect, useRef, useState } from 'react';
import { SiVorondesign } from 'react-icons/si';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

//styles
import styles from '@/scss/home-page.module.scss';

const serviceKeys = ['architecture', 'interior', 'construction', 'fengShui'];

const OurServiceComponentPage = () => {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

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
    <motion.section
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={containerVariants}
      className={styles.ourService}
    >
      <h2 className={styles.title2}>{t('home.ourService.title')}</h2>
      <p className={styles.description}>{t('home.ourService.description')}</p>

      <div className={styles.serviceWrapper}>
        <motion.div variants={containerVariants} className={styles.container}>
          {serviceKeys.map((key) => (
            <motion.div
              variants={itemVariants}
              key={key}
              className={styles.serviceBox}
            >
              <div className={styles.icon} aria-hidden="true">
                <SiVorondesign />
              </div>
              <h3 className={styles.title}>
                {t(`home.ourService.items.${key}.title`)}
              </h3>
              <p className={styles.description}>
                {t(`home.ourService.items.${key}.description`)}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default OurServiceComponentPage;
