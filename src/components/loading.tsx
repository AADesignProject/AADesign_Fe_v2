import React from 'react';

//styles
import styles from '@/scss/loading.module.scss';

const LoadingComponent = () => {
  return (
    <div className={styles.wrapperLoading}>
      <div className={styles.loader} />
    </div>
  );
};

export default LoadingComponent;
