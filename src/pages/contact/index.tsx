import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';

//components
import SEOHeaderComponent from '@/components/seo-header';
import HeaderTitlePage from '@/components/header-title-page';

//styles
import styles from '@/scss/contact-page.module.scss';
import Link from 'next/link';
import { email, phoneNumber } from '@/constant/general';

const ContactPage = () => {
  const { t } = useTranslation();
  return (
    <>
      <SEOHeaderComponent
        title="Contact"
        description={t('description_homepage')}
        keywords="construction, design, aa-design construction, aa design construction, la thien phi, công trình la thiên phi, công trình,"
      />
      <div className={styles.wrapperContactPage}>
        <div className={styles.containerContactPage}>
          <HeaderTitlePage title={t('contact.title')} />

          <div className={styles.wrapperContent}>
            <div className={styles.boxContent}>
              <h2 className={styles.title}>{t('contact.live')}</h2>
              <div className={styles.description}>
                <p>Mr La thien phi</p>
                <Link href={`tel: ${phoneNumber}`}>T: (+84) 988 998 123</Link>
                <Link href={`mailto: ${email}`}>E: {email}</Link>
              </div>
            </div>
            <div className={styles.boxContent}>
              <h2 className={styles.title}>{t('contact.office')}</h2>
              <div className={styles.description}>
                <p>{t('contact.office_address_detail')}</p>
                <p>{t('contact.office_address')}</p>
                <p>{t('contact.time_active')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(ContactPage);
