import React from 'react';
import { useTranslation } from 'react-i18next';

//styles
import styles from '@/scss/loading.module.scss';

const LoadingComponent = () => {
  const { t } = useTranslation();

  return (
    <div
      className={styles.wrapperLoading}
      role="status"
      aria-live="polite"
      aria-label={t('aria.loading')}
    >
      <div className={styles.loader} aria-hidden="true" />
      <span className={styles.loadingText}>{t('aria.loading')}</span>
    </div>
  );
};

export default LoadingComponent;
