import Link from 'next/link';
import { useTranslation } from 'react-i18next';

import ConsultationForm from '@/components/consultation-form';
import { phoneNumber, phoneNumberHref, zaloHref } from '@/constant/general';
import styles from '@/scss/home-page.module.scss';

const HomeContact = () => {
  const { t } = useTranslation();

  return (
    <section id="consultation-form" className={styles.contact}>
      <div className={styles.contactInner}>
        <div className={styles.contactIntro}>
          <h2>{t('home.landing.form.title')}</h2>
          <p>{t('home.landing.form.description')}</p>
          <div className={styles.contactActions}>
            <a
              href={zaloHref}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.contactButton}
            >
              {t('home.landing.form.zalo')}
            </a>
            <Link href={`tel:${phoneNumberHref}`} className={styles.textLink}>
              {t('home.landing.form.call', { phone: phoneNumber })}
            </Link>
          </div>
        </div>
        <ConsultationForm className={styles.form} />
      </div>
    </section>
  );
};

export default HomeContact;
