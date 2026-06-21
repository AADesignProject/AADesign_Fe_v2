import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
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
import { getLocalizedProjects } from '@/utils/localizedProject';

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

type LocalizedProject = Project & {
  displayAddress: string;
  displayName: string;
};

type SelectOption = {
  label: string;
  value: string;
};

type SelectDropdownProps = {
  value: string;
  options: SelectOption[];
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
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

const ConstructionPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
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

  const rawProjects = useMemo(() => staticContent.projects as Project[], []);
  const allProjects = useMemo(
    () =>
      getLocalizedProjects(rawProjects, router.locale) as LocalizedProject[],
    [rawProjects, router.locale]
  );

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
    const types = new Set(allProjects.map((project) => project.type));
    return Array.from(types)
      .filter(Boolean)
      .map((type) => ({
        label: t(`project.types.${type}`, { defaultValue: type }),
        value: type,
      }));
  }, [allProjects, t]);

  const searchSuggestions = useMemo(() => {
    const suggestions = new Set<string>();
    allProjects.forEach((project) => {
      if (project.displayName) suggestions.add(project.displayName);
      if (project.displayAddress) suggestions.add(project.displayAddress);
      if (project.type) {
        suggestions.add(
          t(`project.types.${project.type}`, { defaultValue: project.type })
        );
      }
    });
    return Array.from(suggestions);
  }, [allProjects, t]);

  const locationOptions = useMemo(() => {
    const locations = new Set(
      allProjects
        .map((project) => getLocationFromAddress(project.displayAddress))
        .filter(Boolean)
    );
    return Array.from(locations).map((location) => ({
      label: location,
      value: location,
    }));
  }, [allProjects]);

  const filteredProjects = useMemo(() => {
    const normalizedSearch = normalizeText(searchTerm.trim());

    return allProjects.filter((project) => {
      const displayType = t(`project.types.${project.type}`, {
        defaultValue: project.type,
      });
      const projectLocation = getLocationFromAddress(project.displayAddress);
      const matchesType = !selectedType || project.type === selectedType;
      const matchesLocation =
        !selectedLocation || projectLocation === selectedLocation;
      const matchesSearch =
        !normalizedSearch ||
        normalizeText(project.displayName).includes(normalizedSearch) ||
        normalizeText(project.displayAddress).includes(normalizedSearch) ||
        normalizeText(displayType).includes(normalizedSearch);

      return matchesType && matchesLocation && matchesSearch;
    });
  }, [allProjects, searchTerm, selectedType, selectedLocation, t]);

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
  }, [searchTerm, selectedType, selectedLocation, router.locale]);

  const projects = filteredProjects.slice(0, safePage * limit);

  return (
    <>
      <SEOHeaderComponent
        title={t('seo.title_construction')}
        description={t('seo.description_construction')}
        keywords={t('construction.keywords')}
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
            <span>
              {t('construction.count', { count: filteredProjects.length })}
            </span>
          </div>
          <div className={styles.filterBar}>
            <div className={styles.searchBox}>
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder={t('construction.filters.searchPlaceholder')}
                aria-label={t('construction.filters.searchAria')}
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
                placeholder={t('construction.filters.allTypes')}
                ariaLabel={t('construction.filters.typeAria')}
                onChange={setSelectedType}
              />
              <SelectDropdown
                value={selectedLocation}
                options={locationOptions}
                placeholder={t('construction.filters.allLocations')}
                ariaLabel={t('construction.filters.locationAria')}
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
              {t('construction.filters.reset')}
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
                  aria-label={t('construction.viewProject', {
                    name: project.displayName,
                  })}
                >
                  <Image
                    src={resolveImageUrl(project.thumbnail)}
                    alt={project.displayName}
                    width={1920}
                    height={1200}
                    quality={85}
                    sizes="(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    priority={index < 6}
                  />
                  <div className={styles.overlay}>
                    <span className={styles.topTitle}>
                      {t(`project.types.${project.type}`)}
                    </span>
                    <span className={styles.address}>
                      {project.displayAddress}
                    </span>
                    <span className={styles.name}>{project.displayName}</span>
                  </div>
                </Link>
              </motion.div>
            ))}

            {projects.length === 0 && !isLoading && (
              <div className={styles.emptyState}>{t('construction.empty')}</div>
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
