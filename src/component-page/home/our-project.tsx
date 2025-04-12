import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { AiOutlinePlus } from 'react-icons/ai';
import { motion } from 'framer-motion';
import { useInfiniteQuery } from '@tanstack/react-query';
import axiosInstance from '@/services/axios';

//styles
import styles from '@/scss/home-page.module.scss';
import Link from 'next/link';
import { useRouter } from 'next/router';

type TProject = {
  _id: string;
  address: string;
  type: string;
  thumbnail: string;
  thumbnailMain: string;
  name: string;
};

type TProjectResponse = {
  data: TProject[];
  total: number;
  page: number;
  limit: number;
};

const fetchProjects = async ({ pageParam = 1 }: { pageParam?: number }) => {
  const response = await axiosInstance.get<TProjectResponse>(
    `/projects/typical?page=${pageParam}&limit=9`
  );
  return response.data;
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

  const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
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

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p>Đã có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.</p>
      </div>
    );
  }

  const projects = data?.pages?.flatMap((page) => page?.data || []) || [];

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
                  src={`${process.env.NEXT_PUBLIC_LINK_S3}/${project.thumbnailMain}`}
                  alt={project.name}
                  width={1080}
                  height={1920}
                  quality={100}
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
