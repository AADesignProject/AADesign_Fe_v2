import React, { memo, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';

//components
import SEOHeaderComponent from '@/components/seo-header';
import HeaderTitlePage from '@/components/header-title-page';

//styles
import styles from '@/scss/construction-page.module.scss';
import axiosInstance from '@/services/axios';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';

interface Project {
  _id: string;
  name: string;
  type: string;
  address: string;
  thumbnail: string;
}

interface ProjectResponse {
  data: Project[];
  total: number;
  page: number;
  limit: number;
}

const fetchProjects = async ({ pageParam = 1 }: { pageParam?: number }) => {
  const response = await axiosInstance.get<ProjectResponse>(
    `/projects?page=${pageParam}&limit=9`
  );
  return response.data;
};

const ConstructionPage = () => {
  const { t } = useTranslation();
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ['projects'],
      queryFn: fetchProjects,
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        const { page, total, limit } = lastPage;
        const totalPages = Math.ceil(total / limit);
        return page < totalPages ? page + 1 : undefined;
      },
    });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
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
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const projects = data?.pages?.flatMap((page) => page?.data || []) || [];

  return (
    <>
      <SEOHeaderComponent
        title={t('seo.title_construction')}
        description={t('seo.description_construction')}
        keywords="construction, design, aa-design construction, aa design construction, la thien phi, công trình la thiên phi, công trình,"
      />
      <div className={styles.wrapperConstructionPage}>
        <div className={styles.containerConstructionPage}>
          <HeaderTitlePage title={t('construction.title')} />
          <motion.div
            ref={ref}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            variants={containerVariants}
            className={styles.wrapperCardConstruction}
          >
            {projects.map((project, index) => (
              <motion.div
                key={project._id}
                className={styles.imageWrapper}
                variants={itemVariants}
                onClick={() => router.push(`/construction/${project._id}`)}
              >
                <Image
                  src={`${process.env.NEXT_PUBLIC_LINK_S3}/${project.thumbnail}`}
                  alt={project.name}
                  width={1920}
                  height={1200}
                  quality={100}
                  priority={index < 6}
                />
                <div className={styles.overlay}>
                  <span className={styles.topTitle}>{project.type}</span>
                  <span className={styles.address}>{project.address}</span>
                  <span className={styles.name}>{project.name}</span>
                </div>
              </motion.div>
            ))}

            {projects.length === 0 && !isLoading && (
              <div className={styles.emptyState}>No projects found</div>
            )}
            {isLoading && <div className={styles.loading}>Loading...</div>}
          </motion.div>
          <div ref={loadMoreRef} style={{ height: '20px' }} />
        </div>
      </div>
    </>
  );
};

export default memo(ConstructionPage);
