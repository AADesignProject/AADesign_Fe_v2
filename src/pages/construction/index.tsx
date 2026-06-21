import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import Link from 'next/link';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';

//components
import SEOHeaderComponent from '@/components/seo-header';
import HeaderTitlePage from '@/components/header-title-page';

//styles
import styles from '@/scss/construction-page.module.scss';
import staticContent from '@/data/static-content.json';
import { resolveImageUrl } from '@/utils/resolveImageUrl';
import { getProjectSlug } from '@/utils/projectSlug';

interface Project {
  _id: string;
  name: string;
  type: string;
  address: string;
  thumbnail: string;
  thumbnailMain?: string;
  images?: string[];
  isTypical?: boolean;
  typical?: boolean;
}

type SelectDropdownProps = {
  value: string;
  options: string[];
  placeholder: string;
  ariaLabel: string;
  onChange: (value: string) => void;
};

const SelectDropdown = ({
  value,
  options,
  placeholder,
  ariaLabel,
  onChange,
}: SelectDropdownProps) => {
  return (
    <div className={styles.selectWrapper}>
      <select
        className={value ? styles.selectValue : styles.selectPlaceholder}
        aria-label={ariaLabel}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

const ConstructionPage = () => {
  const { t } = useTranslation();
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const limit = 9;
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const allProjects = useMemo(() => staticContent.projects as Project[], []);

  const normalizeText = (value: string) =>
    value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

  const getLocationFromAddress = (address: string) => {
    const parts = address.split(',').map((part) => part.trim());
    return parts[parts.length - 1] || address;
  };

  const typeOptions = useMemo(() => {
    const types = new Set(
      allProjects.map((project) => project.type).filter(Boolean)
    );
    return Array.from(types);
  }, [allProjects]);

  const searchSuggestions = useMemo(() => {
    const suggestions = new Set<string>();
    allProjects.forEach((project) => {
      if (project.name) suggestions.add(project.name);
      if (project.address) suggestions.add(project.address);
      if (project.type) suggestions.add(project.type);
    });
    return Array.from(suggestions);
  }, [allProjects]);

  const locationOptions = useMemo(() => {
    const locations = new Set(
      allProjects
        .map((project) => getLocationFromAddress(project.address))
        .filter(Boolean)
    );
    return Array.from(locations);
  }, [allProjects]);

  const filteredProjects = useMemo(() => {
    const normalizedSearch = normalizeText(searchTerm.trim());

    return allProjects.filter((project) => {
      const matchesType = !selectedType || project.type === selectedType;
      const projectLocation = getLocationFromAddress(project.address);
      const matchesLocation =
        !selectedLocation || projectLocation === selectedLocation;
      const matchesSearch =
        !normalizedSearch ||
        normalizeText(project.name).includes(normalizedSearch) ||
        normalizeText(project.address).includes(normalizedSearch) ||
        normalizeText(project.type).includes(normalizedSearch);

      return matchesType && matchesLocation && matchesSearch;
    });
  }, [allProjects, searchTerm, selectedType, selectedLocation]);

  const totalPages = Math.ceil(filteredProjects.length / limit) || 1;
  const safePage = Math.min(page, totalPages);
  const hasNextPage = safePage < totalPages;
  const isLoading = false;

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
        if (target.isIntersecting && hasNextPage) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    const currentLoadMoreRef = loadMoreRef.current;
    if (currentLoadMoreRef) {
      observer.observe(currentLoadMoreRef);
    }

    return () => {
      if (currentLoadMoreRef) {
        observer.unobserve(currentLoadMoreRef);
      }
    };
  }, [hasNextPage]);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, selectedType, selectedLocation]);

  const projects = filteredProjects.slice(0, safePage * limit);

  return (
    <>
      <SEOHeaderComponent
        title={t('seo.title_construction')}
        description={t('seo.description_construction')}
        keywords="công trình nội thất, thiết kế biệt thự, thiết kế khách sạn, thiết kế văn phòng, AA Design"
        breadcrumbs={[
          { name: 'AA Design', url: '/' },
          { name: t('construction.title'), url: '/construction' },
        ]}
      />
      <div className={styles.wrapperConstructionPage}>
        <div className={styles.containerConstructionPage}>
          <div className={styles.pageIntro}>
            <HeaderTitlePage title={t('construction.title')} />
            <p>{t('construction.description')}</p>
            <span>{filteredProjects.length} công trình</span>
          </div>
          <div className={styles.filterBar}>
            <div className={styles.searchBox}>
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Tìm theo tên, địa chỉ hoặc loại công trình"
                aria-label="Tìm kiếm công trình"
                list="project-search-suggestions"
              />
              <datalist id="project-search-suggestions">
                {searchSuggestions.map((item) => (
                  <option key={item} value={item} />
                ))}
              </datalist>
            </div>
            <div className={styles.filterGroup}>
              <SelectDropdown
                value={selectedType}
                options={typeOptions}
                placeholder="Tất cả loại công trình"
                ariaLabel="Lọc theo loại công trình"
                onChange={setSelectedType}
              />
              <SelectDropdown
                value={selectedLocation}
                options={locationOptions}
                placeholder="Tất cả khu vực"
                ariaLabel="Lọc theo khu vực"
                onChange={setSelectedLocation}
              />
            </div>
            <button
              type="button"
              className={styles.resetButton}
              onClick={() => {
                setSearchTerm('');
                setSelectedType('');
                setSelectedLocation('');
              }}
              disabled={!searchTerm && !selectedType && !selectedLocation}
            >
              Xóa lọc
            </button>
          </div>
          <motion.div
            ref={ref}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            variants={containerVariants}
            className={styles.wrapperCardConstruction}
          >
            {projects.map((project, index) => (
              <motion.div key={project._id} variants={itemVariants}>
                <Link
                  href={`/construction/${getProjectSlug(project)}`}
                  className={styles.imageWrapper}
                  aria-label={`Xem công trình ${project.name}`}
                >
                  <Image
                    src={resolveImageUrl(project.thumbnail)}
                    alt={project.name}
                    width={1920}
                    height={1200}
                    quality={85}
                    sizes="(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    priority={index < 6}
                  />
                  <div className={styles.overlay}>
                    <span className={styles.topTitle}>{project.type}</span>
                    <span className={styles.address}>{project.address}</span>
                    <span className={styles.name}>{project.name}</span>
                  </div>
                </Link>
              </motion.div>
            ))}

            {projects.length === 0 && !isLoading && (
              <div className={styles.emptyState}>
                Không có công trình phù hợp
              </div>
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
