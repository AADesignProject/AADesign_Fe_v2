import { useRef } from 'react';
import { BsArrowUpRight } from 'react-icons/bs';
import { useTranslation } from 'react-i18next';

//components
import ConsultationForm from '@/components/consultation-form';
import SEOHeaderComponent from '@/components/seo-header';

//styles
import styles from '@/scss/contact-page.module.scss';
import {
  email,
  phoneNumber,
  phoneNumberHref,
  zaloHref,
} from '@/constant/general';
import { useReveal, useScrollAnimation } from '@/utils/gsap';

type Step = { description: string; title: string };

const pad = (index: number) => String(index + 1).padStart(2, '0');

const ContactPage = () => {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);

  const links = [
    {
      label: t('common.phone'),
      value: phoneNumber,
      href: `tel:${phoneNumberHref}`,
    },
    {
      label: t('contact.zalo'),
      value: t('home.landing.form.zalo'),
      href: zaloHref,
      external: true,
    },
    { label: t('common.email'), value: email, href: `mailto:${email}` },
  ];
  const steps = t('contact.process.items', { returnObjects: true }) as Step[];

  useReveal(ref);

  // The line above the process steps draws left to right, then the steps follow.
  useScrollAnimation(ref, ({ gsap, mobile }) => {
    const scrollTrigger = {
      trigger: '[data-line]',
      start: 'top 85%',
      once: true,
    };

    gsap.from('[data-line]', {
      scaleX: 0,
      duration: 1.4,
      ease: 'power3.inOut',
      scrollTrigger,
    });
    gsap.from('[data-step]', {
      y: mobile ? 16 : 28,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger,
    });
  });

  return (
    <>
      <SEOHeaderComponent
        title={t('seo.title_contact')}
        description={t('seo.description_contact')}
        keywords={t('seo.keywords_contact')}
        breadcrumbs={[
          { name: t('breadcrumbs.home'), url: '/' },
          { name: t('contact.title'), url: '/contact' },
        ]}
      />

      <div ref={ref}>
        <section className={styles.hero}>
          <span className={styles.eyebrow}>{t('contact.title')}</span>
          <h1>{t('contact.consultationTitle')}</h1>
          <p>{t('contact.description')}</p>
        </section>

        <section className={styles.main}>
          <div className={styles.mainInner}>
            <div className={styles.reach}>
              <h2>{t('contact.reachTitle')}</h2>
              <p className={styles.person}>{t('contact.personName')}</p>
              <ul className={styles.details}>
                {links.map(({ label, value, href, external }) => (
                  <li key={label} data-reveal>
                    <a
                      className={styles.row}
                      href={href}
                      {...(external && {
                        target: '_blank',
                        rel: 'noopener noreferrer',
                      })}
                    >
                      <span className={styles.label}>{label}</span>
                      <span className={styles.value}>{value}</span>
                      <BsArrowUpRight
                        className={styles.arrow}
                        aria-hidden="true"
                        focusable="false"
                      />
                    </a>
                  </li>
                ))}
                <li data-reveal>
                  <div className={styles.row}>
                    <span className={styles.label}>{t('contact.office')}</span>
                    <address className={styles.value}>
                      <span>{t('contact.office_address_detail')}</span>
                      <span>{t('contact.office_address')}</span>
                    </address>
                  </div>
                </li>
                <li data-reveal>
                  <div className={styles.row}>
                    <span className={styles.label}>{t('header.hours')}</span>
                    <span className={styles.value}>
                      {t('contact.time_active')}
                    </span>
                  </div>
                </li>
              </ul>
            </div>

            <div className={styles.formCard} data-reveal>
              <h2>{t('home.landing.form.title')}</h2>
              <p>{t('home.landing.form.description')}</p>
              <ConsultationForm className={styles.form} />
            </div>
          </div>
        </section>

        <section className={styles.process}>
          <div className={styles.processInner}>
            <h2 data-reveal>{t('contact.process.title')}</h2>
            <div className={styles.steps}>
              <span className={styles.stepsLine} data-line aria-hidden="true" />
              <ol className={styles.stepList}>
                {steps.map((step, index) => (
                  <li key={step.title} data-step>
                    <span>{pad(index)}</span>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ContactPage;
