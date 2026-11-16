import { BsArrowUpRight } from 'react-icons/bs';
import { useTranslation } from 'react-i18next';

import {
  email,
  phoneNumber,
  phoneNumberHref,
  zaloHref,
} from '@/constant/general';
import styles from '@/scss/home-page.module.scss';

const HomeContact = () => {
  const { t } = useTranslation();

  return (
    <section
      id="contact"
      className={styles.contact}
      aria-labelledby="contact-title"
    >
      <div className={styles.contactInner}>
        <h2 id="contact-title" className={styles.contactTitle}>
          {t('home.landing.contact.title')}
        </h2>
        <p className={styles.contactText}>
          {t('home.landing.contact.description')}
        </p>
        <a
          href={`tel:${phoneNumberHref}`}
          className={styles.contactPhone}
          aria-label={t('common.call', { phone: phoneNumber })}
        >
          <span>{phoneNumber}</span>
          <BsArrowUpRight aria-hidden="true" focusable="false" />
        </a>
        <div className={styles.contactActions}>
          <a
            href={zaloHref}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.contactButton}
          >
            {t('common.zalo')}
          </a>
          <a href={`mailto:${email}`} className={styles.textLink}>
            {email}
          </a>
          <p className={styles.contactMeta}>
            {t('header.hours')}: {t('contact.time_active')}
          </p>
        </div>
      </div>
    </section>
  );
};

export default HomeContact;
