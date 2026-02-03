import React, { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { AiOutlinePlus } from 'react-icons/ai';
import { motion } from 'framer-motion';

//styles
import styles from '@/scss/home-page.module.scss';
import Link from 'next/link';
import { useRouter } from 'next/router';
import staticContent from '@/data/static-content.json';
import { resolveImageUrl } from '@/utils/resolveImageUrl';

type TProject = {
  _id: string;
  address: string;
  type: string;
  thumbnail: string;
  thumbnailMain: string;
  name: string;
  isTypical?: boolean;
  typical?: boolean;
};

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
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
};

const OurProjectComponentPage = () => {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const limit = 9;

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

  const allProjects = useMemo(
    () =>
      (staticContent.projects as TProject[]).filter(
        (project) => project.typical ?? project.isTypical
      ),
    []
  );
  const totalPages = Math.ceil(allProjects.length / limit) || 1;
  const safePage = Math.min(page, totalPages);
  const hasNextPage = safePage < totalPages;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasNextPage) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [hasNextPage]);
  const projects = allProjects.slice(0, safePage * limit);

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className={styles.ourProject}
    >
      <div className={styles.wrapperProject}>
        <h2 className={styles.title2}>Dự Án</h2>
        <p className={styles.description}>
          Những công trình mà chúng tôi đã hoàn thành tại nhiều địa điểm, phục
          vụ cho các mục đích và khách hàng khác nhau.
        </p>
        <motion.div
          className={styles.projectGallery}
          variants={containerVariants}
        >
          {projects.length > 0 ? (
            projects.map((project, index) => (
              <motion.div
                key={project._id}
                className={styles.imageWrapper}
                variants={itemVariants}
                custom={index}
                onClick={() => router.push(`/construction/${project._id}`)}
              >
                <Image
                  src={resolveImageUrl(project.thumbnailMain)}
                  alt={project.name}
                  width={1080}
                  height={1920}
                  quality={85}
                  sizes="(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  priority={index < 6}
                />
                <div className={styles.overlay}>
                  <p className={styles.topTitle}>{project.type}</p>
                  <AiOutlinePlus className={styles.icon} size={100} />
                  <p className={styles.address}>{project.address}</p>
                  <p className={styles.name}>{project.name}</p>
                </div>
              </motion.div>
            ))
          ) : (
            <div className={styles.emptyState}>
              <p>Không có dự án nào được hiển thị</p>
            </div>
          )}
        </motion.div>
        <div ref={loadMoreRef} style={{ height: '20px' }} />
        <motion.div
          className={styles.viewMoreContainer}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Link href="/construction" className={styles.viewMoreButton}>
            <span>Xem thêm dự án</span>
            <div className={styles.buttonLine} />
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default OurProjectComponentPage;
