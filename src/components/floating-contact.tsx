import { useTranslation } from 'react-i18next';
import { BsFillTelephoneFill } from 'react-icons/bs';

import { phoneNumber, phoneNumberHref, zaloHref } from '@/constant/general';
import styles from '@/scss/floating-contact.module.scss';

const FloatingContactComponent = () => {
  const { t } = useTranslation();

  return (
    <nav className={styles.stack} aria-label={t('floatingContact.label')}>
      <a
        className={`${styles.action} ${styles.zalo}`}
        href={zaloHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t('floatingContact.zalo')}
      >
        <span className={styles.pulse} aria-hidden="true" />
        <span className={styles.zaloText} aria-hidden="true">
          Zalo
        </span>
      </a>

      <a
        className={`${styles.action} ${styles.phone}`}
        href={`tel:${phoneNumberHref}`}
        aria-label={t('floatingContact.call', { phone: phoneNumber })}
      >
        <span className={styles.pulse} aria-hidden="true" />
        <BsFillTelephoneFill aria-hidden="true" focusable="false" />
      </a>
    </nav>
  );
};

export default FloatingContactComponent;
