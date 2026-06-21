import Image from 'next/image';
import React, { memo, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

  const dataImageBannersSmall =
    staticContent.bannerSmall as TDataImageBannerSmallProps[];
  const subtitleLines = t('home.designService.subtitle').split('\n');
  const descriptionLines = t('home.designService.description').split('\n');

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
          <span className={styles.title}>{t('home.designService.title')}</span>
          <h2 className={styles.subTitle}>
            {subtitleLines.map((line) => (
              <React.Fragment key={line}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </h2>
          <p className={styles.descriptionTitle}>
            {t('home.designService.descriptionTitle')}
          </p>
          <p className={styles.description}>
            {descriptionLines.map((line, index) => (
              <React.Fragment key={line}>
                {line}
                {index < descriptionLines.length - 1 ? <br /> : null}
              </React.Fragment>
            ))}
          </p>
          <div className={styles.containerNumberInfo}>
            <div className={styles.boxContent}>
              <span className={styles.number}>20+</span>
              <span className={styles.note}>
                {t('home.designService.stats.experience')}
              </span>
            </div>
            <div className={styles.boxContent}>
              <span className={styles.number}>100+</span>
              <span className={styles.note}>
                {t('home.designService.stats.projects')}
              </span>
            </div>
            <div className={styles.boxContent}>
              <span className={styles.number}>3D</span>
              <span className={styles.note}>
                {t('home.designService.stats.visualization')}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.imageContent}>
          <div className={styles.listImageLeft}>
            <Image
              src={resolveImageUrl(dataImageBannersSmall?.[0]?.url || '')}
              alt={t('home.designService.imageAlt', { index: 1 })}
              width={200}
              height={400}
              className={styles.image0}
              sizes="(max-width: 768px) 45vw, 200px"
              quality={85}
            />

            <Image
              src={resolveImageUrl(dataImageBannersSmall?.[1]?.url || '')}
              alt={t('home.designService.imageAlt', { index: 2 })}
              height={200}
              width={130}
              sizes="(max-width: 768px) 35vw, 130px"
              quality={85}
            />
          </div>
          <div className={styles.listImageRight}>
            <Image
              src={resolveImageUrl(dataImageBannersSmall?.[2]?.url || '')}
              alt={t('home.designService.imageAlt', { index: 3 })}
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
