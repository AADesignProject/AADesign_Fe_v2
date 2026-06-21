import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useTranslation } from 'react-i18next';

// Components
import SEOHeaderComponent from '@/components/seo-header';

// Styles
import styles from '@/styles/profile.module.scss';

const ProfilePage = () => {
  const { t } = useTranslation();
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
        title={t('seo.title_profile')}
        description={t('seo.description_profile')}
        keywords={t('seo.keywords_profile')}
        breadcrumbs={[
          { name: t('breadcrumbs.home'), url: '/' },
          { name: t('header.menu.introduction'), url: '/profile' },
        ]}
      />

      <motion.div
        ref={ref}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={containerVariants}
        className={styles.profileContainer}
      >
        <section className={styles.hero}>
          <motion.div className={styles.heroContent} variants={itemVariants}>
            <span>{t('profile.hero.eyebrow')}</span>
            <h1>{t('profile.hero.name')}</h1>
            <h2>{t('profile.hero.role')}</h2>
          </motion.div>
        </section>

        <section className={styles.introduction}>
          <motion.div className={styles.imageSection} variants={itemVariants}>
            <div className={styles.imageWrapper}>
              <Image
                src="/images/photo-1618221195710-dd6b41faaea6.avif"
                alt={t('profile.imageAlt')}
                width={600}
                height={800}
                quality={90}
                priority
              />
            </div>
          </motion.div>

          <motion.div className={styles.textSection} variants={itemVariants}>
            <h3>{t('profile.introduction.title')}</h3>
            <p>{t('profile.introduction.paragraph1')}</p>
            <p>{t('profile.introduction.paragraph2')}</p>
          </motion.div>
        </section>

        <motion.section className={styles.philosophy} variants={itemVariants}>
          <div className={styles.philosophyContent}>
            <h3>{t('profile.philosophy.title')}</h3>
            <div className={styles.philosophyGrid}>
              <motion.div
                className={styles.philosophyItem}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <h4>{t('profile.philosophy.practical.title')}</h4>
                <p>{t('profile.philosophy.practical.description')}</p>
              </motion.div>

              <motion.div
                className={styles.philosophyItem}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <h4>{t('profile.philosophy.harmony.title')}</h4>
                <p>{t('profile.philosophy.harmony.description')}</p>
              </motion.div>

              <motion.div
                className={styles.philosophyItem}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <h4>{t('profile.philosophy.detail.title')}</h4>
                <p>{t('profile.philosophy.detail.description')}</p>
              </motion.div>
            </div>
          </div>
        </motion.section>

        <motion.section className={styles.experience} variants={itemVariants}>
          <div className={styles.experienceContent}>
            <h3>{t('profile.experience.title')}</h3>
            <div className={styles.experienceGrid}>
              <motion.div
                className={styles.experienceItem}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <span className={styles.number}>20+</span>
                <span className={styles.label}>
                  {t('profile.experience.years')}
                </span>
              </motion.div>

              <motion.div
                className={styles.experienceItem}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <span className={styles.number}>100+</span>
                <span className={styles.label}>
                  {t('profile.experience.projects')}
                </span>
              </motion.div>

              <motion.div
                className={styles.experienceItem}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <span className={styles.number}>50+</span>
                <span className={styles.label}>
                  {t('profile.experience.clients')}
                </span>
              </motion.div>
            </div>
          </div>
        </motion.section>

        <motion.section className={styles.quoteSection} variants={itemVariants}>
          <p>{t('profile.quote')}</p>
        </motion.section>
      </motion.div>
    </>
  );
};

export default ProfilePage;
