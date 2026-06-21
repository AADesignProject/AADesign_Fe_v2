import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import {
  email,
  phoneNumber,
  phoneNumberHref,
  zaloHref,
} from '@/constant/general';
import staticContent from '@/data/static-content.json';
import styles from '@/scss/home-page.module.scss';
import { getLocalizedProjects } from '@/utils/localizedProject';
import { resolveImageUrl } from '@/utils/resolveImageUrl';

type Project = {
  _id: string;
  address: string;
  images?: string[];
  name: string;
  thumbnail?: string;
  thumbnailMain?: string;
  type: string;
  typical?: boolean;
};

type LocalizedProject = Project & {
  displayAddress: string;
  displayName: string;
};

type LandingItem = {
  description: string;
  title: string;
};

type LandingMetric = {
  label: string;
  value: string;
};

type LandingFaq = {
  answer: string;
  question: string;
};

type LandingReview = {
  name: string;
  project: string;
  quote: string;
};

const featuredProjectIds = [
  '67f898307d268cfebb8c0af4',
  '67f9ed566644672a6bf73b4a',
  '67f9ef7a6644672a6bf73b57',
  '67f9f0e06644672a6bf73b63',
  '67f9f04f6644672a6bf73b5f',
  '67f90c4ff603a839446d4911',
  '67f9f50f6644672a6bf73b87',
  '67fa23db6644672a6bf73ba8',
];

const getProjectImage = (project: Project) =>
  project.thumbnailMain || project.thumbnail || project.images?.[0] || '';

const HomepageLandingComponent = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const allProjects = useMemo(
    () =>
      getLocalizedProjects(
        staticContent.projects as Project[],
        router.locale
      ) as LocalizedProject[],
    [router.locale]
  );

  const featuredProjects = useMemo(
    () =>
      featuredProjectIds
        .map((projectId) =>
          allProjects.find((project) => project._id === projectId)
        )
        .filter(Boolean)
        .slice(0, 8) as LocalizedProject[],
    [allProjects]
  );

  const heroProject = featuredProjects[0] ?? allProjects[0];
  const heroImage = heroProject ? getProjectImage(heroProject) : '';
  const galleryProjects = featuredProjects.slice(0, 5);

  const whatWeDo = t('home.landing.whatWeDo.items', {
    returnObjects: true,
  }) as LandingItem[];
  const audiences = t('home.landing.whoWeServe.items', {
    returnObjects: true,
  }) as LandingItem[];
  const regions = t('home.landing.regions.items', {
    returnObjects: true,
  }) as LandingItem[];
  const quickProof = t('home.landing.quickProof.items', {
    returnObjects: true,
  }) as LandingMetric[];
  const socialProof = t('home.landing.socialProof.items', {
    returnObjects: true,
  }) as string[];
  const experience = t('home.landing.experience.items', {
    returnObjects: true,
  }) as LandingMetric[];
  const projectTypes = t('home.landing.projectTypes.items', {
    returnObjects: true,
  }) as LandingItem[];
  const needServices = t('home.landing.needServices.items', {
    returnObjects: true,
  }) as LandingItem[];
  const process = t('home.landing.process.items', {
    returnObjects: true,
  }) as LandingItem[];
  const reasons = t('home.landing.reasons.items', {
    returnObjects: true,
  }) as LandingItem[];
  const reviews = t('home.landing.reviews.items', {
    returnObjects: true,
  }) as LandingReview[];
  const faqs = t('home.landing.faq.items', {
    returnObjects: true,
  }) as LandingFaq[];

  return (
    <div className={styles.landingPage}>
      <section id="hero" className={styles.heroSection}>
        {heroImage ? (
          <Image
            src={resolveImageUrl(heroImage)}
            alt={heroProject?.displayName ?? t('home.landing.hero.imageAlt')}
            fill
            priority
            sizes="100vw"
            className={styles.heroImage}
          />
        ) : null}
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <span className={styles.eyebrow}>
            {t('home.landing.hero.eyebrow')}
          </span>
          <h1>{t('home.landing.hero.title')}</h1>
          <p>{t('home.landing.hero.description')}</p>
          <div className={styles.actionRow}>
            <Link href="/contact" className={styles.primaryButton}>
              {t('home.landing.hero.primaryCta')}
            </Link>
            <Link href="/construction" className={styles.secondaryButton}>
              {t('home.landing.hero.secondaryCta')}
            </Link>
          </div>
          <div className={styles.heroMeta}>
            <span>{t('home.landing.hero.metaProject')}</span>
            <strong>{heroProject?.displayName}</strong>
          </div>
        </div>
      </section>

      <section id="what-we-do" className={styles.introGridSection}>
        <SectionHeader
          eyebrow={t('home.landing.whatWeDo.eyebrow')}
          title={t('home.landing.whatWeDo.title')}
          description={t('home.landing.whatWeDo.description')}
        />
        <div className={styles.statementGrid}>
          {whatWeDo.map((item) => (
            <article className={styles.statementCard} key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="who-we-serve" className={styles.compactSection}>
        <SectionHeader
          eyebrow={t('home.landing.whoWeServe.eyebrow')}
          title={t('home.landing.whoWeServe.title')}
          description={t('home.landing.whoWeServe.description')}
        />
        <div className={styles.pillGrid}>
          {audiences.map((item) => (
            <article className={styles.pillCard} key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="regions" className={styles.regionsSection}>
        <div>
          <span className={styles.eyebrow}>
            {t('home.landing.regions.eyebrow')}
          </span>
          <h2>{t('home.landing.regions.title')}</h2>
        </div>
        <div className={styles.regionList}>
          {regions.map((item) => (
            <article key={item.title}>
              <strong>{item.title}</strong>
              <span>{item.description}</span>
            </article>
          ))}
        </div>
      </section>

      <section id="quick-proof" className={styles.proofSection}>
        {quickProof.map((item) => (
          <article key={item.label}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </article>
        ))}
      </section>

      <section id="primary-cta" className={styles.ctaStrip}>
        <div>
          <span className={styles.eyebrow}>
            {t('home.landing.primaryCta.eyebrow')}
          </span>
          <h2>{t('home.landing.primaryCta.title')}</h2>
          <p>{t('home.landing.primaryCta.description')}</p>
        </div>
        <div className={styles.actionRow}>
          <Link
            href={zaloHref}
            target="_blank"
            className={styles.primaryButton}
          >
            {t('home.landing.primaryCta.zalo')}
          </Link>
          <Link
            href={`tel:${phoneNumberHref}`}
            className={styles.secondaryButton}
          >
            {t('home.landing.primaryCta.call', { phone: phoneNumber })}
          </Link>
        </div>
      </section>

      <section id="social-proof" className={styles.socialProofSection}>
        <span>{t('home.landing.socialProof.label')}</span>
        <div>
          {socialProof.map((item) => (
            <strong key={item}>{item}</strong>
          ))}
        </div>
      </section>

      <section id="experience" className={styles.experienceSection}>
        <SectionHeader
          eyebrow={t('home.landing.experience.eyebrow')}
          title={t('home.landing.experience.title')}
          description={t('home.landing.experience.description')}
        />
        <div className={styles.metricGrid}>
          {experience.map((item) => (
            <article key={item.label}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </article>
          ))}
        </div>
      </section>

      <section id="project-types" className={styles.projectTypesSection}>
        <SectionHeader
          eyebrow={t('home.landing.projectTypes.eyebrow')}
          title={t('home.landing.projectTypes.title')}
          description={t('home.landing.projectTypes.description')}
        />
        <div className={styles.typeGrid}>
          {projectTypes.map((item) => (
            <article key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="featured-images" className={styles.featuredImagesSection}>
        <SectionHeader
          eyebrow={t('home.landing.featuredImages.eyebrow')}
          title={t('home.landing.featuredImages.title')}
          description={t('home.landing.featuredImages.description')}
        />
        <div className={styles.imageMosaic}>
          {galleryProjects.map((project, index) => (
            <Link
              href={`/construction/${project._id}`}
              key={project._id}
              className={styles.mosaicItem}
            >
              <Image
                src={resolveImageUrl(getProjectImage(project))}
                alt={project.displayName}
                width={900}
                height={1100}
                sizes="(max-width: 768px) 100vw, 33vw"
                quality={85}
                priority={index < 2}
              />
              <span>{project.displayName}</span>
            </Link>
          ))}
        </div>
      </section>

      <section id="need-services" className={styles.needServicesSection}>
        <SectionHeader
          eyebrow={t('home.landing.needServices.eyebrow')}
          title={t('home.landing.needServices.title')}
          description={t('home.landing.needServices.description')}
        />
        <div className={styles.needGrid}>
          {needServices.map((item) => (
            <article key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        id="featured-projects"
        className={styles.featuredProjectsSection}
      >
        <SectionHeader
          eyebrow={t('home.landing.featuredProjects.eyebrow')}
          title={t('home.landing.featuredProjects.title')}
          description={t('home.landing.featuredProjects.description')}
        />
        <div className={styles.projectGrid}>
          {featuredProjects.map((project, index) => (
            <Link
              href={`/construction/${project._id}`}
              className={styles.projectCard}
              key={project._id}
            >
              <Image
                src={resolveImageUrl(getProjectImage(project))}
                alt={project.displayName}
                width={900}
                height={1100}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                quality={85}
                priority={index < 4}
              />
              <div>
                <span>
                  {t('home.landing.featuredProjects.scopeLabel', {
                    type: t(`project.types.${project.type}`),
                  })}
                </span>
                <h3>{project.displayName}</h3>
                <p>{project.displayAddress}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section id="process" className={styles.processSection}>
        <SectionHeader
          eyebrow={t('home.landing.process.eyebrow')}
          title={t('home.landing.process.title')}
          description={t('home.landing.process.description')}
        />
        <div className={styles.processList}>
          {process.map((item, index) => (
            <article key={item.title}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="why-aa-design" className={styles.whySection}>
        <SectionHeader
          eyebrow={t('home.landing.reasons.eyebrow')}
          title={t('home.landing.reasons.title')}
          description={t('home.landing.reasons.description')}
        />
        <div className={styles.reasonGrid}>
          {reasons.map((item) => (
            <article key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="founder" className={styles.founderSection}>
        <div>
          <span className={styles.eyebrow}>
            {t('home.landing.founder.eyebrow')}
          </span>
          <h2>{t('home.landing.founder.title')}</h2>
          <p>{t('home.landing.founder.description')}</p>
        </div>
        <blockquote>{t('home.landing.founder.quote')}</blockquote>
      </section>

      <section id="reviews" className={styles.reviewSection}>
        <SectionHeader
          eyebrow={t('home.landing.reviews.eyebrow')}
          title={t('home.landing.reviews.title')}
          description={t('home.landing.reviews.description')}
        />
        <div className={styles.reviewGrid}>
          {reviews.map((review) => (
            <article key={review.name}>
              <p>{review.quote}</p>
              <strong>{review.name}</strong>
              <span>{review.project}</span>
            </article>
          ))}
        </div>
      </section>

      <section id="faq" className={styles.faqSection}>
        <SectionHeader
          eyebrow={t('home.landing.faq.eyebrow')}
          title={t('home.landing.faq.title')}
          description={t('home.landing.faq.description')}
        />
        <div className={styles.faqList}>
          {faqs.map((faq) => (
            <details key={faq.question}>
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section id="consultation-form" className={styles.formSection}>
        <SectionHeader
          eyebrow={t('home.landing.form.eyebrow')}
          title={t('home.landing.form.title')}
          description={t('home.landing.form.description')}
        />
        <form
          className={styles.consultForm}
          action={`mailto:${email}`}
          method="post"
          encType="text/plain"
        >
          <label>
            {t('home.landing.form.name')}
            <input name="name" type="text" required />
          </label>
          <label>
            {t('home.landing.form.phone')}
            <input name="phone" type="tel" required />
          </label>
          <label>
            {t('home.landing.form.need')}
            <select name="need" defaultValue="villa">
              <option value="villa">
                {t('home.landing.form.options.villa')}
              </option>
              <option value="apartment">
                {t('home.landing.form.options.apartment')}
              </option>
              <option value="office">
                {t('home.landing.form.options.office')}
              </option>
              <option value="hospitality">
                {t('home.landing.form.options.hospitality')}
              </option>
              <option value="turnkey">
                {t('home.landing.form.options.turnkey')}
              </option>
            </select>
          </label>
          <label>
            {t('home.landing.form.message')}
            <textarea name="message" rows={5} />
          </label>
          <button type="submit">{t('home.landing.form.submit')}</button>
        </form>
      </section>
    </div>
  );
};

type SectionHeaderProps = {
  description: string;
  eyebrow: string;
  title: string;
};

const SectionHeader = ({ description, eyebrow, title }: SectionHeaderProps) => (
  <div className={styles.sectionHeader}>
    <span className={styles.eyebrow}>{eyebrow}</span>
    <h2>{title}</h2>
    <p>{description}</p>
  </div>
);

export default HomepageLandingComponent;
