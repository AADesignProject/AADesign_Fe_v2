import React, { memo } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

//components
import SEOHeaderComponent from '@/components/seo-header';
import HeaderTitlePage from '@/components/header-title-page';

//styles
import styles from '@/scss/contact-page.module.scss';
import { email, phoneNumber, phoneNumberHref } from '@/constant/general';

const ContactPage = () => {
  const { t } = useTranslation();

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
      <div className={styles.wrapperContactPage}>
        <div className={styles.containerContactPage}>
          <div className={styles.pageIntro}>
            <HeaderTitlePage title={t('contact.title')} />
            <p>{t('contact.description')}</p>
          </div>

          <div className={styles.wrapperContent}>
            <section className={styles.consultationPanel}>
              <span>{t('contact.sectionLabel')}</span>
              <h2>{t('contact.consultationTitle')}</h2>
              <p>{t('contact.consultationDescription')}</p>
              <div className={styles.contactActions}>
                <Link href={`tel:${phoneNumberHref}`}>
                  {t('contact.actions.call', { phone: phoneNumber })}
                </Link>
                <Link href={`mailto:${email}`}>
                  {t('contact.actions.email')}
                </Link>
              </div>
              <dl className={styles.contactDetails}>
                <div>
                  <dt>{t('common.phone')}</dt>
                  <dd>
                    <Link href={`tel:${phoneNumberHref}`}>{phoneNumber}</Link>
                  </dd>
                </div>
                <div>
                  <dt>{t('common.email')}</dt>
                  <dd>
                    <Link href={`mailto:${email}`}>{email}</Link>
                  </dd>
                </div>
              </dl>
            </section>

            <section className={styles.boxContent}>
              <h2 className={styles.title}>{t('contact.live')}</h2>
              <div className={styles.description}>
                <p>{t('contact.personName')}</p>
                <Link href={`tel:${phoneNumberHref}`}>T: {phoneNumber}</Link>
                <Link href={`mailto:${email}`}>E: {email}</Link>
              </div>
            </section>

            <section className={styles.boxContent}>
              <h2 className={styles.title}>{t('contact.office')}</h2>
              <address className={styles.description}>
                <p>{t('contact.office_address_detail')}</p>
                <p>{t('contact.office_address')}</p>
                <p>{t('contact.time_active')}</p>
              </address>
            </section>
          </div>

          <div className={styles.processStrip}>
            <div>
              <span>01</span>
              <p>{t('contact.process.listen')}</p>
            </div>
            <div>
              <span>02</span>
              <p>{t('contact.process.orient')}</p>
            </div>
            <div>
              <span>03</span>
              <p>{t('contact.process.propose')}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(ContactPage);
