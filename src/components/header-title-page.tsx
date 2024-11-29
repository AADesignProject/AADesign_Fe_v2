import React, { memo } from 'react';

//styles
import styles from '@/scss/header-title.module.scss';

interface IHeaderTitlePage {
  title: string;
  className?: string;
}

const HeaderTitlePage = ({ title, className }: IHeaderTitlePage) => {
  return (
    <div className={`${styles.wrapperHeaderTitle} ${className}`}>
      <h1>{title}</h1>
    </div>
  );
};

export default memo(HeaderTitlePage);
